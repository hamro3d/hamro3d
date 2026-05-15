/**
 * Phase 0 mock admin commission rows — replace with API.
 */

export type MockAdminOrderStatus =
  | 'Awaiting review'
  | 'In craft'
  | 'Shipped'
  | 'Delivered'

export interface MockAdminOrderLineItem {
  name: string
  meta: string
  qty: number
  unitPrice: number
  lineTotal: number
}

export interface MockAdminOrderDelivery {
  name: string
  address: string
  phone: string
}

export interface MockAdminOrderPayment {
  method: string
  subtotal: number
  shipping: number
  total: number
}

export interface MockAdminOrderTimelineStep {
  label: string
  date: string
  state: 'done' | 'active' | 'pending'
}

export interface MockAdminOrder {
  id: string
  customer: string
  date: string
  status: MockAdminOrderStatus
  totalNpr: number
  summary: string
  lines: MockAdminOrderLineItem[]
  delivery: MockAdminOrderDelivery
  payment: MockAdminOrderPayment
  timeline: MockAdminOrderTimelineStep[]
}

export const mockAdminOrders: MockAdminOrder[] = [
  {
    id: 'H3D-24089',
    customer: 'Priya K.',
    date: '6 May 2026',
    status: 'In craft',
    totalNpr: 12700,
    summary: 'Custom Human Figurine · Memory Keychain',
    lines: [
      { name: 'Custom Human Figurine', meta: '15 cm · FDM · Skin-tone resin', qty: 1, unitPrice: 10500, lineTotal: 10500 },
      { name: 'Memory Keychain', meta: 'Resin · Photo embed', qty: 1, unitPrice: 2200, lineTotal: 2200 },
    ],
    delivery: { name: 'Priya Karki', address: 'Thamel, Ward 26\nKathmandu 44600\nNepal', phone: '+977 98XXXXXXXX' },
    payment: { method: 'eSewa', subtotal: 12700, shipping: 0, total: 12700 },
    timeline: [
      { label: 'Order Placed', date: '6 May 2026', state: 'done' },
      { label: 'Payment Confirmed', date: '6 May 2026', state: 'done' },
      { label: 'Artisan Assigned', date: '7 May 2026', state: 'done' },
      { label: 'Crafting in Progress', date: 'Figurine on the print farm', state: 'active' },
      { label: 'Quality Check', date: 'Pending', state: 'pending' },
      { label: 'Shipped', date: 'Pending', state: 'pending' },
      { label: 'Delivered', date: 'Pending', state: 'pending' },
    ],
  },
  {
    id: 'H3D-24088',
    customer: 'Sameer T.',
    date: '5 May 2026',
    status: 'Shipped',
    totalNpr: 4200,
    summary: 'Portrait Litholamp',
    lines: [
      { name: 'Portrait Litholamp', meta: '10 cm · Lithophane · White PLA', qty: 1, unitPrice: 4200, lineTotal: 4200 },
    ],
    delivery: { name: 'Sameer Tamang', address: 'Patan Dhoka\nLalitpur 44700\nNepal', phone: '+977 98XXXXXXXX' },
    payment: { method: 'Cash on Delivery', subtotal: 4000, shipping: 200, total: 4200 },
    timeline: [
      { label: 'Order Placed', date: '5 May 2026', state: 'done' },
      { label: 'Payment Confirmed', date: '5 May 2026', state: 'done' },
      { label: 'Artisan Assigned', date: '5 May 2026', state: 'done' },
      { label: 'Crafting Complete', date: '7 May 2026', state: 'done' },
      { label: 'Quality Check', date: '8 May 2026', state: 'done' },
      { label: 'Shipped', date: 'In transit via Pathao', state: 'active' },
      { label: 'Delivered', date: 'Pending', state: 'pending' },
    ],
  },
  {
    id: 'H3D-24087',
    customer: 'Anita S.',
    date: '4 May 2026',
    status: 'Awaiting review',
    totalNpr: 17200,
    summary: 'Anniversary Sculpture · Custom Nameplate',
    lines: [
      { name: 'Anniversary Sculpture', meta: '20 cm · Resin · Hand-painted', qty: 1, unitPrice: 14000, lineTotal: 14000 },
      { name: 'Custom Nameplate', meta: 'Wooden base · Engraved', qty: 1, unitPrice: 3200, lineTotal: 3200 },
    ],
    delivery: { name: 'Anita Shrestha', address: 'New Baneshwor\nKathmandu 44600\nNepal', phone: '+977 98XXXXXXXX' },
    payment: { method: 'Khalti', subtotal: 17200, shipping: 0, total: 17200 },
    timeline: [
      { label: 'Order Placed', date: '4 May 2026', state: 'done' },
      { label: 'Awaiting Review', date: 'Reviewing customer photos', state: 'active' },
      { label: 'Artisan Assigned', date: 'Pending', state: 'pending' },
      { label: 'Crafting', date: 'Pending', state: 'pending' },
      { label: 'Quality Check', date: 'Pending', state: 'pending' },
      { label: 'Shipped', date: 'Pending', state: 'pending' },
      { label: 'Delivered', date: 'Pending', state: 'pending' },
    ],
  },
  {
    id: 'H3D-24086',
    customer: 'Rajan B.',
    date: '3 May 2026',
    status: 'In craft',
    totalNpr: 3800,
    summary: 'Moon Lamp',
    lines: [
      { name: 'Moon Lamp', meta: '12 cm · Lithophane · Warm LED', qty: 1, unitPrice: 3800, lineTotal: 3800 },
    ],
    delivery: { name: 'Rajan Basnet', address: 'Budhanilkantha-4\nKathmandu 44600\nNepal', phone: '+977 98XXXXXXXX' },
    payment: { method: 'eSewa', subtotal: 3600, shipping: 200, total: 3800 },
    timeline: [
      { label: 'Order Placed', date: '3 May 2026', state: 'done' },
      { label: 'Payment Confirmed', date: '3 May 2026', state: 'done' },
      { label: 'Artisan Assigned', date: '4 May 2026', state: 'done' },
      { label: 'Crafting in Progress', date: 'Moon lamp being printed', state: 'active' },
      { label: 'Quality Check', date: 'Pending', state: 'pending' },
      { label: 'Shipped', date: 'Pending', state: 'pending' },
      { label: 'Delivered', date: 'Pending', state: 'pending' },
    ],
  },
  {
    id: 'H3D-24085',
    customer: 'Mina L.',
    date: '2 May 2026',
    status: 'Delivered',
    totalNpr: 26550,
    summary: 'Hand Mold Casting · 3D Dinosaur Puzzle',
    lines: [
      { name: 'Hand Mold Casting', meta: 'Life-size · Alginate · Resin cast', qty: 1, unitPrice: 18000, lineTotal: 18000 },
      { name: '3D Dinosaur Puzzle', meta: 'T-Rex · 35 pieces · PLA', qty: 1, unitPrice: 8550, lineTotal: 8550 },
    ],
    delivery: { name: 'Mina Lama', address: 'Jhamsikhel\nLalitpur 44700\nNepal', phone: '+977 98XXXXXXXX' },
    payment: { method: 'Cash on Delivery', subtotal: 26550, shipping: 0, total: 26550 },
    timeline: [
      { label: 'Order Placed', date: '2 May 2026', state: 'done' },
      { label: 'Payment Confirmed', date: '2 May 2026', state: 'done' },
      { label: 'Artisan Assigned', date: '3 May 2026', state: 'done' },
      { label: 'Crafting Complete', date: '6 May 2026', state: 'done' },
      { label: 'Quality Check', date: '7 May 2026', state: 'done' },
      { label: 'Shipped', date: '7 May 2026', state: 'done' },
      { label: 'Delivered', date: '8 May 2026', state: 'done' },
    ],
  },
  {
    id: 'H3D-24084',
    customer: 'Karma D.',
    date: '1 May 2026',
    status: 'Delivered',
    totalNpr: 2200,
    summary: 'Custom Photo Print on Wood',
    lines: [
      { name: 'Custom Photo Print on Wood', meta: '8×10 inch · Maple · UV print', qty: 1, unitPrice: 2200, lineTotal: 2200 },
    ],
    delivery: { name: 'Karma Dorje', address: 'Boudha\nKathmandu 44600\nNepal', phone: '+977 98XXXXXXXX' },
    payment: { method: 'Khalti', subtotal: 2000, shipping: 200, total: 2200 },
    timeline: [
      { label: 'Order Placed', date: '1 May 2026', state: 'done' },
      { label: 'Payment Confirmed', date: '1 May 2026', state: 'done' },
      { label: 'Artisan Assigned', date: '1 May 2026', state: 'done' },
      { label: 'Crafting Complete', date: '3 May 2026', state: 'done' },
      { label: 'Quality Check', date: '4 May 2026', state: 'done' },
      { label: 'Shipped', date: '4 May 2026', state: 'done' },
      { label: 'Delivered', date: '5 May 2026', state: 'done' },
    ],
  },
]

export function getMockAdminOrderById(id: string): MockAdminOrder | undefined {
  return mockAdminOrders.find((o) => o.id === id)
}
