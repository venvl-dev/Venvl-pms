import type { Reservation } from './types'

const HEADERS = [
  'Booking ID',
  'Guest Name',
  'Guest Email',
  'Check-in',
  'Check-out',
  'Property',
  'City',
  'Channel',
  'Status',
  'Total Amount',
  'Currency',
]

const escapeCsv = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  let s = String(value)
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
  return /["\n\r,]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const toRow = (res: Reservation) => [
  res.id,
  res.customer?.name ?? '',
  res.customer?.email ?? '',
  res.startDate,
  res.endDate,
  res.listing?.name ?? '',
  res.listing?.location?.city ?? '',
  res.customer?.ota ?? 'direct',
  res.status,
  res.amount ?? '',
  res.currency ?? '',
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

  if (!dataToExport?.length) {
    throw new Error('There are no reservations to export.')
  }

  const lines = [HEADERS, ...dataToExport.map(toRow)].map((row) => row.map(escapeCsv).join(','))
  const csvContent = '\uFEFF' + lines.join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  const fileName = type === 'all' ? 'reservations_full_export' : 'reservations_page_export'
  link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`)

  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
