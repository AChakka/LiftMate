import cv2
import torch
from ultralytics import YOLO

# Load the trained classification model
model = YOLO("/Users/kentohopkins/Desktop/LiftMate/dataset/Excersise/runs/classify/train2/weights/best.pt")  # Update path

# Open webcam (0 is the default webcam)
cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Convert the frame into a format YOLO can process
    img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Perform classification
    results = model(img)

    # Extract classification results
    class_id = results[0].probs.top1  # Get index of highest probability class
    class_name = model.names[class_id]  # Get class name

    # Display result
    label = f"Exercise: {class_name}"
    cv2.putText(frame, label, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # Show frame with classification
    cv2.imshow("Exercise Classification", frame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()