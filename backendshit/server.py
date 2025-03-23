from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import numpy as np
import cv2
import base64
from io import BytesIO
from PIL import Image
import time
import os
import uuid
import sys


app = Flask(__name__)
CORS(app)  

class FormAnalyzer:

    def __init__(self):
        self.keypoint_names = [
            "nose", "left_eye", "right_eye", "left_ear", "right_ear",
            "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
            "left_wrist", "right_wrist", "left_hip", "right_hip",
            "left_knee", "right_knee", "left_ankle", "right_ankle"
        ]
        
        self.ideal_angles = {
            "squat": {
                "hip": 90.0, 
                "knee": 110.0,  
                "ankle": 70.0,  
            }
        }
        
        self.angle_thresholds = {
            "squat": {
                "hip": 45.0,     
                "knee": 45.0,    
                "ankle": 40.0,   
            }
        }
    
    def calculate_angle(self, a, b, c):
        ba = np.array(a) - np.array(b)
        bc = np.array(c) - np.array(b)
        
        cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
        cosine_angle = np.clip(cosine_angle, -1.0, 1.0)  
        angle = np.arccos(cosine_angle)
        
        return np.degrees(angle)
    
    def calculate_vertical_angle(self, a, b):
        vertical = np.array([0, -1])  
        direction = np.array(b) - np.array(a)
        
        cosine_angle = np.dot(vertical, direction) / (np.linalg.norm(vertical) * np.linalg.norm(direction))
        cosine_angle = np.clip(cosine_angle, -1.0, 1.0)
        angle = np.arccos(cosine_angle)
        
        return np.degrees(angle)
    
    def analyze_squat_form(self, keypoints):
        feedback = {"issues": [], "overall": "good"}
        
        try:
            left_shoulder = keypoints[self.keypoint_names.index("left_shoulder")]
            right_shoulder = keypoints[self.keypoint_names.index("right_shoulder")]
            left_hip = keypoints[self.keypoint_names.index("left_hip")]
            right_hip = keypoints[self.keypoint_names.index("right_hip")]
            left_knee = keypoints[self.keypoint_names.index("left_knee")]
            right_knee = keypoints[self.keypoint_names.index("right_knee")]
            left_ankle = keypoints[self.keypoint_names.index("left_ankle")]
            right_ankle = keypoints[self.keypoint_names.index("right_ankle")]
            
            hip_angle_left = self.calculate_angle(left_shoulder, left_hip, left_knee)
            hip_angle_right = self.calculate_angle(right_shoulder, right_hip, right_knee)
            hip_angle = (hip_angle_left + hip_angle_right) / 2
            
            knee_angle_left = self.calculate_angle(left_hip, left_knee, left_ankle)
            knee_angle_right = self.calculate_angle(right_hip, right_knee, right_ankle)
            knee_angle = (knee_angle_left + knee_angle_right) / 2
            
            torso_angle_left = self.calculate_vertical_angle(left_shoulder, left_hip)
            torso_angle_right = self.calculate_vertical_angle(right_shoulder, right_hip)
            torso_angle = (torso_angle_left + torso_angle_right) / 2
            
            if abs(hip_angle - self.ideal_angles["squat"]["hip"]) > self.angle_thresholds["squat"]["hip"]:
                feedback["issues"].append("Your Hip angle is incorrect FIX IT NOW.")
            
            if abs(knee_angle - self.ideal_angles["squat"]["knee"]) > self.angle_thresholds["squat"]["knee"]:
                if knee_angle < self.ideal_angles["squat"]["knee"]:
                    feedback["issues"].append(" Your Knees are bending too much. Don't go so DEEP.")
                else:
                    feedback["issues"].append("Knees are not bending enough. Lower your squat position.")
            
            if torso_angle > 75:
                feedback["issues"].append("Your torso is leaning too far forward keep your chest up.")
            
            if abs(hip_angle_left - hip_angle_right) > 30:
                feedback["issues"].append("Hips are not level. Balance your weight evenly.")
            
            if abs(knee_angle_left - knee_angle_right) > 30:
                feedback["issues"].append("Knees are not tracking evenly. Ensure even weight distribution.")
            
            shoulder_y = (left_shoulder[1] + right_shoulder[1]) / 2
            hip_y = (left_hip[1] + right_hip[1]) / 2
            knee_y = (left_knee[1] + right_knee[1]) / 2
            
            if (knee_y <= hip_y - 20):
                feedback["issues"].append("Not squatting deep enough. Lower your hips below your knees.")
            
            if len(feedback["issues"]) > 3:
                feedback["overall"] = "poor"
            elif len(feedback["issues"]) > 1:
                feedback["overall"] = "fair"
            
            feedback["measurements"] = {
                "hip_angle": round(hip_angle, 1),
                "knee_angle": round(knee_angle, 1),
                "torso_angle": round(torso_angle, 1),
            }
            
        except (ValueError, IndexError) as e:
            feedback["issues"].append(f"Could not detect all necessary joints: {str(e)}")
            feedback["overall"] = "unknown"
        
        return feedback
    
    def analyze_form(self, keypoints, exercise_type):
        if exercise_type.lower() == "squat":
            return self.analyze_squat_form(keypoints)
        else:
            return {"issues": [f"Exercise type '{exercise_type}' not supported"], "overall": "unknown"}


class PoseEstimator:
    def __init__(self):
        print("Loading pose model...")
        try:
            from ultralytics import YOLO
            self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
            print(f"Using device: {self.device}")
            
            self.model = YOLO('yolov8n-pose.pt')
            
            if self.device == 'cuda':
                self.model.to('cuda')
            
            self.model_loaded = True
            print(" model loaded successfully")
        except Exception as e:
            print(f"Error loading YOLOv8 model: {e}")
            print("Falling back to mock data for development")
            self.model = None
            self.model_loaded = False
            self.device = 'cpu'
    
    def extract_pose(self, image):
        height, width = image.shape[:2]
        
        if self.model_loaded:
            try:
                results = self.model(image)
                
                if len(results) > 0 and len(results[0].keypoints.data) > 0:
                    if len(results[0].keypoints.data) > 0:
                        kpts = results[0].keypoints.data[0].cpu().numpy()
                    
                    keypoints = []
                    for kpt in kpts:
                        x, y, conf = kpt
                        if conf > 0.5:
                            keypoints.append([float(x), float(y)])
                        else:
                            keypoints.append([float(x), float(y)])
                    
                    return keypoints
                
                print("No person detected in the image, using placeholder data")
            except Exception as e:
                print(f"Error: {e}")
                print("Fallbacl")
        
        positions = [
            [0.5, 0.1],
            [0.48, 0.095],
            [0.52, 0.095],
            [0.465, 0.1],
            [0.535, 0.1],
            [0.45, 0.15],
            [0.55, 0.15],
            [0.4, 0.25],
            [0.6, 0.25],
            [0.35, 0.35],
            [0.65, 0.35],
            [0.45, 0.4],
            [0.55, 0.4],
            [0.43, 0.6],
            [0.57, 0.6],
            [0.42, 0.85],
            [0.58, 0.85]
        ]
        
        keypoints = []
        for pos in positions:
            x, y = pos
            keypoints.append([x * width, y * height])
        
        return keypoints


class WorkoutSession:
    def __init__(self, session_id=None, exercise_type=None):
        self.session_id = session_id or str(uuid.uuid4())
        self.exercise_type = exercise_type
        self.start_time = time.time()
        self.last_update_time = self.start_time
        self.frames = []
        self.form_issues = {}
        self.is_active = True
        
        self.common_issues = {}
    
    def update(self, keypoints, analysis):
        frame_data = {
            "timestamp": time.time(),
            "keypoints": keypoints,
            "analysis": analysis
        }
        
        self.frames.append(frame_data)
        self.last_update_time = time.time()
        
        for issue in analysis.get("issues", []):
            if issue in self.form_issues:
                self.form_issues[issue] += 1
            else:
                self.form_issues[issue] = 1
        
        self._update_common_issues()
        
        return {
            "session_id": self.session_id,
            "duration": round(time.time() - self.start_time, 1),
            "common_issues": self.common_issues
        }
    
    def _update_common_issues(self):
        total_frames = len(self.frames)
        if total_frames > 0:
            self.common_issues = {
                issue: {
                    "count": count,
                    "percentage": round(count / total_frames * 100, 1)
                }
                for issue, count in self.form_issues.items()
                if count > max(1, total_frames * 0.15)
            }
    
    def get_summary(self):
        duration = time.time() - self.start_time
        
        total_frames = len(self.frames)
        good_form_frames = sum(1 for frame in self.frames if frame["analysis"].get("overall") in ["good", "fair"])
        form_quality_pct = round(good_form_frames / total_frames * 100, 1) if total_frames > 0 else 0
        
        sorted_issues = sorted(
            self.common_issues.items(),
            key=lambda x: x[1]["count"],
            reverse=True
        )
        
        top_issues = [{"issue": issue, **data} for issue, data in sorted_issues[:3] 
                     if data["percentage"] > 25]
        
        return {
            "session_id": self.session_id,
            "exercise_type": self.exercise_type,
            "duration": round(duration, 1),
            "form_quality": form_quality_pct,
            "top_issues": top_issues,
            "completed": not self.is_active
        }
    
    def end_session(self):
        self.is_active = False
        return self.get_summary()


active_sessions = {}

pose_estimator = PoseEstimator()
form_analyzer = FormAnalyzer()

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "timestamp": time.time()})

@app.route("/analyze_form", methods=["POST"])
def analyze_form():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        image_b64 = data.get("image")
        exercise_type = data.get("exercise_type")
        session_id = data.get("session_id")
        
        if not image_b64:
            return jsonify({"error": "No image provided"}), 400
        if not exercise_type:
            return jsonify({"error": "No exercise type provided"}), 400
        
        if exercise_type.lower() != "squat":
            return jsonify({"error": "Unsupported exercise type. Only 'squat' is supported."}), 400
        
        try:
            if "base64," in image_b64:
                image_b64 = image_b64.split("base64,")[1]
            
            image_data = base64.b64decode(image_b64)
            image = Image.open(BytesIO(image_data))
            image_np = np.array(image)
            
            if image_np.shape[2] == 3:
                image_np = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)
        except Exception as e:
            return jsonify({"error": f"Invalid image data: {str(e)}"}), 400
        
        keypoints = pose_estimator.extract_pose(image_np)
        
        analysis = form_analyzer.analyze_form(keypoints, exercise_type)
        
        session_data = None
        if session_id:
            if session_id in active_sessions:
                session = active_sessions[session_id]
                session_data = session.update(keypoints, analysis)
            else:
                session = WorkoutSession(session_id=session_id, exercise_type=exercise_type)
                active_sessions[session_id] = session
                session_data = session.update(keypoints, analysis)
        else:
            session = WorkoutSession(exercise_type=exercise_type)
            active_sessions[session.session_id] = session
            session_data = session.update(keypoints, analysis)
        
        response = {
            "analysis": analysis,
            "keypoints": keypoints,
            "timestamp": time.time(),
            "session": session_data
        }
        
        return jsonify(response)
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route("/session/<session_id>", methods=["GET"])
def get_session(session_id):
    if session_id in active_sessions:
        return jsonify(active_sessions[session_id].get_summary())
    else:
        return jsonify({"error": "Session not found"}), 404

@app.route("/session/<session_id>", methods=["DELETE"])
def end_session(session_id):
    if session_id in active_sessions:
        summary = active_sessions[session_id].end_session()
        return jsonify(summary)
    else:
        return jsonify({"error": "Session not found"}), 404

@app.route("/version", methods=["GET"])
def version():
    return jsonify({
        "api_version": "0.2.0",
        "model_version": "YOLOv11-placeholder",
        "supported_exercises": ["squat"]
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    
    app.run(host="0.0.0.0", port=port, debug=True)