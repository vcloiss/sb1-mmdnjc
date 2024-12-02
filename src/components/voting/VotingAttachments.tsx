import React from 'react';
import { Upload, X, FileText, Image, Eye } from 'lucide-react';
import { VotingAttachment } from '../../types';

type VotingAttachmentsProps = {
  attachments: VotingAttachment[];
  onAttachmentsChange: (attachments: VotingAttachment[]) => void;
  readOnly?: boolean;
};

export function VotingAttachments({ attachments, onAttachmentsChange, readOnly = false }: VotingAttachmentsProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    // Filter files by type and size
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const newFiles = Array.from(fileList)
      .filter(file => {
        if (!allowedTypes.includes(file.type)) {
          alert(`Arquivo ${file.name} não suportado. Tipos permitidos: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG`);
          return false;
        }
        if (file.size > maxSize) {
          alert(`Arquivo ${file.name} muito grande. Tamanho máximo: 10MB`);
          return false;
        }
        return true;
      })
      .map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        size: file.size,
        uploadedAt: new Date(),
      }));

    onAttachmentsChange([...attachments, ...newFiles]);
  };

  const removeFile = (id: string) => {
    onAttachmentsChange(attachments.filter(file => file.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={20} className="text-blue-500" />;
    return <FileText size={20} className="text-blue-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="voting-file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Anexar arquivos</span>
                <input
                  id="voting-file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">ou arraste e solte</p>
            </div>
            <p className="text-xs text-gray-500">
              PDF, DOC, DOCX, XLS, XLSX, JPG, PNG até 10MB
            </p>
          </div>
        </div>
      )}

      {attachments.length > 0 && (
        <ul className="divide-y divide-gray-200 border rounded-md">
          {attachments.map(file => (
            <li key={file.id} className="flex items-center justify-between p-3 hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.open(file.url, '_blank')}
                  className="text-blue-500 hover:text-blue-700 p-1"
                >
                  <Eye size={20} />
                </button>
                {!readOnly && (
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}