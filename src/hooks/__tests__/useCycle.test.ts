import { act, renderHook } from '@testing-library/react-hooks'
import useCycle from '../useCycle'

test('initial value', () => {
  const { result } = renderHook(() => useCycle([1, 2, 3, 4], 1))
  expect(result.current[0]).toBe(2)
})

test('cycling next', () => {
  const { result } = renderHook(() => useCycle([1, 2, 3, 4]))
  expect(result.current[0]).toBe(1)
  act(() => result.current[1]())
  expect(result.current[0]).toBe(2)
  act(() => result.current[1]())
  expect(result.current[0]).toBe(3)
  act(() => result.current[1]())
  expect(result.current[0]).toBe(4)
  act(() => result.current[1]())
  expect(result.current[0]).toBe(1)
})

test('cycling previous', () => {
  const { result } = renderHook(() => useCycle([1, 2, 3, 4]))
  expect(result.current[0]).toBe(1)
  act(() => result.current[2]())
  expect(result.current[0]).toBe(4)
  act(() => result.current[2]())
  expect(result.current[0]).toBe(3)
  act(() => result.current[2]())
  expect(result.current[0]).toBe(2)
  act(() => result.current[2]())
  expect(result.current[0]).toBe(1)
})
