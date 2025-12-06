import { is_ } from '../../src'
import { __ } from '../../src/operators'
import type { $Lambda, $Apply } from './lambda-0'

// -------------------------------------------------------------
// Core digits and structural phone types (mirrors phone-0.ts)
// -------------------------------------------------------------

type Digit = '0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'
type TwoDigit = `${Digit}${Digit}`
type ThreeDigit = `${Digit}${Digit}${Digit}`
type FourDigit = `${Digit}${Digit}${Digit}${Digit}`

type PhoneNumber
  = string &
  { country:Digit|TwoDigit
    area:TwoDigit|ThreeDigit
    exchange:ThreeDigit|FourDigit
    line:FourDigit
    readonly ['$:phone']:unique symbol }

type NANPPhoneNumber
  = PhoneNumber &
  { country:'1'
    area:ThreeDigit
    exchange:ThreeDigit
    line:FourDigit
    readonly ['$:struct:nanp']:unique symbol }

type MexicanPhoneNumberTwoDigitAreaCode
  = PhoneNumber &
  { country:'52'
    area:TwoDigit
    exchange:FourDigit
    line:FourDigit
    readonly ['$:struct:mexico']:unique symbol }

type MexicanPhoneNumberThreeDigitAreaCode
  = PhoneNumber &
  { country:'52'
    area:ThreeDigit
    exchange:ThreeDigit
    line:FourDigit
    readonly ['$:struct:mexico']:unique symbol }

type MexicanPhoneNumber
  = MexicanPhoneNumberTwoDigitAreaCode
  | MexicanPhoneNumberThreeDigitAreaCode

type ValidTorontoAreaCode = '416'|'647'|'437'
type ValidMontrealAreaCode = '514'|'438'
type ValidCanadianAreaCode
  = ValidTorontoAreaCode|ValidMontrealAreaCode

type ValidNewYorkAreaCode = '212'|'315'|'518'|'646'|'718'|'917'
type ValidChicagoAreaCode = '312'|'773'|'872'
type ValidUSAAreaCode
  = ValidNewYorkAreaCode|ValidChicagoAreaCode

type ValidMexicoCityAreaCode = '55'
type ValidTijuanaAreaCode = '664'
type ValidMexicanAreaCode
  = ValidMexicoCityAreaCode|ValidTijuanaAreaCode

type ValidCanadianPhoneNumber
  = NANPPhoneNumber &
  { area:ValidCanadianAreaCode }

type ValidUSAPhoneNumber
  = NANPPhoneNumber &
  { area:ValidUSAAreaCode }

type ValidMexicanPhoneNumberTwoDigitAreaCode
  = MexicanPhoneNumber &
  { area:ValidMexicoCityAreaCode }

type ValidMexicanPhoneNumberThreeDigitAreaCode
  = MexicanPhoneNumber &
  { area:ValidTijuanaAreaCode }

type ValidPhoneNumber
  = PhoneNumber &
  ( ValidCanadianPhoneNumber
  | ValidUSAPhoneNumber
  | ValidMexicanPhoneNumberTwoDigitAreaCode
  | ValidMexicanPhoneNumberThreeDigitAreaCode )

// -------------------------------------------------------------
// Lambda: type-level transformer from pieces -> phone type
// -------------------------------------------------------------

type PhoneInput<C, A, E, L> =
  { country:C
    area:A
    exchange:E
    line:L }

// Classification of a structurally valid combination
// into the appropriate branded subtype.
type PhoneResult<
  C extends PhoneNumber['country'],
  A extends PhoneNumber['area'],
  E extends PhoneNumber['exchange'],
  L extends PhoneNumber['line']
> =
  // NANP branch
  C extends '1'
    ? A extends ThreeDigit
      ? E extends ThreeDigit
        ? A extends ValidCanadianAreaCode
          ? ValidCanadianPhoneNumber
          : A extends ValidUSAAreaCode
            ? ValidUSAPhoneNumber
            : NANPPhoneNumber
        : never
      : never
    // Mexico branch
    : C extends '52'
      ? A extends TwoDigit
        ? E extends FourDigit
          ? A extends ValidMexicoCityAreaCode
            ? ValidMexicanPhoneNumberTwoDigitAreaCode
            : MexicanPhoneNumberTwoDigitAreaCode
          : never
        : A extends ThreeDigit
          ? E extends ThreeDigit
            ? A extends ValidTijuanaAreaCode
              ? ValidMexicanPhoneNumberThreeDigitAreaCode
              : MexicanPhoneNumberThreeDigitAreaCode
            : never
          : never
      : never

// Lambda instance: given an input object with the four pieces,
// compute the corresponding phone type.
interface PhoneNumber$L
  extends $Lambda<PhoneInput<any, any, any, any>, never>
{
  output_:
    PhoneResult<
      this['input_']['country'],
      this['input_']['area'],
      this['input_']['exchange'],
      this['input_']['line']
    >
}

type $PhoneApply<
  C extends PhoneNumber['country'],
  A extends PhoneNumber['area'],
  E extends PhoneNumber['exchange'],
  L extends PhoneNumber['line']
> = $Apply<PhoneNumber$L, PhoneInput<C, A, E, L>, never>

// -------------------------------------------------------------
// Tuple gate: only structurally valid combinations are callable
// -------------------------------------------------------------

type PhoneTuple<
  C extends PhoneNumber['country'],
  A extends PhoneNumber['area'],
  E extends PhoneNumber['exchange'],
  L extends PhoneNumber['line']
> = [ C, A, E, L ]

// Only these structural combinations are permitted:
//
// - NANP:   +1 (AAA) XXX-XXXX
// - Mexico: +52 (AA) XXXX-XXXX
// - Mexico: +52 (AAA) XXX-XXXX
//
// Anything else collapses to `never`, so the call is rejected.
//
type PhoneArgs<
  C extends PhoneNumber['country'],
  A extends PhoneNumber['area'],
  E extends PhoneNumber['exchange'],
  L extends PhoneNumber['line']
> =
  C extends '1'
    ? A extends ThreeDigit
      ? E extends ThreeDigit
        ? PhoneTuple<C, A, E, L>
        : never
      : never
    : C extends '52'
      ? A extends TwoDigit
        ? E extends FourDigit
          ? PhoneTuple<C, A, E, L>
          : never
        : A extends ThreeDigit
          ? E extends ThreeDigit
            ? PhoneTuple<C, A, E, L>
            : never
          : never
    : never

// -------------------------------------------------------------
// Single, lambda-based constructor
// -------------------------------------------------------------

export function phoneNumber<
  C extends PhoneNumber['country'],
  A extends PhoneNumber['area'],
  E extends PhoneNumber['exchange'],
  L extends PhoneNumber['line']
>(...args: PhoneArgs<C, A, E, L>): $PhoneApply<C, A, E, L>
{
  const [ country, area, exchange, line ] = args
  return __(`+${country} (${area}) ${exchange}-${line}`) as any
}

// -------------------------------------------------------------
// Assertions: mirror phone-0.ts expectations
// -------------------------------------------------------------

// NANP, but not Canadian
const p1 = phoneNumber('1', '111', '555', '1234')
is_<NANPPhoneNumber>(p1)
// @ts-expect-error
is_<ValidCanadianPhoneNumber>(p1)

// Mexico +52, two-digit area, valid Mexico City area code
const p2 = phoneNumber('52', '55', '1234', '5678')
is_<MexicanPhoneNumberTwoDigitAreaCode>(p2)
is_<ValidMexicanPhoneNumberTwoDigitAreaCode>(p2)
// @ts-expect-error
is_<NANPPhoneNumber>(p2)

// NANP +1, Canadian area code
const p3 = phoneNumber('1', '416', '555', '6789')
is_<ValidCanadianPhoneNumber>(p3)
is_<NANPPhoneNumber>(p3)
// @ts-expect-error
is_<ValidUSAPhoneNumber>(p3)
// @ts-expect-error
is_<MexicanPhoneNumber>(p3)

// Structurally invalid combinations must be rejected:

// bad area length (4 digits) for NANP
// @ts-expect-error
const p4 = phoneNumber('1', '9995', '555', '1234')

// bad NANP/Mexico structural pairing: +52 with 3-digit area AND 4-digit exchange
// @ts-expect-error
const p5 = phoneNumber('52', '332', '1243', '5789')

// bad Mexico structural pairing: +52 with 2-digit area AND 3-digit exchange
// @ts-expect-error
const p6 = phoneNumber('52', '55', '123', '5678')
