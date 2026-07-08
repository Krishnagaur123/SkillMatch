import { useState, useCallback } from 'react'

export function useBoolean(initialState = false) {
  const [value, setValue] = useState(initialState)

  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])
  const toggle = useCallback(() => setValue((prev) => !prev), [])

  return [value, { setTrue, setFalse, toggle, setValue }] as const
}
