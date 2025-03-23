import React, { useState, useEffect, useRef } from 'react';
import './CameraTracker.css';
import { useNavigate } from 'react-router-dom';

function CameraTracker() {


  const navigate = useNavigate();

  const [exerciseType, setExerciseType] = useState('squat');
  const [sessionId, setSessionId] = useState(null);
  const [formAnalysis, setFormAnalysis] = useState(null);
  const [classification, setClassification] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const captureIntervalRef = useRef(null);
  
  // API endpoint base URL
  const API_URL = 'http://localhost:5000';
  
  // Initialize webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setError(`Webcam error: ${err.message}`);
      console.error('Error accessing webcam:', err);
    }
  };
  
  // Stop webcam
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };
  
  // Capture frame and send to server
  const captureFrame = async () => {
    if (!videoRef.current || !streamRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL('image/jpeg');
    
    try {
      // First classify the exercise
      const classifyResponse = await fetch(`${API_URL}/classify_exercise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
      });
      
      if (!classifyResponse.ok) {
        throw new Error(`Classification failed: ${classifyResponse.statusText}`);
      }
      
      const classifyData = await classifyResponse.json();
      setClassification(classifyData.classification);
      
      // Then analyze form
      const analyzeResponse = await fetch(`${API_URL}/analyze_form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          exercise_type: exerciseType,
          session_id: sessionId
        })
      });
      
      if (!analyzeResponse.ok) {
        throw new Error(`Form analysis failed: ${analyzeResponse.statusText}`);
      }
      
      // Handle NaN values in JSON by first getting the text response
      const responseText = await analyzeResponse.text();
      // Replace NaN values with null before parsing as JSON
      const processedText = responseText.replace(/: NaN/g, ': null');
      
      try {
        const analyzeData = JSON.parse(processedText);
        setFormAnalysis(analyzeData);
        
        // Set session ID if we don't have one yet
        if (!sessionId && analyzeData.session && analyzeData.session.session_id) {
          setSessionId(analyzeData.session.session_id);
        }
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError, processedText);
        setError('Error processing server response. See console for details.');
      }
    } catch (err) {
      setError(`API error: ${err.message}`);
      console.error('Error sending frame to server:', err);
    }
  };
  
  // Start continuous capture
  const startCapture = () => {
    setIsCapturing(true);
    // Capture a frame every 1 second
    captureIntervalRef.current = setInterval(captureFrame, 1000);
  };
  
  // Stop continuous capture
  const stopCapture = () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    setIsCapturing(false);
  };
  
  // Initialize webcam on component mount
  useEffect(() => {
    startWebcam();
    
    // Cleanup on unmount
    return () => {
      stopWebcam();
      stopCapture();
    };
  }, []);
  
  // Render keypoints on canvas
  const renderKeypoints = () => {
    if (!formAnalysis || !formAnalysis.keypoints || formAnalysis.keypoints.length === 0) {
      return null;
    }
    
    const keypoints = formAnalysis.keypoints;
    const canvasWidth = 300;
    const canvasHeight = 400;
    
    // Find max dimensions
    let maxX = 0, maxY = 0;
    keypoints.forEach(point => {
      maxX = Math.max(maxX, point[0]);
      maxY = Math.max(maxY, point[1]);
    });
    
    const scale = Math.min(canvasWidth / maxX, canvasHeight / maxY) * 0.9;
    
    return (
      <svg width={canvasWidth} height={canvasHeight} className="keypoints-canvas">
        {/* Draw skeleton lines */}
        {/* Example: connect shoulders */}
        {keypoints[5] && keypoints[6] && (
          <line 
            x1={keypoints[5][0] * scale} y1={keypoints[5][1] * scale}
            x2={keypoints[6][0] * scale} y2={keypoints[6][1] * scale}
            stroke="blue" strokeWidth="3"
          />
        )}
        {/* Connect more body parts as needed */}
        {/* Torso */}
        {keypoints[5] && keypoints[11] && (
          <line 
            x1={keypoints[5][0] * scale} y1={keypoints[5][1] * scale}
            x2={keypoints[11][0] * scale} y2={keypoints[11][1] * scale}
            stroke="blue" strokeWidth="3"
          />
        )}
        {keypoints[6] && keypoints[12] && (
          <line 
            x1={keypoints[6][0] * scale} y1={keypoints[6][1] * scale}
            x2={keypoints[12][0] * scale} y2={keypoints[12][1] * scale}
            stroke="blue" strokeWidth="3"
          />
        )}
        {/* Hips */}
        {keypoints[11] && keypoints[12] && (
          <line 
            x1={keypoints[11][0] * scale} y1={keypoints[11][1] * scale}
            x2={keypoints[12][0] * scale} y2={keypoints[12][1] * scale}
            stroke="blue" strokeWidth="3"
          />
        )}
        {/* Left arm */}
        {keypoints[5] && keypoints[7] && (
          <line 
            x1={keypoints[5][0] * scale} y1={keypoints[5][1] * scale}
            x2={keypoints[7][0] * scale} y2={keypoints[7][1] * scale}
            stroke="green" strokeWidth="3"
          />
        )}
        {keypoints[7] && keypoints[9] && (
          <line 
            x1={keypoints[7][0] * scale} y1={keypoints[7][1] * scale}
            x2={keypoints[9][0] * scale} y2={keypoints[9][1] * scale}
            stroke="green" strokeWidth="3"
          />
        )}
        {/* Right arm */}
        {keypoints[6] && keypoints[8] && (
          <line 
            x1={keypoints[6][0] * scale} y1={keypoints[6][1] * scale}
            x2={keypoints[8][0] * scale} y2={keypoints[8][1] * scale}
            stroke="green" strokeWidth="3"
          />
        )}
        {keypoints[8] && keypoints[10] && (
          <line 
            x1={keypoints[8][0] * scale} y1={keypoints[8][1] * scale}
            x2={keypoints[10][0] * scale} y2={keypoints[10][1] * scale}
            stroke="green" strokeWidth="3"
          />
        )}
        {/* Left leg */}
        {keypoints[11] && keypoints[13] && (
          <line 
            x1={keypoints[11][0] * scale} y1={keypoints[11][1] * scale}
            x2={keypoints[13][0] * scale} y2={keypoints[13][1] * scale}
            stroke="red" strokeWidth="3"
          />
        )}
        {keypoints[13] && keypoints[15] && (
          <line 
            x1={keypoints[13][0] * scale} y1={keypoints[13][1] * scale}
            x2={keypoints[15][0] * scale} y2={keypoints[15][1] * scale}
            stroke="red" strokeWidth="3"
          />
        )}
        {/* Right leg */}
        {keypoints[12] && keypoints[14] && (
          <line 
            x1={keypoints[12][0] * scale} y1={keypoints[12][1] * scale}
            x2={keypoints[14][0] * scale} y2={keypoints[14][1] * scale}
            stroke="red" strokeWidth="3"
          />
        )}
        {keypoints[14] && keypoints[16] && (
          <line 
            x1={keypoints[14][0] * scale} y1={keypoints[14][1] * scale}
            x2={keypoints[16][0] * scale} y2={keypoints[16][1] * scale}
            stroke="red" strokeWidth="3"
          />
        )}
        
        {/* Draw keypoints */}
        {keypoints.map((point, index) => (
          <circle 
            key={index} 
            cx={point[0] * scale} 
            cy={point[1] * scale} 
            r="6" 
            fill="#c0c0c0" 
            stroke="#4caf50" 
            strokeWidth="2"
          />
        ))}
      </svg>
    );
  };
  
  return (
    <div className="app-container">
            <button className="back-button2" onClick={() => navigate('/')}>
                  ⬅️ Back to LiftMate
              </button>
      <h1>Exercise Form Analyzer</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="main-content">
        <div className="split-layout">
          <div className="analysis-container">
            <div className="results-column">
              <h2>Form Analysis</h2>
              {formAnalysis ? (
                <div className="form-data">
                  <div className="keypoints-visualization">
                    {renderKeypoints()}
                  </div>
                  
                  <div className="form-details">
                    <h3>Overall: {formAnalysis.analysis.overall}</h3>
                    
                    {formAnalysis.analysis.measurements && (
                      <div className="measurements">
                        <h3>Measurements:</h3>
                        <ul>
                          {Object.entries(formAnalysis.analysis.measurements).map(([key, value]) => (
                            <li key={key}>
                              {key.replace('_', ' ')}: {value === null ? 'N/A' : `${value}°`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <h3>Issues:</h3>
                    {formAnalysis.analysis.issues.length > 0 ? (
                      <ul className="issues-list">
                        {formAnalysis.analysis.issues.map((issue, index) => (
                          <li key={index} className="issue-item">{issue}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No issues detected!</p>
                    )}
                  </div>
                </div>
              ) : (
                <p>No form analysis data yet</p>
              )}
            </div>
            
            <div className="results-column">
              <h2>Classification</h2>
              {classification ? (
                <div className="classification-data">
                  <p><strong>Exercise:</strong> {classification.exercise}</p>
                  <p><strong>Confidence:</strong> {classification.confidence}%</p>
                  
                  <h3>All Confidences:</h3>
                  <ul>
                    {Object.entries(classification.all_confidences).map(([exercise, confidence]) => (
                      <li key={exercise}>
                        {exercise}: {confidence}%
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No classification data yet</p>
              )}
            </div>
          </div>
          
          <div className="webcam-container">
            <video 
              ref={videoRef} 
              autoPlay 
              width="640" 
              height="480" 
              className="webcam-video"
            />
            
            <div className="controls">
              <div className="control-row">
                <label>
                  Exercise Type:
                  <select 
                    value={exerciseType}
                    onChange={(e) => setExerciseType(e.target.value)}
                    disabled={isCapturing}
                  >
                    <option value="squat">Squat</option>
                  </select>
                </label>
              </div>
              
              <div className="control-row">
                <button 
                  onClick={isCapturing ? stopCapture : startCapture}
                  className={isCapturing ? "btn-stop" : "btn-start"}
                >
                  {isCapturing ? "Stop Capture" : "Start Capture"}
                </button>
                
                <button 
                  onClick={captureFrame}
                  disabled={isCapturing || !streamRef.current}
                  className="btn-capture"
                >
                  Capture Single Frame
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CameraTracker;