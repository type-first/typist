; /* md */ `
## typist.verdicts
* \`$Yes\` / \`$No\` / \`$Undecidable\`
`// ----

export type $Verdict
  = { $___verdict: boolean  }

export type $Yes
  = { $___verdict: true
      $___type_error: false }

export type $No
  < Key extends string, Dump extends readonly any[] = []> = 
  { $___dump:Dump
    $___verdict: false
    $___type_error: true
    $___type_error_key: Key }

export type $Maybe
  = $Verdict & ( $Yes | $No<string> )