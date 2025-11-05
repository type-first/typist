import { $Yes, $No, $Maybe } from './verdicts'

; /* md */ `
## typist.assertions
* *essential static type-level assertion kit*.
* useful for writing static *type-level unit-tests*, *examples/demonstrations*, and *debugging*
`// ----

export const is_ = <T>(x:T) => {}
export const assignable_ = is_
export const has_ = <const P extends string, const V = any>(x: {[k in P]: V }) => {}
export const extends_ = <E extends T,T>(y?:E, x?:T) => {}
export const instance_ = <T extends abstract new (...args:any[]) => any>(x?:InstanceType<T>) => {}
export const never_ = <T extends never>(x?: T): never => x as never
export const decidable_ = <T extends $Maybe>(t?:T) => {}
export const yes_ = <T extends $Yes>(t?:T) => true
export const no_ = <T extends $No<any, any>>(t?:T) => {}
