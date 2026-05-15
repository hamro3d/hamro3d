/**
 * Phase 0 mock user order history — replace with API.
 */

export type MockUserOrderStatus = 'Delivered' | 'In Progress' | 'Processing'

export interface MockUserOrderLineItem {
  name: string
  meta: string
  qty: number
  unitPrice: number
  lineTotal: number
}

export interface MockUserOrderDelivery {
  address: string
  estimated: string
}

export interface MockUserOrderPayment {
  method: string
}

export interface MockUserOrderTimelineStep {
  label: string
  date: string
  state: 'done' | 'active' | 'pending'
}

export interface MockUserOrder {
  id: string
  date: string
  status: MockUserOrderStatus
  lines: MockUserOrderLineItem[]
  subtotal: number
  shipping: number
  total: number
  delivery: MockUserOrderDelivery
  payment: MockUserOrderPayment
  timeline: MockUserOrderTimelineStep[]
}

export const mockUserOrders: MockUserOrder[] = [
  {
    id: 'H3D-2025-0042',
    date: 'March 14, 2025',
    status: 'Delivered',
    lines: [
      { name: 'Custom Human Figurine', meta: '15 cm · FDM · Skin-tone resin', qty: 1, unitPrice: 12000, lineTotal: 12000 },
      { name: 'Memory Keychain', meta: 'Resin · Photo embed', qty: 1, unitPrice: 1750, lineTotal: 1750 },
    ],
    subtotal: 13750,
    shipping: 0,
    total: 13750,
    delivery: {
      address: 'Aarav Sharma\nBasanta Chowk, House 12\nLalitpur 44700\nNepal',
      estimated: 'Delivered March 18, 2025',
    },
    payment: { method: 'Cash on Delivery' },
    timeline: [
      { label: 'Order Placed', date: 'March 14, 2025', state: 'done' },
      { label: 'Payment Confirmed', date: 'March 14, 2025', state: 'done' },
      { label: 'Artisan Assigned', date: 'March 15, 2025', state: 'done' },
      { label: 'Crafting Complete', date: 'March 16, 2025', state: 'done' },
      { label: 'Quality Check', date: 'March 17, 2025', state: 'done' },
      { label: 'Shipped', date: 'March 17, 2025', state: 'done' },
      { label: 'Delivered', date: 'March 18, 2025', state: 'done' },
    ],
  },
  {
    id: 'H3D-2025-0039',
    date: 'February 28, 2025',
    status: 'In Progress',
    lines: [
      { name: 'Anniversary Sculpture', meta: '20 cm · Resin · Hand-painted', qty: 1, unitPrice: 14000, lineTotal: 14000 },
    ],
    subtotal: 14000,
    shipping: 250,
    total: 14250,
    delivery: {
      address: 'Aarav Sharma\nBasanta Chowk, House 12\nLalitpur 44700\nNepal',
      estimated: 'On or before April 5, 2025',
    },
    payment: { method: 'eSewa' },
    timeline: [
      { label: 'Order Placed', date: 'February 28, 2025', state: 'done' },
      { label: 'Payment Confirmed', date: 'February 28, 2025', state: 'done' },
      { label: 'Artisan Assigned', date: 'March 1, 2025', state: 'done' },
      { label: 'Crafting in Progress', date: 'Your sculpture is in the studio', state: 'active' },
      { label: 'Quality Check', date: 'Pending', state: 'pending' },
      { label: 'Shipped', date: 'Pending', state: 'pending' },
      { label: 'Delivered', date: 'Pending', state: 'pending' },
    ],
  },
  {
    id: 'H3D-2025-0031',
    date: 'January 15, 2025',
    status: 'Delivered',
    lines: [
      { name: 'Portrait Litholamp', meta: '10 cm · Lithophane · White PLA', qty: 1, unitPrice: 2800, lineTotal: 2800 },
      { name: 'Custom Nameplate', meta: 'Wooden base · Engraved', qty: 1, unitPrice: 800, lineTotal: 800 },
    ],
    subtotal: 3600,
    shipping: 0,
    total: 3600,
    delivery: {
      address: 'Aarav Sharma\nBasanta Chowk, House 12\nLalitpur 44700\nNepal',
      estimated: 'Delivered January 22, 2025',
    },
    payment: { method: 'Khalti' },
    timeline: [
      { label: 'Order Placed', date: 'January 15, 2025', state: 'done' },
      { label: 'Payment Confirmed', date: 'January 15, 2025', state: 'done' },
      { label: 'Artisan Assigned', date: 'January 16, 2025', state: 'done' },
      { label: 'Crafting Complete', date: 'January 19, 2025', state: 'done' },
      { label: 'Quality Check', date: 'January 20, 2025', state: 'done' },
      { label: 'Shipped', date: 'January 21, 2025', state: 'done' },
      { label: 'Delivered', date: 'January 22, 2025', state: 'done' },
    ],
  },
]

export function getMockUserOrderById(id: string): MockUserOrder | undefined {
  return mockUserOrders.find((o) => o.id === id)
}
