import { defineStore } from 'pinia'

export interface CartLineItem {
  id: number
  productId: number
  name: string
  tag: string
  meta: string
  unitPrice: number
  quantity: number
  image: string
}

let nextLineId = 2000

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartLineItem[]>([])

  const itemCount = computed(() =>
    items.value.reduce((n, line) => n + line.quantity, 0),
  )

  const subtotal = computed(() =>
    items.value.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
  )

  const shippingNpr = 200

  const total = computed(() => subtotal.value + shippingNpr)

  function lineTotal(line: CartLineItem): number {
    return line.unitPrice * line.quantity
  }

  /**
   * Add a product to the cart. Accepts the product data directly
   * so the store doesn't need to fetch from the API itself.
   */
  function addItem(
    product: { id: number; title: string; head: string; price: number; images?: string[] },
    variantLabel: string = '',
  ) {
    const existing = items.value.find(
      (l) => l.productId === product.id && l.meta === variantLabel,
    )
    if (existing) {
      existing.quantity++
      return
    }

    const tail = product.head?.split('·').pop()?.trim() ?? product.head ?? ''
    const imgs = product.images ?? []

    items.value.push({
      id: nextLineId++,
      productId: product.id,
      name: product.title,
      tag: tail ? `${tail} · Commission` : 'Commission',
      meta: variantLabel,
      unitPrice: product.price,
      quantity: 1,
      image: imgs[0] ?? '',
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

