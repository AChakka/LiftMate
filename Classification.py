import cv2
import torch
from ultralytics import YOLO

# Load a COCO-pretrained YOLO8n model
model = YOLO("yolov8n-cls.pt")

result = model.train(data='/Users/kentohopkins/Desktop/LiftMate/dataset/Excersise', epochs=20, imgsz=224)