// import { z } from 'zod'

// export const createReservationSchema = z.object({
//   guestName: z.string().min(2, 'Guest name is required'),
//   checkIn: z.string().min(1, 'Check-in date is required'),
//   checkOut: z.string().min(1, 'Check-out date is required'),
//   propertyId: z.string().min(1, 'Property is required'),
//   unitId: z.string().min(1, 'Unit is required'),
//   channel: z.enum(['direct', 'airbnb', 'booking.com', 'vrbo', 'expedia']),
//   totalAmount: z.number().min(0, 'Total amount cannot be negative'),
// })

// export type CreateReservationValues = z.infer<typeof createReservationSchema>