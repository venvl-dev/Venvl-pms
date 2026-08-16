import axios from 'axios'
import { api } from '@/lib/apiClient'
import type { ApiEnvolope } from '@/features/auth/types'
import type { Property } from '@/features/properties/types'
import type {
  CreateListingRequest,
  ListingMedia,
  PhotosFormState,
  PresignRequest,
  PresignResponse,
} from './types'

export async function getPresignedUrls(body: PresignRequest): Promise<PresignResponse> {
  const { data } = await api.post<PresignResponse>('/upload/presigned/url', body)
  return data
}


export async function uploadToS3(uploadUrl: string, file: File): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: { 'Content-Type': file.type },
    withCredentials: false,
  })
}

export async function uploadListingPhotos({
  photos,
  thumbnailId,
}: PhotosFormState): Promise<ListingMedia> {
  const files = photos.map((photo, i) => ({
    type: photo.id === thumbnailId ? ('thumbnail' as const) : ('gallery' as const),
    fileName: `${i}-${photo.name.replace(/[^\w.-]/g, '_')}`,
    contentType: photo.file.type,
  }))

  const { uploads } = await getPresignedUrls({ resourceType: 'listing', files })
  await Promise.all(uploads.map((u, i) => uploadToS3(u.uploadUrl, photos[i].file)))

  const thumbnail = uploads.find((u) => u.type === 'thumbnail')
  if (!thumbnail) throw new Error('Presign response is missing a thumbnail upload')

  return {
    thumbnailKey: thumbnail.key,
    imageKeys: uploads.filter((u) => u.type === 'gallery').map((u) => u.key),
  }
}

export async function createListing(body: CreateListingRequest): Promise<Property> {
  const { data } = await api.post<ApiEnvolope<Property>>('/listing', body)
  return data.data
}
