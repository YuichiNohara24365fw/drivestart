import React, { useState, useEffect } from 'react';
import { X, Star, StarHalf, Copy, Check, Link2, AlertCircle, Download } from 'lucide-react';
import { MaterialInfo } from '../types/koubanhyou';

interface MaterialInfoModalProps {
  material: MaterialInfo;
  onClose: () => void;
  onUpdate?: (material: MaterialInfo) => void;
  isEditing?: boolean;
}

const MaterialInfoModal: React.FC<MaterialInfoModalProps> = ({ 
  material, 
  onClose, 
  onUpdate,
  isEditing = false 
}) => {
  const [copied, setCopied] = useState(false);
  const [editedMaterial, setEditedMaterial] = useState<MaterialInfo>(material);
  const [newTag, setNewTag] = useState('');
  const [imageError, setImageError] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const copyImageToClipboard = async () => {
    try {
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      
      // Create a promise to wait for image load
      const imageLoaded = new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Add CORS proxy
      const proxyUrl = 'https://corsproxy.io/?';
      img.src = proxyUrl + encodeURIComponent(material.url);

      // Wait for image to load
      await imageLoaded;

      // Create canvas and draw image
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');
      
      ctx.drawImage(img, 0, 0);

      try {
        // Convert canvas to blob and copy to clipboard
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(blob => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create blob'));
          }, 'image/png');
        });

        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        setCopyError(true);
        setTimeout(() => setCopyError(false), 2000);
      }
    } catch (err) {
      console.error('Failed to load image:', err);
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2000);
    }
  };

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate(editedMaterial);
    }
    onClose();
  };

  const handleAddTag = () => {
    if (newTag && !editedMaterial.metadata.tags?.includes(newTag)) {
      setEditedMaterial({
        ...editedMaterial,
        metadata: {
          ...editedMaterial.metadata,
          tags: [...(editedMaterial.metadata.tags || []), newTag]
        }
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedMaterial({
      ...editedMaterial,
      metadata: {
        ...editedMaterial.metadata,
        tags: editedMaterial.metadata.tags?.filter(tag => tag !== tagToRemove)
      }
    });
  };

  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editedMaterial.title}
              onChange={(e) => setEditedMaterial({...editedMaterial, title: e.target.value})}
              className="bg-gray-800 text-white px-3 py-1.5 rounded text-lg font-medium w-full"
              placeholder="素材タイトル"
            />
          ) : (
            <h3 className="text-lg font-medium">{material.title}</h3>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image and URL section */}
        <div className="mb-4">
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4">
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <AlertCircle className="w-8 h-8 mb-2" />
                <span>画像を読み込めませんでした</span>
              </div>
            ) : (
              <img
                src={material.url}
                alt={material.title}
                className="w-full h-full object-contain"
                onError={() => setImageError(true)}
              />
            )}
            <button
              onClick={copyImageToClipboard}
              className="absolute top-2 right-2 flex items-center gap-1 px-3 py-1.5 bg-gray-900/80 hover:bg-gray-900 rounded text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  コピー済み
                </>
              ) : copyError ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  コピー失敗
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  画像をコピー
                </>
              )}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedMaterial.url}
                  onChange={(e) => setEditedMaterial({...editedMaterial, url: e.target.value})}
                  className="flex-1 bg-gray-800 text-white px-3 py-1.5 rounded text-sm"
                  placeholder="素材のURL"
                />
                <select
                  value={editedMaterial.type}
                  onChange={(e) => setEditedMaterial({...editedMaterial, type: e.target.value})}
                  className="bg-gray-800 text-white px-3 py-1.5 rounded text-sm"
                >
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="3D_ROUGH">3D簡易</option>
                  <option value="3D_DETAILED">3D詳細</option>
                </select>
              </div>
              <input
                type="text"
                value={editedMaterial.thumbnail || ''}
                onChange={(e) => setEditedMaterial({...editedMaterial, thumbnail: e.target.value})}
                className="w-full bg-gray-800 text-white px-3 py-1.5 rounded text-sm"
                placeholder="サムネイルのURL"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
              <Link2 className="w-4 h-4 text-gray-400" />
              <span className="flex-1 text-sm truncate">{material.url}</span>
            </div>
          )}
        </div>

        {/* Metadata section */}
        <div className="space-y-3 text-sm">
          {isEditing ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">大きさ</label>
                  <input
                    type="text"
                    value={editedMaterial.metadata.dimensions || ''}
                    onChange={(e) => setEditedMaterial({
                      ...editedMaterial,
                      metadata: {...editedMaterial.metadata, dimensions: e.target.value}
                    })}
                    className="w-full bg-gray-800 text-white px-3 py-1.5 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">サイズ</label>
                  <input
                    type="text"
                    value={editedMaterial.metadata.size || ''}
                    onChange={(e) => setEditedMaterial({
                      ...editedMaterial,
                      metadata: {...editedMaterial.metadata, size: e.target.value}
                    })}
                    className="w-full bg-gray-800 text-white px-3 py-1.5 rounded text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">作成者</label>
                <input
                  type="text"
                  value={editedMaterial.metadata.author || ''}
                  onChange={(e) => setEditedMaterial({
                    ...editedMaterial,
                    metadata: {...editedMaterial.metadata, author: e.target.value}
                  })}
                  className="w-full bg-gray-800 text-white px-3 py-1.5 rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">タグ</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 bg-gray-800 text-white px-3 py-1.5 rounded text-sm"
                    placeholder="新しいタグを入力してEnter"
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {editedMaterial.metadata.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-gray-800 rounded text-xs flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">コメント</label>
                <textarea
                  value={editedMaterial.metadata.comments || ''}
                  onChange={(e) => setEditedMaterial({
                    ...editedMaterial,
                    metadata: {...editedMaterial.metadata, comments: e.target.value}
                  })}
                  className="w-full bg-gray-800 text-white px-3 py-1.5 rounded text-sm"
                  rows={3}
                />
              </div>
            </>
          ) : (
            <>
              {material.metadata.dimensions && (
                <div className="flex justify-between">
                  <span className="text-gray-400">大きさ:</span>
                  <span>{material.metadata.dimensions}</span>
                </div>
              )}

              {material.metadata.size && (
                <div className="flex justify-between">
                  <span className="text-gray-400">サイズ:</span>
                  <span>{material.metadata.size}</span>
                </div>
              )}

              {material.metadata.author && (
                <div className="flex justify-between">
                  <span className="text-gray-400">作成者:</span>
                  <span>{material.metadata.author}</span>
                </div>
              )}

              {material.metadata.rating && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">評価:</span>
                  {renderRating(material.metadata.rating)}
                </div>
              )}

              {material.metadata.tags && material.metadata.tags.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">タグ:</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {material.metadata.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 bg-gray-800 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {material.metadata.comments && (
                <div className="flex justify-between">
                  <span className="text-gray-400">コメント:</span>
                  <span>{material.metadata.comments}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-2">
          {isEditing && (
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm"
            >
              保存
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialInfoModal;