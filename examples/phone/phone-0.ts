import { is_ } from '../../src'
import { __, assign_ } from '../../src/operators'

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
    readonly ['$:struct:mex:area-2']:unique symbol }

type MexicanPhoneNumberThreeDigitAreaCode
  = PhoneNumber &
  { country:'52'
    area:ThreeDigit
    exchange:ThreeDigit
    line:FourDigit
    readonly ['$:struct:mex:area-2']:unique symbol }

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
  
type Valid
  = { readonly ['$:valid']:unique symbol }

type ValidCanadianPhoneNumber 
  = NANPPhoneNumber & Valid
  & { area:ValidCanadianAreaCode }
  & { readonly ['$:cad']:unique symbol }

type ValidUSAPhoneNumber 
  = NANPPhoneNumber & Valid
  & { area:ValidUSAAreaCode }
  & { readonly ['$:usa']:unique symbol }

type ValidNANPPhoneNumber
  = ( ValidCanadianPhoneNumber
    | ValidUSAPhoneNumber )
  & { readonly ['$:nanp']:unique symbol }

type ValidMexicanPhoneNumberTwoDigitAreaCode
  = MexicanPhoneNumber & Valid
  & { area:ValidMexicoCityAreaCode }
  & { readonly ['$:mex:area-2']:unique symbol }

type ValidMexicanPhoneNumberThreeDigitAreaCode
  = MexicanPhoneNumber & Valid
  & { area:ValidTijuanaAreaCode }
  & { readonly ['$:mex:area-3']:unique symbol }

type ValidMexicanPhoneNumber
  = ValidMexicanPhoneNumberTwoDigitAreaCode
  | ValidMexicanPhoneNumberThreeDigitAreaCode
  & { readonly ['$:mex']:unique symbol }

type ValidPhoneNumber
  = ( ValidCanadianPhoneNumber
    | ValidUSAPhoneNumber
    | ValidMexicanPhoneNumber ) 

function phoneNumber 
  ( country:ValidCanadianPhoneNumber['country'], 
    area:ValidCanadianPhoneNumber['area'], 
    exchange:ValidCanadianPhoneNumber['exchange'], 
    line:ValidCanadianPhoneNumber['line'] ):ValidCanadianPhoneNumber
function phoneNumber 
  ( country:ValidCanadianPhoneNumber['country'], 
    area:ValidCanadianPhoneNumber['area'], 
    exchange:ValidCanadianPhoneNumber['exchange'], 
    line:ValidCanadianPhoneNumber['line'] ):ValidUSAPhoneNumber
function phoneNumber 
  ( country:ValidMexicanPhoneNumberTwoDigitAreaCode['country'], 
    area:ValidMexicanPhoneNumberTwoDigitAreaCode['area'], 
    exchange:ValidMexicanPhoneNumberTwoDigitAreaCode['exchange'], 
    line:ValidMexicanPhoneNumberTwoDigitAreaCode['line'] ):ValidMexicanPhoneNumberTwoDigitAreaCode
function phoneNumber 
  ( country:ValidMexicanPhoneNumberThreeDigitAreaCode['country'], 
    area:ValidMexicanPhoneNumberThreeDigitAreaCode['area'], 
    exchange:ValidMexicanPhoneNumberThreeDigitAreaCode['exchange'], 
    line:ValidMexicanPhoneNumberThreeDigitAreaCode['line'] ):ValidMexicanPhoneNumberThreeDigitAreaCode
function phoneNumber 
  ( country:NANPPhoneNumber['country'], 
    area:NANPPhoneNumber['area'], 
    exchange:NANPPhoneNumber['exchange'], 
    line:NANPPhoneNumber['line'] ):NANPPhoneNumber
function phoneNumber 
  ( country:MexicanPhoneNumberTwoDigitAreaCode['country'], 
    area:MexicanPhoneNumberTwoDigitAreaCode['area'], 
    exchange:MexicanPhoneNumberTwoDigitAreaCode['exchange'], 
    line:MexicanPhoneNumberTwoDigitAreaCode['line'] ):MexicanPhoneNumberTwoDigitAreaCode
function phoneNumber 
  ( country:MexicanPhoneNumberThreeDigitAreaCode['country'], 
    area:MexicanPhoneNumberThreeDigitAreaCode['area'], 
    exchange:MexicanPhoneNumberThreeDigitAreaCode['exchange'], 
    line:MexicanPhoneNumberThreeDigitAreaCode['line'] ):MexicanPhoneNumberThreeDigitAreaCode
function phoneNumber 
  ( country:PhoneNumber['country'], 
    area:PhoneNumber['area'], 
    exchange:PhoneNumber['exchange'], 
    line:PhoneNumber['line'] ):PhoneNumber
    { return __(`+${country} (${area}) ${exchange}-${line}`) }

const nanp = phoneNumber('1', '111', '555', '1234')
is_<NANPPhoneNumber>(nanp)
// @ts-expect-error
is_<ValidCanadianPhoneNumber>(nanp)

const validMex = phoneNumber('52', '55', '1234', '5678')
is_<MexicanPhoneNumber>(validMex)
is_<ValidMexicanPhoneNumber>(validMex)
is_<ValidMexicanPhoneNumberTwoDigitAreaCode>(validMex)
// @ts-expect-error
is_<NANPPhoneNumber>(validMex)

const validCad = phoneNumber('1', '416', '555', '6789')
is_<NANPPhoneNumber>(validCad)
is_<ValidCanadianPhoneNumber>(validCad)
// @ts-expect-error
is_<ValidUSAPhoneNumber>(validCad)
// @ts-expect-error
is_<MexicanPhoneNumber>(validCad)

// @ts-expect-error
const p4 = phoneNumber('1', '9995', '555', '1234')
// @ts-expect-error
const p5 = phoneNumber('52', '332', '1243', '5789')
// @ts-expect-error
const p6 = phoneNumber('52', '55', '123', '5678')

async function sendSms(to:PhoneNumber) { /* ... */ }
async function sendNanpSms(to:NANPPhoneNumber) { /* ... */ }
async function sendMexSms(to:MexicanPhoneNumber)  { /* ... */ }
async function sendValidSms(to:ValidPhoneNumber) { /* ... */ }
async function sendValidCanadianSms(to:ValidCanadianPhoneNumber) { /* ... */ }
async function sendValidMexicanSms(to:ValidMexicanPhoneNumber)  { /* ... */ }

sendSms(nanp)
sendSms(validMex)
sendSms(validCad)

sendNanpSms(nanp)
// @ts-expect-error
sendNanpSms(validMex)
sendNanpSms(validCad)

// @ts-expect-error
sendMexSms(nanp)
sendMexSms(validMex)
// @ts-expect-error
sendMexSms(validCad)

// @ts-expect-error
sendValidSms(nanp)
sendValidSms(validMex)
sendValidSms(validCad)

// @ts-expect-error
sendValidCanadianSms(nanp)
// @ts-expect-error
sendValidCanadianSms(validMex)
sendValidCanadianSms(validCad)

// @ts-expect-error
sendValidMexicanSms(nanp)
sendValidMexicanSms(validMex)
// @ts-expect-error
sendValidMexicanSms(validCad)

// final

sendMexSms(phoneNumber('52', '664', '123', '4567'))
