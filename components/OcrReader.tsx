'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Upload, FileText, Loader2, Save, X } from 'lucide-react';
import { saveReport } from '@/lib/reports';
import { useRouter } from 'next/navigation';

const OcrReader = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<string>('');
  const [ocrStatus, setOcrStatus] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setOcrResult('');
      setOcrStatus('');
      setShowSaveDialog(false);
    }
  };

  const readImageText = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setOcrStatus('Uploading and processing...');
    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');

    try {
      const res = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          apikey: process.env.NEXT_PUBLIC_OCR_SPACE_API_KEY || 'K81374568588957',
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
      setOcrStatus('Text extraction completed successfully!');
      
      if (session) {
        setShowSaveDialog(true);
        setReportTitle(`Medical Report - ${new Date().toLocaleDateString()}`);
      }
    } catch (error) {
      console.error(error);
      setOcrStatus('An error occurred during text extraction.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveReport = async () => {
    if (!session || !ocrResult || !reportTitle.trim()) return;

    setIsSaving(true);
    try {
      await saveReport({
        userId: session.user?.id || '',
        title: reportTitle.trim(),
        extractedText: ocrResult,
        category: 'General',
        tags: [],
      });

      setShowSaveDialog(false);
      setOcrResult('');
      setSelectedImage(null);
      setReportTitle('');
      setOcrStatus('Report saved successfully!');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error saving report:', error);
      setOcrStatus('Error saving report. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatExtractedText = (text: string) => {
    // Basic text formatting for better readability
    return text
      .split('\n')
      .map((line, index) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return null;
        
        // Check if line looks like a header (all caps or starts with common medical terms)
        const isHeader = /^[A-Z\s]{3,}$/.test(trimmedLine) || 
                        /^(PATIENT|DOCTOR|DATE|REPORT|TEST|RESULT|DIAGNOSIS|PRESCRIPTION)/i.test(trimmedLine);
        
        return (
          <div key={index} className={`mb-2 ${isHeader ? 'font-semibold text-primary text-lg' : 'text-black-200'}`}>
            {trimmedLine}
          </div>
        );
      })
      .filter(Boolean);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">
          Upload Your Medical Report
        </h2>
        <p className="text-black-300">
          Upload an image of your medical report and we'll extract the text for you
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-md">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-secondary rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-secondary" />
              <p className="mb-2 text-sm text-black-300">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-black-300">PNG, JPG, JPEG (MAX. 10MB)</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {selectedImage && (
          <div className="w-full max-w-md">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              className="rounded-lg shadow-lg w-full"
            />
            <p className="text-sm text-black-300 mt-2 text-center">
              {selectedImage.name}
            </p>
          </div>
        )}

        <button
          onClick={readImageText}
          disabled={!selectedImage || isProcessing}
          className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>Extract Text</span>
            </>
          )}
        </button>
      </div>

      {ocrStatus && (
        <div className={`p-4 rounded-lg ${
          ocrStatus.includes('Error') ? 'bg-red-50 text-red-700' : 
          ocrStatus.includes('successfully') ? 'bg-green-50 text-green-700' : 
          'bg-blue-50 text-blue-700'
        }`}>
          <p className="font-medium">{ocrStatus}</p>
        </div>
      )}

      {ocrResult && (
        <div className="mt-6 p-6 bg-white-100 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-primary flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Extracted Text</span>
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {formatExtractedText(ocrResult)}
          </div>
        </div>
      )}

      {/* Save Dialog */}
      {showSaveDialog && session && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-primary">Save Report</h3>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="text-black-300 hover:text-black-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-black-200 mb-2">
                Report Title
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Enter a title for this report"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-black-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReport}
                disabled={!reportTitle.trim() || isSaving}
                className="flex-1 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OcrReader;