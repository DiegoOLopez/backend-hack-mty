from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from deepface import DeepFace
import numpy as np
from PIL import Image
import io
import cv2

app = FastAPI(title="Face & Emotion Recognition API")

@app.post("/analyze")
async def analyze_face(file: UploadFile = File(...)):
    try:
        # Leer contenido del archivo
        contents = await file.read()
        if not contents:
            return JSONResponse({"error": "No se recibió contenido en la imagen"})
        
        contents = await file.read()
        print("Nombre de archivo:", file.filename)
        print("Tipo MIME:", file.content_type)
        print("Tamaño recibido:", len(contents))


        # Intentar abrir la imagen con Pillow
        try:
            pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
            img = np.array(pil_image)
        except Exception as e:
            return JSONResponse({"error": f"No se pudo abrir la imagen con PIL: {e}"})

        # Intentar decodificar con OpenCV (opcional, mejora compatibilidad)
        if img is None or img.size == 0:
            nparr = np.frombuffer(contents, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is None:
                return JSONResponse({"error": "No se pudo decodificar la imagen con OpenCV"})

        # Analizar rostro y emociones
        result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)

        # Dependiendo de la versión de DeepFace, result puede ser lista o dict
        if isinstance(result, list):
            result = result[0]

        dominant_emotion = result.get('dominant_emotion', 'unknown')
        emotions = result.get('emotion', {})

        return JSONResponse({
            "dominant_emotion": dominant_emotion,
            "emotions": emotions
        })

    except Exception as e:
        return JSONResponse({"error": str(e)})
