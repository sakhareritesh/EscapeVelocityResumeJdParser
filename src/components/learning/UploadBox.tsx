'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadBoxProps {
    label: string;
    accept?: string;
    file: File | null;
    onFileSelect: (file: File | null) => void;
}

export function UploadBox({ label, accept = '.pdf', file, onFileSelect }: UploadBoxProps) {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) {
                onFileSelect(droppedFile);
            }
        },
        [onFileSelect]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
                onFileSelect(selectedFile);
            }
        },
        [onFileSelect]
    );

    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <AnimatePresence mode="wait">
                {file ? (
                    <motion.div
                        key="file"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-3 p-4 bg-[#e8f1fd] border-2 border-[#0a66c2]/20 rounded-xl"
                    >
                        <FileText className="w-8 h-8 text-[#0a66c2] shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                            onClick={() => onFileSelect(null)}
                            className="p-1.5 rounded-full hover:bg-white/80 text-gray-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                            'relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200',
                            isDragOver
                                ? 'border-[#0a66c2] bg-[#e8f1fd]/50'
                                : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50'
                        )}
                    >
                        <input
                            type="file"
                            accept={accept}
                            onChange={handleFileInput}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload className={cn('w-8 h-8 mb-3', isDragOver ? 'text-[#0a66c2]' : 'text-gray-400')} />
                        <p className="text-sm font-medium text-gray-700">
                            Drop your file here, or{' '}
                            <span className="text-[#0a66c2] font-semibold">browse</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Supports {accept.toUpperCase().replace('.', '')} files</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
