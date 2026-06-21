import {
  definePayloadPlugin,
  definePayloadReducer,
  definePayloadReviver,
} from '#imports'
import { shouldHydrate as piniaShouldHydrate } from 'pinia'

/**
 * Pinia's shouldHydrate uses obj.hasOwnProperty(), which throws on
 * null-prototype objects (from ufo/vue-router query parsing).
 */
function safeShouldHydrate(obj: unknown): boolean {
  try {
    return piniaShouldHydrate(obj)
  } catch (err) {
    if (
      err instanceof TypeError &&
      String((err as Error).message).includes('hasOwnProperty')
    ) {
      return true
    }
    throw err
  }
}

export default definePayloadPlugin(() => {
  definePayloadReducer(
    'skipHydrate',
    (data) => !safeShouldHydrate(data) && 1,
  )
  definePayloadReviver('skipHydrate', (_data) => undefined)
})
