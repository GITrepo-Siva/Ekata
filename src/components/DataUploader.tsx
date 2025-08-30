
import React, { useRef } from 'react';
import type { PriceData } from '../types';
import { parseCsvToPriceData } from '../utils';

interface DataUploaderProps {
  onDataUploaded: (data: PriceData[]) => void;
}

const DataUploader: React.FC<DataUploaderProps> = ({ onDataUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) throw new Error("File is empty.");
        const parsedData = parseCsvToPriceData(text);
        onDataUploaded(parsedData);
        alert('Custom price data loaded successfully!');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during parsing.";
        console.error("Failed to parse CSV:", errorMessage);
        alert(`Error: ${errorMessage}`);
      } finally {
        // Reset file input to allow re-uploading the same file
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.onerror = () => {
        alert("Failed to read the file.");
         if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
    };
    reader.readAsText(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
        aria-hidden="true"
      />
      <button
        onClick={handleClick}
        aria-label="Upload custom coffee price data in CSV format"
        title="Upload custom CSV data"
        className="px-4 py-2 text-sm font-medium text-white bg-brand-brown border border-brand-brown rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-brown transition-colors duration-200"
      >
        Upload CSV
      </button>
    </>
  );
};

export default DataUploader;
