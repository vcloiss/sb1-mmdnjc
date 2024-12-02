import React from 'react';
import { Upload, X } from 'lucide-react';

type FileUploadProps = {
  onFileUpload: (files: Array<{ id: string; title: string; url: string }>) => void;
};

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [files, setFiles] = React.useState<Array<{ id: string; title: string; url: string }>>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    // In a real application, you would upload these files to a server
    // and get back URLs. This is just a mock implementation
    const newFiles = Array.from(fileList).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      title: file.name,
      url: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    onFileUpload([...files, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
    onFileUpload(files.filter((file) => file.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <span>Upload de arquivos</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1">ou arraste e solte</p>
          </div>
          <p className="text-xs text-gray-500">PDF, DOC até 10MB</p>
        </div>
      </div>

      {files.length > 0 && (
        <ul className="divide-y divide-gray-200">
          {files.map((file) => (
            <li key={file.id} className="py-3 flex justify-between items-center">
              <span className="text-sm text-gray-900">{file.title}</span>
              <button
                onClick={() => removeFile(file.id)}
                className="text-red-600 hover:text-red-900"
              >
                <X size={20} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}