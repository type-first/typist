import { $No, $Yes } from './verdicts'

; /* md */ `
## typist.comparators
* *comparator types* for decidable evaluations*
* they resolve to [assertives](#typist-assertives).
`// ----

export type $Extends
  < L, R > =
  [ L ] extends [ R ] ? $Yes 
  : $No<'right-does-not-extend-left', [L,R]>

export type $Equal
  < T1, T2 > = 
  ( [T1] extends [T2] ? 
    [T2] extends [T1] ? 
    true : false : false ) extends true ? $Yes 
  : $No<'not-equal', [T1,T2]>