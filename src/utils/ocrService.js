const OCR_SERVER_URL = 'http://localhost:5000';

export const recognizeText = async (file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${OCR_SERVER_URL}/ocr`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error('Ошибка при распознавании текста:', error);
        throw error;
    }
};

export const recognizeTextFromBase64 = async (base64String) => {
    try {
        const response = await fetch(base64String);
        const blob = await response.blob();

        const file = new File([blob], 'image.png', { type: 'image/png' });

        return await recognizeText(file);
    } catch (error) {
        console.error('Ошибка при распознавании текста из base64:', error);
        throw error;
    }
};