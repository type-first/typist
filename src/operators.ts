export const phantom_
  = <T>(x:unknown = null): T => x as T, 
p_ = phantom_,
type_ = phantom_, 
t_ = phantom_,
force_ = phantom_

export const assign_
  = <T>(v:T): T => v,
as_ = assign_,
widen_ = assign_

export const intersect_
  = <T0, T1>(v0?:T0, v1?:T1) => t_<T0 & T1>()

export const union_
  = <T0, T1>(v0?:T0, v1?:T1) => t_<T0 | T1>()

export const nope_
  = (v:unknown) => t_<never>(v)

export const any_
  = (v:unknown) => t_<any>(v),
__ = any_

export const resolve_ 
  = <T>(x_?:T) => x_ as _r<T>,
r_ = resolve_
export type _r<T> 
  = T extends (...args: any[]) => any ? T 
  : T extends readonly [any, ...any[]] ? { [K in keyof T]: T[K] }
  : T extends readonly any[] ? Array<T[number]>
  : T extends object ? { [K in keyof T]: T[K] } : T

export const flush_
  = <T>(x_?:T) => x_ as _f<T>,
f_ = flush_
export type _f<T> 
  = T extends (...args: any[]) => any ? T
    : T extends readonly [any, ...any[]] ? { [K in keyof T]: _f<T[K]> }
    : T extends readonly any[] ? Array<_f<T[number]>>
    : T extends object ? { [K in keyof T]: _f<T[K]> } : T 