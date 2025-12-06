export function toDisplayText(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) {
    return fallback
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  if (typeof value === 'boolean') {
    return value ? '是' : '否'
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => toDisplayText(item, ''))
      .filter((item) => item && item.trim().length > 0)

    return parts.length > 0 ? parts.join('、') : fallback
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const candidateKeys = ['text', 'name', 'title', 'label', 'value', 'description', 'content']

    for (const key of candidateKeys) {
      if (obj[key] !== undefined) {
        const candidate = toDisplayText(obj[key], '')
        if (candidate) {
          return candidate
        }
      }
    }

    try {
      return JSON.stringify(obj)
    } catch {
      return fallback
    }
  }

  return fallback
}

export function toNumberValue(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/[^\d.-]/g, ''))
    if (!Number.isNaN(parsed)) {
      return parsed
    }
  }

  return undefined
}
