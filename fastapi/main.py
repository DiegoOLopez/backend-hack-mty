from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse, HTMLResponse
from deepface import DeepFace
import numpy as np
from PIL import Image
import io
import cv2
import os
import json

app = FastAPI(title="Face & Emotion + Live Recognition API")

DATA_DIR = "registered_faces"
os.makedirs(DATA_DIR, exist_ok=True)

# --- Analizar emociones ---
@app.post("/analyze")
async def analyze_face(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        if not contents:
            return JSONResponse({"error": "No se recibió contenido en la imagen"})

        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
        img = np.array(pil_image)

        result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
        if isinstance(result, list):
            result = result[0]

        dominant_emotion = result.get('dominant_emotion', 'unknown')
        emotions = {k: float(v) for k, v in result.get('emotion', {}).items()}

        return JSONResponse({
            "dominant_emotion": dominant_emotion,
            "emotions": emotions
        })

    except Exception as e:
        return JSONResponse({"error": str(e)})


# --- Registrar rostro ---
@app.post("/register-face")
async def register_face(name: str = Form(...), file: UploadFile = File(...)):
    """
    Captura una imagen desde la cámara y la guarda como referencia de un usuario.
    """
    try:
        contents = await file.read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
        img = np.array(pil_image)

        # Guardar imagen del usuario
        path = os.path.join(DATA_DIR, f"{name}.jpg")
        Image.fromarray(img).save(path)

        return JSONResponse({"message": f"Rostro registrado como '{name}'"})
    except Exception as e:
        return JSONResponse({"error": str(e)})


# --- 3️⃣ Reconocer rostro en vivo ---
@app.post("/recognize-face")
async def recognize_face(file: UploadFile = File(...)):
    """
    Compara la imagen recibida con los rostros registrados.
    """
    try:
        contents = await file.read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
        img = np.array(pil_image)

        if not os.listdir(DATA_DIR):
            return JSONResponse({"error": "No hay rostros registrados aún."})

        # Buscar coincidencias con rostros registrados
        result = DeepFace.find(img_path=img, db_path=DATA_DIR, enforce_detection=False)

        if len(result) == 0 or result[0].empty:
            return JSONResponse({"match": False, "message": "No se encontró coincidencia."})

        best_match = result[0].iloc[0]
        person_name = os.path.splitext(os.path.basename(best_match["identity"]))[0]
        distance = float(best_match["distance"])

        return JSONResponse({
            "match": True,
            "person": person_name,
            "distance": distance
        })

    except Exception as e:
        return JSONResponse({"error": str(e)})


# --- Interfaz HTML con cámara ---
@app.get("/", response_class=HTMLResponse)
async def index():
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Reconocimiento Facial y Emocional</title>
    </head>
    <body>
        <h1>Reconocimiento Facial y Emocional</h1>

        <video id="video" width="400" height="300" autoplay></video>
        <canvas id="canvas" width="400" height="300" style="display:none;"></canvas><br>

        <input id="name" type="text" placeholder="Nombre para registrar">
        <button id="register">Registrar rostro</button>
        <button id="recognize">Reconocer rostro</button>
        <button id="emotion">Analizar emoción</button>

        <h2>Resultado:</h2>
        <pre id="result">Esperando...</pre>

        <script>
            const video = document.getElementById('video');
            const canvas = document.getElementById('canvas');
            const resultEl = document.getElementById('result');

            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => { video.srcObject = stream; })
                .catch(err => alert("No se puede acceder a la cámara: " + err));

            async function sendFrame(endpoint, formData) {
                const context = canvas.getContext('2d');
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.9));
                formData.append('file', blob, 'frame.jpg');

                const resp = await fetch(endpoint, { method: 'POST', body: formData });
                const data = await resp.json();
                resultEl.textContent = JSON.stringify(data, null, 2);
            }

            document.getElementById('register').onclick = () => {
                const name = document.getElementById('name').value.trim();
                if (!name) return alert("Escribe un nombre para registrar.");
                const formData = new FormData();
                formData.append('name', name);
                sendFrame('/register-face', formData);
            };

            document.getElementById('recognize').onclick = () => {
                sendFrame('/recognize-face', new FormData());
            };

            document.getElementById('emotion').onclick = () => {
                sendFrame('/analyze', new FormData());
            };
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html)
