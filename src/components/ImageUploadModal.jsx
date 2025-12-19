import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Upload, Loader, AlertCircle } from 'lucide-react';

const ImageUploadModal = ({ isOpen, onClose, onUpload, roomInfo }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [weatherTag, setWeatherTag] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const weatherTags = [
    { value: 'sunny', label: '☀️ Nắng', color: 'bg-yellow-500' },
    { value: 'cloudy', label: '☁️ Có mây', color: 'bg-gray-500' },
    { value: 'rainy', label: '🌧️ Mưa', color: 'bg-blue-500' },
    { value: 'stormy', label: '⛈️ Giông', color: 'bg-purple-500' },
    { value: 'foggy', label: '🌫️ Sương mù', color: 'bg-gray-400' },
    { value: 'snowy', label: '❄️ Tuyết', color: 'bg-blue-300' },
  ];

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Compress image
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if too large
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            'image/jpeg',
            0.8 // Quality 80%
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chỉ chọn file ảnh (JPG, PNG, WebP)');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Kích thước ảnh phải nhỏ hơn 5MB');
      return;
    }

    try {
      // Compress image
      const compressedBlob = await compressImage(file);
      const compressedFile = new File([compressedBlob], file.name, {
        type: 'image/jpeg',
      });

      setSelectedImage(compressedFile);

      // Create preview
      const previewUrl = URL.createObjectURL(compressedFile);
      setPreview(previewUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Có lỗi khi xử lý ảnh. Vui lòng thử lại.');
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setError('Vui lòng chọn ảnh');
      return;
    }

    if (!caption.trim()) {
      setError('Vui lòng nhập mô tả');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const imageData = {
        caption: caption.trim(),
        weatherTag,
        temperature: roomInfo.weather,
        location: roomInfo.name,
        timestamp: new Date().toISOString()
      };

      // Pass both imageData and the actual file
      onUpload(imageData, selectedImage);
      handleClose();
    } catch (error) {
      console.error('Upload error:', error);
      setError('Có lỗi khi tải ảnh lên. Vui lòng thử lại.');
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    setPreview(null);
    setCaption('');
    setWeatherTag('');
    setError('');
    setUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">
              Chia sẻ ảnh thời tiết
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Image Upload Area */}
          <div>
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setPreview(null);
                  }}
                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg text-white text-sm">
                  {(selectedImage.size / 1024).toFixed(0)} KB
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-2xl p-12 text-center cursor-pointer transition-all bg-gray-800/50 hover:bg-gray-800"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-white font-semibold mb-2">
                  Click để chọn ảnh
                </p>
                <p className="text-gray-400 text-sm">
                  JPG, PNG, WebP (Tối đa 5MB)
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Weather Tags */}
          <div>
            <label className="block text-white font-semibold mb-3">
              Tình trạng thời tiết
            </label>
            <div className="grid grid-cols-3 gap-3">
              {weatherTags.map((tag) => (
                <button
                  key={tag.value}
                  onClick={() => setWeatherTag(tag.value)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all border-2 ${
                    weatherTag === tag.value
                      ? `${tag.color} border-white text-white`
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-white font-semibold mb-3">
              Mô tả chi tiết
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={`Ví dụ: Trời đang mưa to tại ${roomInfo.name}, nhiệt độ ${roomInfo.weather}...`}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-gray-500 text-sm">
                📍 {roomInfo.name} • {roomInfo.weather}
              </p>
              <p className="text-gray-500 text-sm">
                {caption.length}/500
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-t border-gray-700">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-gray-400 hover:text-white transition-all"
          >
            Hủy
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedImage}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-xl font-semibold transition-all disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Đang tải lên...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Đăng ảnh</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;