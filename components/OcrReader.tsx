'use client';

import { useState } from 'react';

const OcrReader = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<string>('');
  const [ocrStatus, setOcrStatus] = useState<string>('');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setOcrResult('');
      setOcrStatus('');
    }
  };

  const readImageText = async () => {
    if (!selectedImage) return;

    setOcrStatus('Uploading and processing...');
    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');

    try {
      const res = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          apikey: 'K81374568588957',
        },
        body: formData,
      });

      const result = await res.json();

      if (result.IsErroredOnProcessing) {
        setOcrStatus('Error: ' + result.ErrorMessage);
        return;
      }

      const text = result.ParsedResults?.[0]?.ParsedText || 'No text found.';
      setOcrResult(text);
      setOcrStatus('Completed');
    } catch (error) {
      console.error(error);
      setOcrStatus('An error occurred during OCR.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-primary text-center">
        Upload Your Medical Report Image
      </h2>

      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input file-input-bordered w-full max-w-md"
        />

        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            className="rounded-lg shadow-lg w-full max-w-md mt-4"
          />
        )}

        <button
          onClick={readImageText}
          className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition-all"
        >
          Extract Text
        </button>
      </div>

      <div className="mt-6">
        <p className="text-black-300 font-medium">Status:</p>
        <p className="text-black text-sm">{ocrStatus}</p>

        {ocrResult && (
          <div className="mt-4 p-4 bg-white-100 border border-gray-300 rounded-md">
            <h3 className="text-lg font-semibold mb-2 text-primary">
              Extracted Text
            </h3>
            <div
              className="whitespace-pre-wrap text-black-200 text-sm"
              dangerouslySetInnerHTML={{
                __html: ocrResult.replace(/\n/g, '<br />'),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OcrReader;
