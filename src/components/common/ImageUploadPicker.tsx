import React, { useState, useRef } from 'react';
import { UploadCloud, X, CheckCircle, AlertCircle, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface ImageUploadPickerProps {
  currentImages: string[];
  maxImages?: number;
  maxSizeMB?: number;
  folder?: string;
  label?: string;
  helperText?: string;
  onChange: (images: string[]) => void;
}

interface UploadingFileState {
  id: string;
  name: string;
  size: string;
  progress: number;
  error?: string;
  previewUrl?: string;
}

export const ImageUploadPicker: React.FC<ImageUploadPickerProps> = ({
  currentImages,
  maxImages = 5,
  maxSizeMB = 2,
  folder = 'products',
  label = 'Upload Images from Device',
  helperText = 'Supported formats: JPG, JPEG, PNG, WEBP. Max 2 MB per image.',
  onChange,
}) => {
  const { uploadImage } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFileState[]>([]);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (selected.length === 0) return;

    // Reset native input so the same file can be re-selected if replaced
    e.target.value = '';

    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    // Check if replacing single image
    if (replacingIndex !== null && replacingIndex >= 0) {
      const file = selected[0];
      if (!validExtensions.includes(file.type.toLowerCase())) {
        setErrorMessage('Supported formats: JPG, JPEG, PNG, WEBP.');
        setReplacingIndex(null);
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setErrorMessage('Each image must be 2 MB or smaller.');
        setReplacingIndex(null);
        return;
      }

      await uploadSingleFile(file, replacingIndex);
      setReplacingIndex(null);
      return;
    }

    // Normal multi-file check
    const totalCount = currentImages.length + selected.length;
    if (totalCount > maxImages) {
      setErrorMessage(`You can upload a maximum of ${maxImages} images per product.`);
      return;
    }

    for (const file of selected) {
      if (!validExtensions.includes(file.type.toLowerCase())) {
        setErrorMessage('Supported formats: JPG, JPEG, PNG, WEBP.');
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setErrorMessage('Each image must be 2 MB or smaller.');
        return;
      }
    }

    // Process all valid files
    for (const file of selected) {
      await uploadSingleFile(file);
    }
  };

  const uploadSingleFile = async (file: File, replaceAt?: number) => {
    const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const previewUrl = URL.createObjectURL(file);

    setUploadingFiles(prev => [
      ...prev,
      {
        id: fileId,
        name: file.name,
        size: formatFileSize(file.size),
        progress: 10,
        previewUrl,
      },
    ]);

    try {
      const uploadedUrl = await uploadImage(file, folder, (progress) => {
        setUploadingFiles(prev =>
          prev.map(f => (f.id === fileId ? { ...f, progress } : f))
        );
      });

      // Update parent images
      if (replaceAt !== undefined && replaceAt >= 0) {
        const updated = [...currentImages];
        updated[replaceAt] = uploadedUrl;
        onChange(updated);
      } else {
        onChange([...currentImages, uploadedUrl]);
      }

      // Remove from upload queue after slight delay for visual confirmation
      setTimeout(() => {
        setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
        URL.revokeObjectURL(previewUrl);
      }, 500);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setUploadingFiles(prev =>
        prev.map(f => (f.id === fileId ? { ...f, error: errMsg } : f))
      );
    }
  };

  const handleRemove = (index: number) => {
    const updated = currentImages.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleTriggerReplace = (index: number) => {
    setReplacingIndex(index);
    fileInputRef.current?.click();
  };

  const handleTriggerUpload = () => {
    setReplacingIndex(null);
    fileInputRef.current?.click();
  };

  return (
    <div id="image-upload-picker-container" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="block text-sm font-semibold text-stone-800">
          {label} ({currentImages.length}/{maxImages})
        </label>
        <span className="text-xs text-stone-500">{helperText}</span>
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple={maxImages > 1 && replacingIndex === null}
        onChange={handleFilesSelected}
        className="hidden"
        id="native-device-image-input"
      />

      {/* Upload Box / Trigger */}
      {currentImages.length < maxImages && (
        <div
          id="device-upload-dropzone"
          onClick={handleTriggerUpload}
          className="border-2 border-dashed border-stone-300 hover:border-amber-700 bg-stone-50 hover:bg-amber-50/40 rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-stone-600 group-hover:text-amber-800 group-hover:scale-105 transition">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-900 group-hover:text-amber-900">
              Click to Upload from Device
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              Works on Android phones, iPhones, tablets, & laptops
            </p>
          </div>
        </div>
      )}

      {/* Error Message Notice */}
      {errorMessage && (
        <div id="upload-error-alert" className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Active Uploading Files Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((file) => (
            <div key={file.id} className="p-3 bg-stone-100 rounded-lg border border-stone-200 flex items-center gap-3">
              {file.previewUrl ? (
                <img src={file.previewUrl} alt="preview" className="w-10 h-10 object-cover rounded-md shrink-0" />
              ) : (
                <ImageIcon className="w-8 h-8 text-stone-400 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-stone-800 truncate">{file.name}</span>
                  <span className="text-stone-500">{file.size}</span>
                </div>
                {file.error ? (
                  <span className="text-xs text-red-600 font-medium">{file.error}</span>
                ) : (
                  <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-700 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </div>
              {file.progress === 100 && !file.error && (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Current Uploaded Images Grid */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {currentImages.map((imgUrl, idx) => (
            <div 
              key={idx} 
              className="relative group bg-stone-100 rounded-lg border border-stone-200 overflow-hidden aspect-square shadow-2xs"
            >
              <img 
                src={imgUrl} 
                alt={`Uploaded ${idx + 1}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80';
                }}
              />
              
              {/* Badge for Primary / Cover Image */}
              {idx === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-stone-900/80 text-white text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm font-semibold backdrop-blur-xs">
                  Cover
                </span>
              )}

              {/* Action Overlay */}
              <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                <button
                  type="button"
                  title="Replace this image"
                  onClick={() => handleTriggerReplace(idx)}
                  className="p-1.5 bg-white text-stone-800 rounded-md hover:bg-stone-100 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Delete image"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
