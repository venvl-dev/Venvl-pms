import {
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type DragEvent,
  type SetStateAction,
} from 'react'
import { CircleEllipsis, Info, Plus, Trash2, UploadCloud } from 'lucide-react'
import styles from './CreateProperty.module.css'
import type { PhotosFormState } from './CreateProperty'

const MAX_PHOTOS = 20
const PRIMARY_GRID_PHOTO_LIMIT = 6

type PhotosFormProps = {
  photosForm: PhotosFormState
  setPhotosForm: Dispatch<SetStateAction<PhotosFormState>>
  registerPhotoUrl: (url: string) => void
  unregisterPhotoUrl: (url: string) => void
}

export default function PhotosForm({
  photosForm,
  setPhotosForm,
  registerPhotoUrl,
  unregisterPhotoUrl,
}: PhotosFormProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { photos, thumbnailId } = photosForm

  const handleAddPhotos = (files?: FileList | null) => {
    const selectedFiles = files ?? inputRef.current?.files
    if (!selectedFiles || selectedFiles.length === 0) return

    const remainingSlots = Math.max(MAX_PHOTOS - photos.length, 0)
    const nextItems = Array.from(selectedFiles)
      .slice(0, remainingSlots)
      .map((file) => {
        const src = URL.createObjectURL(file)
        registerPhotoUrl(src)

        return {
          id: Date.now() + Math.random(),
          src,
          name: file.name,
          file,
        }
      })

    if (nextItems.length === 0) return

    setPhotosForm((prev) => {
      const merged = [...prev.photos, ...nextItems]
      return {
        photos: merged,
        thumbnailId: prev.thumbnailId ?? nextItems[0].id,
      }
    })

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    handleAddPhotos(event.dataTransfer.files)
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleSetThumbnail = (photoId: number) => {
    setPhotosForm((prev) => ({
      ...prev,
      thumbnailId: photoId,
    }))
  }

  const handleRemovePhoto = (photoId: number) => {
    setPhotosForm((prev) => {
      const target = prev.photos.find((photo) => photo.id === photoId)
      if (target) {
        unregisterPhotoUrl(target.src)
      }

      const nextPhotos = prev.photos.filter((photo) => photo.id !== photoId)
      return {
        photos: nextPhotos,
        thumbnailId: prev.thumbnailId === photoId ? (nextPhotos[0]?.id ?? null) : prev.thumbnailId,
      }
    })
  }

  const orderedPhotos = useMemo(() => {
    if (thumbnailId === null) return photos

    const thumbnailPhoto = photos.find((photo) => photo.id === thumbnailId)
    if (!thumbnailPhoto) return photos

    return [thumbnailPhoto, ...photos.filter((photo) => photo.id !== thumbnailId)]
  }, [photos, thumbnailId])

  const coverPhoto = orderedPhotos[0] ?? null
  const galleryPhotos = orderedPhotos.slice(1, PRIMARY_GRID_PHOTO_LIMIT + 1)
  const overflowPhotos = orderedPhotos.slice(PRIMARY_GRID_PHOTO_LIMIT + 1)
  const canAddMore = photos.length < MAX_PHOTOS

  return (
    <div className={styles.formSection}>
      <div className={styles.photoSectionHeader}>
        <div>
          <h3 className={styles.photoSectionTitle}>Property Photos</h3>
          <p className={styles.photoSectionSubtitle}>
            Add high-quality photos to showcase your property. You can add up to 20 photos.
          </p>
        </div>
        <div className={styles.photoCountBadge}>
          {photos.length} / {MAX_PHOTOS} photos
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className={styles.photoInput}
        onChange={(event) => handleAddPhotos(event.target.files)}
      />

      <div
        className={`${styles.photoDropzone} ${isDragging ? styles.photoDropzoneActive : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className={styles.photoDropzoneIcon}>
          <UploadCloud size={30} />
        </div>
        <div className={styles.photoDropzoneContent}>
          <h4 className={styles.photoDropzoneTitle}>Drag and drop photos here</h4>
          <span className={styles.photoDropzoneOr}>or</span>
          <button
            type="button"
            className={styles.photoChooseButton}
            onClick={() => inputRef.current?.click()}
          >
            Choose Photos
          </button>
          <p className={styles.photoDropzoneHint}>JPG, PNG or WebP • Max 10MB per photo</p>
        </div>
      </div>

      <div className={styles.photoGalleryBoard}>
        {coverPhoto && (
          <div className={styles.photoTileWide}>
            <img src={coverPhoto.src} alt={coverPhoto.name} className={styles.photoTileImage} />
            <div className={styles.photoTileTopRow}>
              <span className={styles.photoCoverBadge}>Cover</span>
              <button
                type="button"
                className={styles.photoIconAction}
                onClick={() => handleSetThumbnail(coverPhoto.id)}
              >
                <CircleEllipsis size={16} />
              </button>
            </div>
            <div className={styles.photoTileBottomRow}>
              <button
                type="button"
                className={styles.photoDeleteAction}
                onClick={() => handleRemovePhoto(coverPhoto.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )}

        {galleryPhotos.map((photo) => {
          return (
            <div key={photo.id} className={styles.photoTile}>
              <img src={photo.src} alt={photo.name} className={styles.photoTileImage} />
              <div className={styles.photoTileTopRow}>
                <button
                  type="button"
                  className={styles.photoIconAction}
                  onClick={() => handleSetThumbnail(photo.id)}
                >
                  <CircleEllipsis size={16} />
                </button>
              </div>
              <div className={styles.photoTileBottomRow}>
                <button
                  type="button"
                  className={styles.photoDeleteAction}
                  onClick={() => handleRemovePhoto(photo.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        })}

        <button
          type="button"
          className={styles.photoAddTile}
          onClick={() => inputRef.current?.click()}
          disabled={!canAddMore}
        >
          <div className={styles.photoAddTileIcon}>
            <Plus size={22} />
          </div>
          <span>Add more</span>
        </button>
      </div>

      {overflowPhotos.length > 0 && (
        <div className={styles.photoOverflowRow}>
          <div className={styles.photoOverflowHeaderRow}>
            <h4 className={styles.photoOverflowTitle}>More photos</h4>
            <span className={styles.photoOverflowMeta}>{overflowPhotos.length} extra</span>
          </div>
          <div className={styles.photoOverflowScroller}>
            {overflowPhotos.map((photo) => (
              <div key={photo.id} className={styles.photoOverflowCard}>
                <img src={photo.src} alt={photo.name} className={styles.photoOverflowThumb} />
                <button
                  type="button"
                  className={styles.photoDeleteAction}
                  onClick={() => handleRemovePhoto(photo.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.photoTipBanner}>
        <div className={styles.photoTipIcon}>
          <Info size={16} />
        </div>
        <p className={styles.photoTipText}>
          Tip: The first photo will be your cover photo and appears in search results.
        </p>
      </div>
    </div>
  )
}
