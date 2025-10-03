import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadZoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  disabled?: boolean;
}

export default function FileUploadZone({ onFileSelect, selectedFile, disabled }: FileUploadZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    multiple: false,
    disabled,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  if (selectedFile) {
    return (
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground" data-testid="text-selected-filename">
                {selectedFile.name}
              </p>
              <p className="text-sm text-muted-foreground" data-testid="text-selected-filesize">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
            disabled={disabled}
            data-testid="button-remove-file"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "upload-zone rounded-lg p-12 text-center cursor-pointer transition-all duration-300",
        isDragActive && "drag-over",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      data-testid="dropzone-file-upload"
    >
      <input {...getInputProps()} />
      <div className="mb-4">
        <Upload className="w-16 h-16 text-muted-foreground mx-auto" />
      </div>
      <h4 className="text-lg font-semibold text-foreground mb-2">
        {isDragActive ? "Drop your file here" : "Drag & Drop Files Here"}
      </h4>
      <p className="text-muted-foreground mb-4">or click to browse</p>
      <p className="text-sm text-muted-foreground mb-1">Supported formats: CSV, Excel (.xlsx, .xls)</p>
      <p className="text-sm text-muted-foreground">Maximum file size: 50MB</p>
    </div>
  );
}
