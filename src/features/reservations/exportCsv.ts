import type { Reservation } from './types'

const HEADERS = [
  'Booking ID',
  'Guest Name',
  'Check-in',
  'Check-out',
  'Property',
  'Unit',
  'Channel',
  'Status',
  'Total Amount',
  'Balance Due',
]

interface ExportOptions {
  visibleRows: Reservation[]
  fetchAll: () => Promise<Reservation[]>
}

export async function exportReservationsCsv(
  type: 'visible' | 'all',
  { visibleRows, fetchAll }: ExportOptions,
): Promise<void> {
  const dataToExport = type === 'visible' ? visibleRows : await fetchAll()

  if (!dataToExport || dataToExport.length === 0) return

  const rows = dataToExport.map((res) => [
    res.id,
    `"${res.guestName}"`,
    res.checkIn,
    res.checkOut,
    `"${res.property}"`,
    `"${res.unit}"`,
    res.channel,
    res.status,
    res.totalAmount,
    res.balanceDue,
  ])

  const csvContent = [HEADERS.join(','), ...rows.map((row) => row.join(','))].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  const fileName = type === 'all' ? 'reservations_full_export' : 'reservations_page_export'
  link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`)

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
