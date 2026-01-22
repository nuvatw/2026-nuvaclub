'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface VideoUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  maxSizeMB?: number;
  maxDurationSeconds?: number;
  acceptedFormats?: string[];
  className?: string;
  error?: string;
}

interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
}

export function VideoUpload({
  value,
  onChange,
  maxSizeMB = 100,
  maxDurationSeconds = 180, // 3 minutes default
  acceptedFormats = ['video/mp4', 'video/webm', 'video/quicktime'],
  className,
  error,
}: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Create preview URL when file changes
  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
      setMetadata(null);
    }
  }, [value]);

  // Get video metadata when preview URL is ready
  const handleVideoLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setMetadata({
        duration: videoRef.current.duration,
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      });
    }
  }, []);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (!acceptedFormats.includes(file.type)) {
        return `Invalid file type. Accepted formats: ${acceptedFormats.map((f) => f.split('/')[1]).join(', ')}`;
      }

      // Check file size
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        return `File too large. Maximum size: ${maxSizeMB}MB`;
      }

      return null;
    },
    [acceptedFormats, maxSizeMB]
  );

  const validateDuration = useCallback(
    (duration: number): string | null => {
      if (duration > maxDurationSeconds) {
        const minutes = Math.floor(maxDurationSeconds / 60);
        const seconds = maxDurationSeconds % 60;
        return `Video too long. Maximum duration: ${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
      return null;
    },
    [maxDurationSeconds]
  );

  const processFile = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setLocalError(null);
      setUploadProgress(0);

      // Validate file first
      const fileError = validateFile(file);
      if (fileError) {
        setLocalError(fileError);
        setIsProcessing(false);
        return;
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      // Create a temporary video element to check duration
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';

      const checkDuration = new Promise<number>((resolve, reject) => {
        tempVideo.onloadedmetadata = () => {
          resolve(tempVideo.duration);
        };
        tempVideo.onerror = () => {
          reject(new Error('Failed to load video metadata'));
        };
        tempVideo.src = URL.createObjectURL(file);
      });

      try {
        const duration = await checkDuration;
        URL.revokeObjectURL(tempVideo.src);

        const durationError = validateDuration(duration);
        if (durationError) {
          clearInterval(progressInterval);
          setLocalError(durationError);
          setIsProcessing(false);
          setUploadProgress(0);
          return;
        }

        // All validations passed
        clearInterval(progressInterval);
        setUploadProgress(100);
        onChange(file);

        // Reset progress after a short delay
        setTimeout(() => {
          setUploadProgress(0);
          setIsProcessing(false);
        }, 500);
      } catch {
        clearInterval(progressInterval);
        setLocalError('Failed to process video. Please try another file.');
        setIsProcessing(false);
        setUploadProgress(0);
      }
    },
    [onChange, validateFile, validateDuration]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
      // Reset input so same file can be selected again
      e.target.value = '';
    },
    [processFile]
  );

  const handleRemove = useCallback(() => {
    onChange(null);
    setLocalError(null);
  }, [onChange]);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const displayError = error || localError;

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {!value ? (
          // Upload Zone
          <motion.div
            key="upload-zone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={cn(
              'relative cursor-pointer rounded-xl border-2 border-dashed p-8 transition-all',
              isDragging
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600 hover:bg-neutral-800',
              displayError && 'border-red-500/50'
            )}
          >
            <div className="flex flex-col items-center justify-center text-center">
              {/* Upload Icon */}
              <div
                className={cn(
                  'mb-4 rounded-full p-4 transition-colors',
                  isDragging ? 'bg-primary-500/20' : 'bg-neutral-700'
                )}
              >
                <svg
                  className={cn(
                    'h-8 w-8 transition-colors',
                    isDragging ? 'text-primary-400' : 'text-neutral-400'
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h3 className="mb-2 text-lg font-semibold text-white">
                {isDragging ? 'Drop your video here' : 'Upload Introduction Video'}
              </h3>
              <p className="mb-4 text-sm text-neutral-400">
                Drag and drop or click to browse
              </p>

              <div className="flex flex-wrap justify-center gap-2 text-xs text-neutral-500">
                <span className="rounded-full bg-neutral-700 px-2 py-1">
                  Max {maxSizeMB}MB
                </span>
                <span className="rounded-full bg-neutral-700 px-2 py-1">
                  Max {Math.floor(maxDurationSeconds / 60)}:{(maxDurationSeconds % 60).toString().padStart(2, '0')}
                </span>
                <span className="rounded-full bg-neutral-700 px-2 py-1">
                  MP4, WebM, MOV
                </span>
              </div>

              {/* Progress Bar */}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 w-full max-w-xs"
                >
                  <div className="h-2 overflow-hidden rounded-full bg-neutral-700">
                    <motion.div
                      className="h-full bg-primary-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-neutral-400">
                    Processing video... {uploadProgress}%
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          // Video Preview
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-xl border border-neutral-700 bg-neutral-800"
          >
            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                src={previewUrl || undefined}
                onLoadedMetadata={handleVideoLoadedMetadata}
                controls
                className="h-full w-full"
                playsInline
              />
            </div>

            {/* File Info */}
            <div className="flex items-center justify-between border-t border-neutral-700 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary-500/20 p-2">
                  <svg
                    className="h-5 w-5 text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white truncate max-w-[200px]">
                    {value.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span>{formatFileSize(value.size)}</span>
                    {metadata && (
                      <>
                        <span>•</span>
                        <span>{formatDuration(metadata.duration)}</span>
                        <span>•</span>
                        <span>
                          {metadata.width}x{metadata.height}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={handleRemove}
                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {displayError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400"
        >
          {displayError}
        </motion.p>
      )}
    </div>
  );
}
