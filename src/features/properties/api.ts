import { api } from '@/lib/apiClient'
import type { CreatePropertyResponse, PaginatedResponse, Property } from './types'

export async function getProperties(params: { page: number; limit: number }): Promise<PaginatedResponse<Property>> {

  const { data } = await api.get<PaginatedResponse<Property>>('/listing', { params })
  return {
    data: data.data || [],
    meta: data.meta || {
      total: data.data?.length || 0,
      page: params.page,
      limit: params.limit,
    }
  }
}

export async function getPropertyById(id: string): Promise<Property> {
  const { data } = await api.get<{ data: Property }>(`/listing/${id}`)
  return data.data 
}

export async function createProperty(prop: Omit<Property, 'id'>): Promise<CreatePropertyResponse> {
  const { data } = await api.post<CreatePropertyResponse>('/property/create', prop)
  return data
}

export async function updateProperty(
  id: string,
  prop: Omit<Property, 'id'>,
): Promise<CreatePropertyResponse> {
  const { data } = await api.put<CreatePropertyResponse>(`/property/update/${id}`, prop)
  return data
}

export async function deleteProperty(id: string): Promise<CreatePropertyResponse> {
  const { data } = await api.delete<CreatePropertyResponse>(`/property/delete/${id}`)
  return data
}
