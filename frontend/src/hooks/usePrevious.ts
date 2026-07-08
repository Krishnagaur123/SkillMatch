import { useState } from 'react'

export function usePrevious<T>(value: T): T | undefined {
  const [state, setState] = useState<{ current: T; previous?: T }>({
    current: value,
  })

  if (value !== state.current) {
    setState({
      current: value,
      previous: state.current,
    })
  }

  return state.previous
}
