import { p_, check_,  flush_, is_ } from "../../src"

export interface $Lambda
  <I, K> 
  { input_: I, 
    key_: K,
    output_: unknown 
    (): this['output_'] }

export type $Apply
  <$L extends $Lambda<any, any>, I, K> =
  ($L & { input_: I, key_: K })['output_']

// --- example ---

type Input<A0, A1 extends number, A2 extends string> 
  = { a0: A0, a1: A1, a2: A2, hardcoded: '🔹' }

type Transform
  <I extends Input<any, number, string>, K extends string>
  = { id: `transformed:${K}`,
      hardcoded: I['hardcoded'],
      message: `${I['a2']} (a1:${I['a1']})` }

type IK = keyof Inputs
type Inputs = 
  { i0:Input<string, 1, 'hello'>,
    i1:Input<number, 2, 'world'>,
    i2:Input<boolean, 3, 'foo'> & { extra:'stuff' } }

check_ // ✅
 ({ actual: p_< Inputs >(),
    expected: 
    p_<{ i0: { a0:string, a1:1, a2:'hello', hardcoded:'🔹' }, 
        i1: { a0:number, a1:2, a2:'world', hardcoded:'🔹' },
        i2: { a0:boolean, a1:3, a2:'foo', hardcoded:'🔹', extra:'stuff' } }> () })

interface Transform$L 
  extends $Lambda<Inputs[IK], IK>
  { output_:Transform< this['input_'], this['key_'] > }

check_ // ✅
 ({ actual: 
      p_< $Apply< Transform$L, Inputs['i1'], 'i1' > >(),
    expected: 
    { id:'transformed:i1',
      hardcoded:'🔹',
      message:'world (a1:2)' } as const })

check_ // ✅
 ({ actual: 
      p_< $Apply< Transform$L, Inputs['i2'], 'i2' > >(),
    expected: 
    { id:'transformed:i2',
      hardcoded:'🔹',
      message:'foo (a1:3)' } as const })