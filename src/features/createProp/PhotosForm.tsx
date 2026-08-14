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
import type { PhotosFormState } from './types'

const MAX_PHOTOS = 20

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

  const [hoveredCoverId, setHoveredCoverId] = useState<number | null>(null)
  const [visibleLabelId, setVisibleLabelId] = useState<number | null>(null)
  const coverLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCoverHoverEnter = (photoId: number) => {
    if (coverLeaveTimer.current) clearTimeout(coverLeaveTimer.current)
    setHoveredCoverId(photoId)
    setVisibleLabelId(photoId)
  }

  const handleCoverHoverLeave = (photoId: number) => {
    setHoveredCoverId(null)
    // keep the label mounted until the collapse transition finishes
    coverLeaveTimer.current = setTimeout(
      () => setVisibleLabelId((prev) => (prev === photoId ? null : prev)),
      300,
    )
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
  const galleryPhotos = orderedPhotos.slice(1)
  const canAddMore = photos.length < MAX_PHOTOS

  return (
    <div className={styles.formSection}>
      <div className={styles.photoSectionHeader}>
        <div>
          <h3 className={styles.photoSectionTitle}>Property Photos</h3>
          <p className={`${styles.photoSectionSubtitle} ${styles.photoSectionHidePhone}`}>
            Add high-quality photos to showcase your property. You can add up to 20 photos.
          </p>
        </div>
        <div className={styles.photoCountBadge}>
          {photos.length} / {MAX_PHOTOS} photos
        </div>
      </div>
      <p className={`${styles.photoSectionSubtitle} ${styles.photoSectionHideDesktop}`}>
        Add high-quality photos to showcase your property. You can add up to 20 photos.
      </p>

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
        <div className={`${styles.photoDropzoneContent} ${styles.photoSectionHidePhone}`}>
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
        <div className={`${styles.photoDropzoneContent} ${styles.photoSectionHideDesktop}`}>
          <h4 className={styles.photoDropzoneTitle}>Upload Photos Here</h4>
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
                  className={`${styles.photoIconAction} ${hoveredCoverId === photo.id ? styles.photoIconHovered : ''}`}
                  onClick={() => handleSetThumbnail(photo.id)}
                  onMouseEnter={() => handleCoverHoverEnter(photo.id)}
                  onMouseLeave={() => handleCoverHoverLeave(photo.id)}
                >
                  <div className={styles.photoSectionHidePhone}>
                    {visibleLabelId === photo.id ? (
                      <span className={styles.coverButton}>Set Cover</span>
                    ) : (
                      <CircleEllipsis size={16} />
                    )}
                  </div>
                  <span className={`${styles.coverButton} ${styles.photoSectionHideDesktop}`}>
                    Set Cover
                  </span>
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
