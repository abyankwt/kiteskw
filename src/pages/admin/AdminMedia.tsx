import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Trash2, Copy, CheckCheck, Image } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { usePermission } from '@/hooks/usePermission';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function MediaCard({ item, onDelete }: { item: any; onDelete: (id: string) => void }) {
  const [copied, setCopied] = useState(false);
  const canDelete = usePermission('media:delete');
  const publicUrl = `${import.meta.env.VITE_API_URL?.replace('/api/v1', '') ?? ''}/uploads/${item.filename}`;

  const copy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
      <div className="aspect-video bg-gray-50 flex items-center justify-center overflow-hidden">
        {item.mime_type.startsWith('image/') ? (
          <img
            src={publicUrl}
            alt={item.alt_text || item.original_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Image size={32} className="text-gray-300" />
        )}
      </div>
      <div className="p-3">
        <p className="text-xs font-medium text-gray-700 truncate">{item.original_name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{formatBytes(item.size_bytes)}</p>
        <div className="flex gap-1 mt-2">
          <button
            onClick={copy}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy URL'}
          </button>
          {canDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 ml-auto"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminMedia() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canUpload = usePermission('media:upload');
  const canDelete = usePermission('media:delete');

  const { data, isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      const { data } = await apiClient.get('/media');
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('file', file);
      const { data } = await apiClient.post('/media', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['media'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/media/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['media'] }),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((f) => uploadMutation.mutate(f));
    e.target.value = '';
  };

  const items: any[] = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Media Library</h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} files uploaded</p>
        </div>
        {canUpload && (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Upload size={16} />
              {uploadMutation.isPending ? 'Uploading...' : 'Upload Files'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-sm text-gray-400">Loading media...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <Image size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No files yet. Upload your first image.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
