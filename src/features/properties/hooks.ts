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

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  })
}

export function usePropertyById(id: string | undefined) {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: () => getPropertyById(id!),
    enabled: !!id,
  })
}

export function useCreateProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Omit<Property, 'id'>) => createProperty(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['properties'],
      })
      toast.success('Property Created Successfully!')
    },
  })
}

export function useUpdateProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Omit<Property, 'id'> }) =>
      updateProperty(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['properties'],
      })
      toast.success('Property Updated Successfully!')
    },
  })
}

export function useDeleteProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['properties'],
      })
      toast.warning('Property Deleted Sucessfully')
    },
  })
}
