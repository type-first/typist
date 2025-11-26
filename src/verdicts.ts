export type $Verdict
  = { $___verdict: boolean  }

export type $Yes
  = { $___verdict: true }

export type $No
  < Msg extends string, Dump extends readonly any[] = []> = 
  { $___verdict: false
    $___message: Msg 
    $___dump:Dump }