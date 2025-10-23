from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from paddlex import create_pipeline
import shutil
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = create_pipeline(
    pipeline="./ocr_config/PP-StructureV3.yaml",
    device="cpu",
)

UPLOAD_DIR = "uploads"
MD_DIR = "md_results"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(MD_DIR, exist_ok=True)


@app.post("/ocr")
async def ocr_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    output = pipeline.predict(input=file_path)

    md_filename = f"{os.path.splitext(file.filename)[0]}.md"
    md_path = os.path.join(MD_DIR, md_filename)

    for res in output:
        res.save_to_markdown(save_path=md_path)

    # Читаем содержимое markdown файла
    with open(md_path, "r", encoding="utf-8") as f:
        md_content = f.read()

    os.remove(file_path)

    return {
        "md_content": md_content,
        "md_file": md_filename
    }

@app.api_route("/health", methods=["GET", "HEAD"])
async def health_check():
    return {"status": "ok"}