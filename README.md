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
* <img width="1512" alt="Screenshot 2025-03-23 at 5 59 58 AM" src="https://github.com/user-attachments/assets/042bcca5-d137-4247-97fb-39272717cbb8" />
* <img width="1512" alt="Screenshot 2025-03-23 at 6 00 20 AM" src="https://github.com/user-attachments/assets/2b7cafea-40fe-4917-ae73-209e4dc0eacd" />
* <img width="1512" alt="Screenshot 2025-03-23 at 6 01 10 AM" src="https://github.com/user-attachments/assets/f74226df-8813-4756-b50d-01388df027f1" />
* <img width="1512" alt="Screenshot 2025-03-23 at 6 00 46 AM" src="https://github.com/user-attachments/assets/2771ad8f-0972-4e16-99c7-45bb37256b25" />
* <img width="1512" alt="Screenshot 2025-03-23 at 6 00 34 AM" src="https://github.com/user-attachments/assets/9d5540e0-48b5-4f90-ae42-5f0bca0cfce7" />

* Classification Output: Based on the extracted features, YOLOv8 assigns probabilities to each exercise class and determines the most probable movement.

## Contributors
* Kento Hopkins - Co-lead developer for Backend. Implemented Object Detection and Exercise Classification.
* Adithya Chakka - Co-lead developer for Backend. Implemented Form Detection.
* Agampreet Bajaj - Co-lead developer for Front-end and User Intractive Chatbot.
* Henry Greene - Co-lead developer for Frontend and Visualization.
