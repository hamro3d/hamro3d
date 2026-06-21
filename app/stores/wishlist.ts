import { defineStore } from 'pinia'

export const useWishlistStore = defineStore('wishlist', () => {
  const savedIds = ref<number[]>([])

  const count = computed(() => savedIds.value.length)

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

  return { savedIds, count, isSaved, toggle, remove }
})

