# LiftMate: AI-Powered Exercise Accistant
## Overview
LiftMate is an AI-driven fitness application that utilizes YOLOv8 for real-time classification of weightlifting exercises and form detection to help prevent serious injuries. The model is designed to detect and analyze the “Big 3” exercises—bench press, deadlift, and squat—providing users with immediate feedback to improve their technique.

## Features
* Real-time Exercise Classification: Detects whether the user is performing a squat or a deadlift.
* Form Analysis: Provides insights on posture and hand placement.
* Webcam Integration: Captures and classifies exercises in real-time.
* Inference: Uses optimized YOLOv8 models for efficient processing.
* User Intractive Chatbot: Unique chatbot that provide user friendly and intimacy community

## Theory Behind LiftMate
### 1. Object Detection and Classification
LiftMate employs YOLO (You Only Look Once) specifically YOLOv8 which is a deep learning-based model optimized for real-time detection and classification tasks. Unlike traditional machine learning methods that rely on handcrafted features, YOLOv8 uses a Convolutional Neural Network (CNN) to learn spatial hierarchies of features from data automatically.

* Single-Stage Detection: YOLOv8 divides the image into a grid and predicts bounding boxes and class probabilities in a single pass, making it fast and efficient for real-time applications.
* Feature Extraction: The model extracts patterns such as limb positions and posture differences to distinguish between exercises like squats, deadlifts, and bench presses.
/Users/kentohopkins/Desktop/Screenshot 2025-03-23 at 6.00.20 AM.png
* Classification Output: Based on the extracted features, YOLOv8 assigns probabilities to each exercise class and determines the most probable movement.
