from ultralytics import YOLO

# Load a COCO-pretrained YOLO12n model
model = YOLO("yolov8n-cls.pt")

result = model.train(data='dataset/Excersise', epochs=20, imgsz=20)