import { defineStore } from 'pinia'
import type { MockCartLineView } from '~/data/mock-cart'
import { initialMockCartLines } from '~/data/mock-cart'
import { getMockProductById } from '~/data/mock-products'

let nextLineId = 2000

export const useCartStore = defineStore('cart', () => {
  // const items = ref<MockCartLineView[]>(initialMockCartLines())
  const items = ref<MockCartLineView[]>([])

  const itemCount = computed(() =>
    items.value.reduce((n, line) => n + line.quantity, 0),
  )

  const subtotal = computed(() =>
    items.value.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
  )

  const shippingNpr = 200

  const total = computed(() => subtotal.value + shippingNpr)

  function lineTotal(line: MockCartLineView): number {
    return line.unitPrice * line.quantity
  }

  function addItem(productId: number, variantLabel: string = '') {
    const existing = items.value.find(
      (l) => l.productId === productId && l.meta === variantLabel,
    )
    if (existing) {
      existing.quantity++
      return
    }

    const p = getMockProductById(productId)
    if (!p) return

    const tail = p.head.split('·').pop()?.trim() ?? p.head

    items.value.push({
      id: nextLineId++,
      productId: p.id,
      name: p.title,
      tag: `${tail} · Commission`,
      meta: variantLabel,
      unitPrice: p.price,
      quantity: 1,
      image: p.images[0] ?? '',
    })
  }

  function updateQuantity(lineId: number, delta: number) {
    const idx = items.value.findIndex((l) => l.id === lineId)
    if (idx === -1) return
    const next = items.value[idx].quantity + delta
    if (next < 1) {
      items.value.splice(idx, 1)
      return
    }
    items.value[idx] = { ...items.value[idx], quantity: next }
  }

  function removeItem(lineId: number) {
    items.value = items.value.filter((l) => l.id !== lineId)
  }

  function clear() {
    items.value = []
  }

  return {
    items,
    itemCount,
    subtotal,
    shippingNpr,
    total,
    lineTotal,
    addItem,
    updateQuantity,
    removeItem,
    clear,
  }
})
