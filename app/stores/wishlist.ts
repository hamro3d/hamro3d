import { defineStore } from 'pinia'
import { mockWishlistProductIds } from '~/data/mock-wishlist'
import { formatNprPrice, getMockProductById } from '~/data/mock-products'

export interface WishlistItemView {
  id: number
  tag: string
  name: string
  price: string
  image: string
}

export const useWishlistStore = defineStore('wishlist', () => {
  const savedIds = ref<number[]>([...mockWishlistProductIds])

  const count = computed(() => savedIds.value.length)

  const items = computed<WishlistItemView[]>(() =>
    savedIds.value
      .map((pid) => {
        const p = getMockProductById(pid)
        if (!p) return null
        const tag = p.head.split('·').pop()?.trim() ?? p.head
        return {
          id: p.id,
          tag,
          name: p.title,
          price: formatNprPrice(p.price),
          image: p.images[0] ?? '',
        }
      })
      .filter((row): row is WishlistItemView => row !== null),
  )

  function isSaved(productId: number): boolean {
    return savedIds.value.includes(productId)
  }

  function toggle(productId: number) {
    if (isSaved(productId)) {
      savedIds.value = savedIds.value.filter((id) => id !== productId)
    } else {
      savedIds.value.push(productId)
    }
  }

  function remove(productId: number) {
    savedIds.value = savedIds.value.filter((id) => id !== productId)
  }

  return { savedIds, count, items, isSaved, toggle, remove }
})
