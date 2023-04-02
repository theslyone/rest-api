import { Request } from 'express'

export type MockedT<T> = T & {
  [K in keyof T]: T[K] extends (...args: Array<any>) => any
  ? jest.Mock<ReturnType<T[K]>, Parameters<T[K]>> & T[K]
  : T[K]
}

export const excludeValues = [
  'then',
  'asymmetricMatch',
  Symbol.toStringTag,
  Symbol.iterator,
]

export const mockOf = <T extends object>(
  obj: Partial<T> = {},
  excludes = excludeValues,
  constructor: { prototype: object } | undefined = undefined
): MockedT<T> =>
  new Proxy(obj, {
    get: (target, property, ...rest) => {
      const cachedValue = Reflect.get(target, property, ...rest)
      if (
        cachedValue !== undefined ||
        excludes.find((excluded) => excluded === property)
      ) {
        return cachedValue
      }
      const newMock = jest.fn()
      Reflect.set(target, property, newMock)
      return newMock
    },
    getPrototypeOf: constructor ? () => constructor.prototype : undefined,
    set: (target, property, value, receiver) =>
      Reflect.set(target, property, value, receiver),
  }) as MockedT<T>

export const mockRequest = (target: Partial<Request> = {}) =>
  mockOf<Request>({ ...target }, [
    ...excludeValues,
    'body',
    'params',
    'query',
  ])
