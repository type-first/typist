import { is_ } from '../src/assertions'

type v0_PhoneNumber 
  = `(${number}${number}${number}) ${number}${number}${number}-${number}${number}${number}${number}`

type v1_Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type v1_PhoneNumber
  // @ts-expect-error
  = `(${v1_Digit}${v1_Digit}${v1_Digit}) ${v1_Digit}${v1_Digit}${v1_Digit}-${v1_Digit}${v1_Digit}${v1_Digit}${v1_Digit}`

type v2_DigitNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
type v2_Digit<n extends v2_DigitNumber> = `${n}` & { brand:'digit' }
type v2_DigitPlaceholder = v2_Digit<any>
type v2_PhoneNumber
  = `(${v2_DigitPlaceholder}${v2_DigitPlaceholder}${v2_DigitPlaceholder}) ${v2_DigitPlaceholder}${v2_DigitPlaceholder}${v2_DigitPlaceholder}-${v2_DigitPlaceholder}${v2_DigitPlaceholder}${v2_DigitPlaceholder}${v2_DigitPlaceholder}`

const d 
  = <dn extends v2_DigitNumber>(n:dn):v2_Digit<dn> => 
  { const { abs, round } = Math
    const digit = abs(round(n)) % 9 
    return '' + digit as v2_Digit<dn> }

const d0 = d(0)
const d1 = d(1)
const d2 = d(2)
const d3 = d(3)

// @ts-expect-error
is_<v0_PhoneNumber>('hello')

// @ts-expect-error
is_<v0_PhoneNumber>('4166628602')

is_<v0_PhoneNumber>('(416) 662-8602') // ✓
is_<v0_PhoneNumber>('(434316) 1234662-8602') // x

// @ts-expect-error
is_<v2_PhoneNumber>('(416) 662-8602')
is_<v2_PhoneNumber>(`(${d0}${d1}${d2}) ${d0}${d1}${d2}-${d0}${d1}${d2}${d2}`)