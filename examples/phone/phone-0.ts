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

// 100 more examples
const p101 = phoneNumber('1', '416', '123', '4567')
const p102 = phoneNumber('1', '647', '234', '5678')
const p103 = phoneNumber('1', '437', '345', '6789')
const p104 = phoneNumber('1', '514', '456', '7890')
const p105 = phoneNumber('1', '438', '567', '8901')
const p106 = phoneNumber('1', '212', '678', '9012')
const p107 = phoneNumber('1', '315', '789', '0123')
const p108 = phoneNumber('1', '518', '890', '1234')
const p109 = phoneNumber('1', '646', '901', '2345')
const p110 = phoneNumber('1', '718', '012', '3456')
const p111 = phoneNumber('1', '917', '123', '4567')
const p112 = phoneNumber('1', '312', '234', '5678')
const p113 = phoneNumber('1', '773', '345', '6789')
const p114 = phoneNumber('1', '872', '456', '7890')
const p115 = phoneNumber('52', '55', '1234', '5678')
const p116 = phoneNumber('52', '664', '123', '6789')
const p117 = phoneNumber('1', '416', '999', '0000')
const p118 = phoneNumber('52', '55', '9999', '1111')
const p119 = phoneNumber('1', '212', '555', '0001')
const p120 = phoneNumber('52', '664', '555', '0002')

// Valid phone number tests
sendValidCanadianSms(p101)
sendValidCanadianSms(p102)
sendValidCanadianSms(p103)
sendValidCanadianSms(p104)
sendValidCanadianSms(p105)
sendValidSms(p101)
sendValidSms(p102)
sendValidSms(p115)
sendValidSms(p116)

// NANP phone number tests
sendNanpSms(p106)
sendNanpSms(p107)
sendNanpSms(p108)
sendNanpSms(p109)
sendNanpSms(p110)
sendNanpSms(p111)
sendNanpSms(p112)
sendNanpSms(p113)
sendNanpSms(p114)
sendNanpSms(p117)

// Mexican phone number tests
sendMexSms(p115)
sendMexSms(p116)
sendValidMexicanSms(p115)
sendValidMexicanSms(p116)

// More complex examples with different patterns
const toronto1 = phoneNumber('1', '416', '123', '4567')
const toronto2 = phoneNumber('1', '647', '987', '6543')
const montreal1 = phoneNumber('1', '514', '111', '2222')
const montreal2 = phoneNumber('1', '438', '333', '4444')
const newYork1 = phoneNumber('1', '212', '555', '1212')
const newYork2 = phoneNumber('1', '646', '789', '0123')
const chicago1 = phoneNumber('1', '312', '456', '7890')
const chicago2 = phoneNumber('1', '773', '234', '5678')
const mexicoCity1 = phoneNumber('52', '55', '1234', '5678')
const tijuana1 = phoneNumber('52', '664', '987', '5432')

// Type assertions for verification
is_<ValidCanadianPhoneNumber>(toronto1)
is_<ValidCanadianPhoneNumber>(toronto2)
is_<ValidCanadianPhoneNumber>(montreal1)
is_<ValidCanadianPhoneNumber>(montreal2)
is_<ValidMexicanPhoneNumber>(mexicoCity1)
is_<ValidMexicanPhoneNumber>(tijuana1)

// Sending messages to different regions
sendValidCanadianSms(toronto1)
sendValidCanadianSms(toronto2)
sendValidCanadianSms(montreal1)
sendValidCanadianSms(montreal2)
sendValidMexicanSms(mexicoCity1)
sendValidMexicanSms(tijuana1)

// Additional phone number variations
const p121 = phoneNumber('1', '416', '000', '0000')
const p122 = phoneNumber('1', '647', '111', '1111')
const p123 = phoneNumber('1', '437', '222', '2222')
const p124 = phoneNumber('1', '514', '333', '3333')
const p125 = phoneNumber('1', '438', '444', '4444')
const p126 = phoneNumber('1', '212', '555', '5555')
const p127 = phoneNumber('1', '315', '666', '6666')
const p128 = phoneNumber('1', '518', '777', '7777')
const p129 = phoneNumber('1', '646', '888', '8888')
const p130 = phoneNumber('1', '718', '999', '9999')
const p131 = phoneNumber('1', '917', '000', '1111')
const p132 = phoneNumber('1', '312', '111', '2222')
const p133 = phoneNumber('1', '773', '222', '3333')
const p134 = phoneNumber('1', '872', '333', '4444')
const p135 = phoneNumber('52', '55', '0000', '1111')
const p136 = phoneNumber('52', '664', '111', '2222')

// Generic phone number tests (no validation)
sendSms(p121)
sendSms(p122)
sendSms(p123)
sendSms(p124)
sendSms(p125)
sendSms(p126)
sendSms(p127)
sendSms(p128)
sendSms(p129)
sendSms(p130)
sendSms(p131)
sendSms(p132)
sendSms(p133)
sendSms(p134)
sendSms(p135)
sendSms(p136)
