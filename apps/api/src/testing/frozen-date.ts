import { vi } from 'vitest'

const DAY_THE_DATA_DESCRIBES = new Date('2026-10-20T15:00:00Z')

export function freezeDate(day: Date = DAY_THE_DATA_DESCRIBES): void {
  vi.useFakeTimers({ toFake: ['Date'], now: day })
}

export function unfreezeDate(): void {
  vi.useRealTimers()
}
