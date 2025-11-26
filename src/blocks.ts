import { t_ } from './operators'

type F<T> = (a:any) => T
type S = string
export function example_<T>( fn:F<T> ):T
export function example_<T>( label:S, fn:F<T> ):T
export function example_<T>( ..._args:( [S, F<T>] | [F<T>] ) ): T 
  { return t_<T>() }
export const test_ = example_
export const proof_ = example_