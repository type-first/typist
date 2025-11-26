import { t_ } from './operators'

; /* md */ `
## typist.blocks
* minimal test harness for symbolic examples.
* encode phantom evaluations used to verify type-level behavior.
* function closure avoids pollution and interference, while
  returned type gets passed through, so we can import it 
  and build upon it in our downstream tests.
`// ----

type F<T> = (a:any) => T
type S = string
export function example_<T>( fn:F<T> ):T
export function example_<T>( label:S, fn:F<T> ):T
export function example_<T>( ..._args:( [S, F<T>] | [F<T>] ) ): T 
  { return t_<T>() }
export const test_ = example_
export const proof_ = example_