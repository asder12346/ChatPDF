/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelected = async (file: File) => {
    if (file.size === 0) {
      alert("The selected file is empty. Please choose a valid document.");
      return;
    }
    
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Data = base64String.split(',')[1];
        setPdfBase64(base64Data);
        setPdfFile(file);
        setIsProcessing(false);
      };
      reader.onerror = () => {
        console.error("Error reading file");
        setIsProcessing(false);
        alert("Failed to read the PDF file. Please try again.");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing file:", error);
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setPdfFile(null);
    setPdfBase64(null);
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
        <p className="text-slate-400 font-medium">Processing your PDF...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-slate-100">
      {!pdfFile || !pdfBase64 ? (
        <LandingPage onFileSelected={handleFileSelected} />
      ) : (
        <Dashboard pdfFile={pdfFile} pdfBase64={pdfBase64} onReset={handleReset} />
      )}
    </div>
  );
}
