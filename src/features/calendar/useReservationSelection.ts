import { useState, useRef, useCallback } from 'react'
import type { Reservation } from '@/features/reservations/types'

export function useReservationSelection(scrollRef: React.RefObject<HTMLDivElement | null>) {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [popoverAnchor, setPopoverAnchor] = useState<DOMRect | null>(null)
  const scrollOriginRef = useRef<{ x: number; y: number } | null>(null)

  const handleSelectReservation = useCallback((res: Reservation, rect: DOMRect) => {
    setSelectedReservation(res)
    setPopoverAnchor(rect)
    if (scrollRef.current) {
      scrollOriginRef.current = {
        x: scrollRef.current.scrollLeft,
        y: scrollRef.current.scrollTop,
      }
    }
  }, [scrollRef])

  const closePopover = useCallback(() => {
    setSelectedReservation(null)
    setPopoverAnchor(null)
    scrollOriginRef.current = null
  }, [])

  const handleScrollActivity = useCallback((scrollLeft: number, scrollTop: number) => {
    if (selectedReservation && scrollOriginRef.current !== null) {
      const dx = Math.abs(scrollLeft - scrollOriginRef.current.x)
      const dy = Math.abs(scrollTop - scrollOriginRef.current.y)
      if (dx > 20 || dy > 20) {
        closePopover()
      }
    }
  }, [selectedReservation, closePopover])

  return {
    selectedReservation,
    popoverAnchor,
    handleSelectReservation,
    closePopover,
    handleScrollActivity,
  }
}