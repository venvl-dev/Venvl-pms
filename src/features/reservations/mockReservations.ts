export type { Reservation, ReservationStatus, BookingChannel } from './types'
import { DB } from './mockDb'

export const MOCK_RESERVATIONS = DB

export const getReservationId = (id: string) => MOCK_RESERVATIONS.find((r) => r.id === id)
