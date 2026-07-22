import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import {
  createProperty,
  deleteProperty,
  getProperties,
  getPropertyById,
  updateProperty,
} from './api'
import type { Property } from './types'
import { toast } from 'sonner'

export const propertyKeys = {
  all: ['properties'] as const,
  list: () => [...propertyKeys.all, 'list'] as const,
  detail: (id: string) => [...propertyKeys.all, 'detail', id] as const,
}


export function useProperties() {
  return useQuery({
    queryKey: propertyKeys.list(),
    queryFn: getProperties,
  })
}

export function usePropertyById(id: string | undefined) {
  return useQuery({
    queryKey: propertyKeys.detail(id!),
    queryFn: () => getPropertyById(id!),
    enabled: !!id,
  })
}

export function useCreateProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Omit<Property, 'id'>) => createProperty(payload),
       onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all })
      toast.success('Property created successfully')
    },
    onError: () => toast.error('Could not create property'),
  })

}

export function useUpdateProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Omit<Property, 'id'> }) =>
      updateProperty(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all })
      toast.success('Property updated successfully')
    },
    onError: () => toast.error('Could not update property'),
  })

}

export function useDeleteProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProperty(id),
     onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all })
      toast.warning('Property deleted successfully')
    },
    onError: () => toast.error('Could not delete property'),
  })

}
