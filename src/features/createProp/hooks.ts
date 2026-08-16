import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { propertyKeys } from '@/features/properties/hooks'
import { apiErrorMessages } from '@/lib/apiError'
import { createListing, uploadListingPhotos } from './api'
import type { CreateListingRequest, PhotosFormState } from './types'

type CreateListingInput = {
  photos: PhotosFormState
  listing: Omit<CreateListingRequest, 'media'>
}

export function useCreateListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ photos, listing }: CreateListingInput) => {
      const media = await uploadListingPhotos(photos)
      return createListing({ ...listing, media })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all })
      toast.success('Property created successfully')
    },
    onError: (err) => {
      const [message] = apiErrorMessages(err)
      toast.error(message ?? 'Could not create property')
    },
  })
}
