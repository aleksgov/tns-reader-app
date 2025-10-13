export async function recognizeText(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/ocr", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) throw new Error("Ошибка сервера OCR");

    const data = await response.json();
    return data.md_content || 'Текст не найден';
}