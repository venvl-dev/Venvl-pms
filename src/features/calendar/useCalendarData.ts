import { useState, useMemo } from 'react'
import { useProperties } from '@/features/properties/hooks'
import { useReservations } from '@/features/reservations/hooks'
import type { Property } from '@/features/properties/types'
import type { Reservation, BookingChannel } from '@/features/reservations/types'

export function useCalendarData(startDate: string, endDate: string) {
  const [typeFilter, setTypeFilter] = useState('all')
  const [locFilter, setLocFilter] = useState('all')
  const [channelFilter, setChannelFilter] = useState('all')

  const { data: propertiesResponse } = useProperties({ page: 1, limit: 100 })

  const allBookableUnits = useMemo(() => {
    const rawData = propertiesResponse?.data ?? []
    const flatList: Property[] = [] 

    rawData.forEach((listing) => {
      flatList.push(listing)
      
      if (listing.children && listing.children.length > 0) {
        flatList.push(...listing.children)
      }
    })
    return flatList
  }, [propertiesResponse?.data])

  const typeOptions = useMemo(
    () => ['all', ...Array.from(new Set(allBookableUnits.map((u) => u.structureType)))],
    [allBookableUnits],
  )

  const locOptions = useMemo(
    () => [
      'all',
      ...Array.from(new Set(allBookableUnits.map((u) => u.city).filter((c): c is string => !!c))),
    ],
    [allBookableUnits],
  )

  const filteredUnits = useMemo(() => {
    return allBookableUnits.filter((u) => {
      const matchType = typeFilter === 'all' || u.structureType === typeFilter
      const matchLoc = locFilter === 'all' || u.city === locFilter
      const matchChan =
        channelFilter === 'all' || u.channelConnections.includes(channelFilter as BookingChannel)
      return matchType && matchLoc && matchChan
    })
  }, [allBookableUnits, typeFilter, locFilter, channelFilter])

  // 2. Fetch Reservations for the current timeline window
  const { data: reservationsResponse, isFetching } = useReservations({
    page: 1,
    limit: 100,
    startDate,
    endDate,
  })

  // 3. Attach reservations to units
  const unitReservations = useMemo(() => {
    const map = new Map<string, Reservation[]>()
    filteredUnits.forEach((u) => map.set(u.id, []))
    
    const liveReservations = reservationsResponse?.data ?? []
    
    liveReservations.forEach((res) => {
      const channel = res.customer?.ota || 'direct'
      
      if (channelFilter !== 'all' && channel !== channelFilter) return
      
      if (map.has(res.listingId)) {
        map.get(res.listingId)?.push(res)
      }
    })
    return map
  }, [filteredUnits, channelFilter, reservationsResponse?.data])

  return {
    filteredUnits,
    unitReservations,
    isFetching,
    typeFilter,
    setTypeFilter,
    typeOptions,
    locFilter,
    setLocFilter,
    locOptions,
    channelFilter,
    setChannelFilter,
  }
}