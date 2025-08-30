from flask import Flask, request, jsonify
from flask_cors import CORS
from paddleocr import PaddleOCR
import tempfile
import os

app = Flask(__name__)
CORS(app)

ocr = PaddleOCR(
    lang='ru',
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False,
)

@app.route('/ocr', methods=['POST'])
def recognize_text():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['image']

        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        # Создаем временный файл
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            tmp_path = tmp.name

        try:
            file.save(tmp_path)
            results = ocr.predict(tmp_path)
        finally:
            # Удаляем временный файл
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

        text_lines = []
        for res in results:
            text_lines.extend(res["rec_texts"])

        recognized_text = "\n".join(text_lines)

        return jsonify({
            "text": recognized_text,
            "status": "success"
        })

    except Exception as e:
        print(f"Ошибка при распознавании: {str(e)}")
        return jsonify({
            "error": f"Ошибка сервера: {str(e)}",
            "status": "error"
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Проверка работоспособности сервера"""
    return jsonify({
        "status": "healthy",
        "message": "OCR server is running"
    })

if __name__ == "__main__":
    print("Запуск OCR сервера на порту 5000...")
    app.run(host="0.0.0.0", port=5000, debug=True)