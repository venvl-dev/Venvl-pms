import { api } from '@/lib/apiClient'
import { MOCK_PROPERTIES } from './mockProperties'
import type { CreatePropertyResponse, PaginatedResponse, Property } from './types'

export const is_mock = true

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function normalizeProperty(input: Partial<Property> & { id: string }): Property {
  return {
    id: input.id,
    parentId: input.parentId,
    name: input.name ?? 'Untitled Property',
    image:
      input.image ??
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=150',
    type: input.type ?? 'single',
    location: input.location ?? 'Unknown location',
    status: input.status ?? 'draft',
    channels: input.channels ?? [],
    bedrooms: input.bedrooms ?? 1,
    bathrooms: input.bathrooms ?? 1,
    description: input.description,
    amenities: input.amenities ?? [],
    pricing: input.pricing,
    additionalInfo: input.additionalInfo,
  }
}

export async function getProperties(): Promise<PaginatedResponse<Property>> {
  if (is_mock) {
    await delay(700)
    return {
      data: MOCK_PROPERTIES.map((item) => normalizeProperty(item)),
      meta: {
        totalCount: MOCK_PROPERTIES.length,
        totalPages: Math.ceil(MOCK_PROPERTIES.length / 10),
        currentPage: 1,
        limit: 10,
      },
    }
  }

  const { data } = await api.get<PaginatedResponse<Property>>('/properties')
  return {
    data: data.data.map((item) => normalizeProperty(item)),
    meta: data.meta,
  }
}

export async function getPropertyById(id: string): Promise<Property> {
  if (is_mock) {
    await delay(700)
    const property = MOCK_PROPERTIES.find((item) => item.id === id)
    if (!property) throw new Error('Property not found')
    return normalizeProperty(property)
  }

  const { data } = await api.get<Property>(`/property/${id}`)
  return normalizeProperty(data)
}

export async function createProperty(prop: Omit<Property, 'id'>): Promise<CreatePropertyResponse> {
  if (is_mock) {
    await delay(700)
    const created: Property = {
      ...normalizeProperty({
        ...prop,
        id: `MOCK-${Date.now()}`,
      }),
      channels: prop.channels ?? [],
      amenities: prop.amenities ?? [],
    }
    MOCK_PROPERTIES.push(created)
    return { data: created, message: 'Property created successfully' }
  }

  const { data } = await api.post<CreatePropertyResponse>('/property/create', prop)
  return data
}

export async function updateProperty(
  id: string,
  prop: Omit<Property, 'id'>,
): Promise<CreatePropertyResponse> {
  if (is_mock) {
    await delay(700)
    const index = MOCK_PROPERTIES.findIndex((item) => item.id === id)
    if (index === -1) throw new Error('Property not found')

    const updated = normalizeProperty({
      ...MOCK_PROPERTIES[index],
      ...prop,
      id,
    })
    MOCK_PROPERTIES[index] = updated

    return { data: updated, message: 'Property updated successfully' }
  }

  const { data } = await api.put<CreatePropertyResponse>(`/property/update/${id}`, prop)
  return data
}

export async function deleteProperty(id: string): Promise<CreatePropertyResponse> {
  if (is_mock) {
    await delay(700)
    const index = MOCK_PROPERTIES.findIndex((item) => item.id === id)
    if (index === -1) throw new Error('Property not found')

    const [removed] = MOCK_PROPERTIES.splice(index, 1)
    return { data: normalizeProperty(removed), message: 'Property deleted successfully' }
  }

  const { data } = await api.delete<CreatePropertyResponse>(`/property/delete/${id}`)
  return data
}
