
export const type_
  = <T>(v:unknown = null): T => v as T, 
t_ = type_, t = t_ 

export const assign_
  = <T>(v:T): T => v as T,
a_ = assign_, a = a_

export const widen_
  = <const T>(v:T) => t_<T>(v),
w_ = widen_, w = w_

export const specify_
  = <T>(v?:T) => <E extends T>(e_?:E) => t_<E>(v),
s_ = specify_, s = s_

export const intersect_
  = <T0, T1>(v0:T0, v1:T1) => t_<T0 & T1>()

export const force_
  = <T>(v:unknown = null) => t_<T>(v),
f_ = force_, f = f_

export const any_
  = (v:any = null) => t_<any>(v),
__ = any_