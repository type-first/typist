export type $Verdict
  = { $___verdict: boolean  }

export type $Yes
  = { $___verdict: true }

export type $No
  < Msg extends string, Dump extends readonly any[] = []> = 
  { $___verdict: false
    $___message: Msg 
    $___dump:Dump }

// ---

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