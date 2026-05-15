/**
 * Phase 0 mock cart lines — replace with persisted cart / API.
 */

import type { MockProduct } from './mock-products'
import { getMockProductById } from './mock-products'

export interface MockCartLineSeed {
  /** Stable row id (not catalogue id) */
  lineId: number
  productId: number
  quantity: number
  /** Shown under the title — size · material */
  variantLabel: string
}

export const mockCartLineSeeds: MockCartLineSeed[] = [
  { lineId: 1001, productId: 0, quantity: 1, variantLabel: '15 cm · Resin' },
  { lineId: 1002, productId: 1, quantity: 2, variantLabel: '15 cm · Natural stone' },
  { lineId: 1003, productId: 4, quantity: 1, variantLabel: '4 cm · Resin & metal' },
]

function catalogueTagLine(p: MockProduct): string {
  const tail = p.head.split('·').pop()?.trim() ?? p.head
  return `${tail} · Commission`
}

export interface MockCartLineView {
  id: number
  productId: number
  name: string
  tag: string
  meta: string
  unitPrice: number
  quantity: number
  image: string
}

export function cartLinesFromSeeds(seeds: MockCartLineSeed[]): MockCartLineView[] {
  return seeds.map((seed) => {
    const p = getMockProductById(seed.productId)
    if (!p) {
      throw new Error(`mock-cart: unknown productId ${seed.productId}`)
    }
    return {
      id: seed.lineId,
      productId: seed.productId,
      name: p.title,
      tag: catalogueTagLine(p),
      meta: seed.variantLabel,
      unitPrice: p.price,
      quantity: seed.quantity,
      image: p.images[0] ?? '',
    }
  })
}

export function initialMockCartLines(): MockCartLineView[] {
  return cartLinesFromSeeds(mockCartLineSeeds)
}
