import cv2
import torch
from ultralytics import YOLO

# Load the trained classification model
model = YOLO(r"C:\Users\adith\LiftMate-1\runs\classify\train\weights\best.pt")  # Update path

# Open webcam (0 is the default webcam)
cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

   
    img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = model(img)
   
    class_id = results[0].probs.top1  
    class_name = model.names[class_id]  

  
    label = f"Exercise: {class_name}"
    cv2.putText(frame, label, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)


    cv2.imshow("Exercise Classification", frame)


    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
cap.release()
cv2.destroyAllWindows()