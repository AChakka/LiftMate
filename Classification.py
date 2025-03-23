from ultralytics import YOLO

# Load a COCO-pretrained YOLO12n model
model = YOLO("yolov8n-cls.pt")

result = model.train(data='/Users/kentohopkins/Documents/GitHub/LiftMate/dataset/Excersise/', epochs=20, imgsz=224)