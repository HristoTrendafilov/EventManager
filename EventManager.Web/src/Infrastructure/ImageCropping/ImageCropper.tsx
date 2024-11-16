// ProfileImageCrop.tsx
import { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';

import { Modal } from '~Infrastructure/components/Modal/Modal';
import { reportError } from '~Infrastructure/utils';

import './ImageCropper.css';

function getCroppedImg(
  imageSrc: string,
  cropAreaPixels: { x: number; y: number; width: number; height: number },
  fileName = 'croppedImage.png' // Optional filename parameter
): Promise<File | null> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      canvas.width = cropAreaPixels.width;
      canvas.height = cropAreaPixels.height;

      ctx.drawImage(
        image,
        cropAreaPixels.x,
        cropAreaPixels.y,
        cropAreaPixels.width,
        cropAreaPixels.height,
        0,
        0,
        cropAreaPixels.width,
        cropAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }

        // Convert Blob to File
        const file = new File([blob], fileName, { type: 'image/png' });
        resolve(file);
      }, 'image/png');
    };
    image.onerror = () => reject(new Error('Image failed to load'));
  });
}

interface ImageCropModalProps {
  imageSrc: string;
  fileName: string;
  onCropComplete: (croppedImage: File | null) => void;
  onCancel: () => void;
}

export function ImageCropModal(props: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = setCrop;
  const onZoomChange = setZoom;

  const { imageSrc, fileName, onCropComplete, onCancel } = props;

  const onCropCompleteInternal = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleCrop = useCallback(async () => {
    if (croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(
          imageSrc,
          croppedAreaPixels,
          fileName
        );
        onCropComplete(croppedImage);
      } catch (e) {
        reportError(e);
      }
    }
  }, [croppedAreaPixels, fileName, imageSrc, onCropComplete]);

  return (
    <Modal onBackdropClick={onCancel}>
      <div className="image-cropper-wrapper container">
        <div className="card">
          <div className="card-header">
            <h5>Корекция на изображение</h5>
          </div>
          <div className="card-body">
            <div className="crop-container">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropCompleteInternal}
              />
            </div>
          </div>
          <div className="card-footer d-flex gap-3">
            <button
              type="button"
              onClick={handleCrop}
              className="btn btn-success w-100"
            >
              Запази
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-warning w-100"
            >
              Изход
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
