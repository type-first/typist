import { $Yes, $No } from './verdicts'

; /* md */ `
## typist.assertions
* *essential static type-level assertion kit*.
* useful for writing static *type-level unit-tests*, *examples/demonstrations*, and *debugging*
`// ----

export const is_ = <T>(x:T) => {},
  assignable_ = is_
export const has_ = <const P extends string, const V = any>(x: {[k in P]: V }) => {}
export const extends_ = <E extends T,T>(y?:E, x?:T) => {}
export const instance_ = <T extends abstract new (...args:any[]) => any>(x?:InstanceType<T>) => {}
export const never_ = <T extends never>(x?:T) => {}
export const yes_ = <T extends $Yes>(t?:T) => {}
export const no_ = <T extends $No<any, any>>(t?:T) => {}
export const assert_ = <X extends true|$Yes>(x?:X) => {}
export const check_ = <T>(x:{ expected:T, actual:T }) => {}