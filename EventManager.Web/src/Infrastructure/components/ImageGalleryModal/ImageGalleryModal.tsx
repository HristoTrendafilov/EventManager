import ImageGallery, { type ReactImageGalleryItem } from 'react-image-gallery';

import { Modal } from '~Infrastructure/components/Modal/Modal';

import './ImageGalleryModal.css';

interface ImageGalleryModalProps {
  items: ReactImageGalleryItem[];
  onCloseButtonClick: () => void;
  startIndex?: number;
}

export function ImageGalleryModal(props: ImageGalleryModalProps) {
  const { items, startIndex, onCloseButtonClick } = props;

  return (
    <Modal onBackdropClick={onCloseButtonClick}>
      <div className="container image-gallery-wrapper">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3>Галерия</h3>
            <button
              type="button"
              className="btn btn-warning"
              onClick={onCloseButtonClick}
            >
              Затвори
            </button>
          </div>
          <div className="card-body p-2">
            <ImageGallery
              additionalClass="custom-gallery"
              items={items}
              startIndex={startIndex ?? 0}
              showPlayButton={items.length > 1}
              disableSwipe
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
