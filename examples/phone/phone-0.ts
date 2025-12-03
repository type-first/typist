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
    readonly ['$:struct:mex:area-3']:unique symbol }

type MexicanPhoneNumber
  = ( MexicanPhoneNumberTwoDigitAreaCode
    | MexicanPhoneNumberThreeDigitAreaCode )
  & { readonly ['$:struct:mex']:unique symbol }

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
  = ( ValidMexicanPhoneNumberTwoDigitAreaCode
    | ValidMexicanPhoneNumberThreeDigitAreaCode )
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
  ( country:ValidUSAPhoneNumber['country'], 
    area:ValidUSAPhoneNumber['area'], 
    exchange:ValidUSAPhoneNumber['exchange'], 
    line:ValidUSAPhoneNumber['line'] ):ValidUSAPhoneNumber
function phoneNumber 
  ( country:ValidMexicanPhoneNumberTwoDigitAreaCode['country'], 
    area:ValidMexicanPhoneNumberTwoDigitAreaCode['area'], 
    exchange:ValidMexicanPhoneNumberTwoDigitAreaCode['exchange'], 
    line:ValidMexicanPhoneNumberTwoDigitAreaCode['line'] ):ValidMexicanPhoneNumber
function phoneNumber 
  ( country:ValidMexicanPhoneNumberThreeDigitAreaCode['country'], 
    area:ValidMexicanPhoneNumberThreeDigitAreaCode['area'], 
    exchange:ValidMexicanPhoneNumberThreeDigitAreaCode['exchange'], 
    line:ValidMexicanPhoneNumberThreeDigitAreaCode['line'] ):ValidMexicanPhoneNumber
function phoneNumber 
  ( country:NANPPhoneNumber['country'], 
    area:NANPPhoneNumber['area'], 
    exchange:NANPPhoneNumber['exchange'], 
    line:NANPPhoneNumber['line'] ):NANPPhoneNumber
function phoneNumber 
  ( country:MexicanPhoneNumberTwoDigitAreaCode['country'], 
    area:MexicanPhoneNumberTwoDigitAreaCode['area'], 
    exchange:MexicanPhoneNumberTwoDigitAreaCode['exchange'], 
    line:MexicanPhoneNumberTwoDigitAreaCode['line'] ):MexicanPhoneNumber
function phoneNumber 
  ( country:MexicanPhoneNumberThreeDigitAreaCode['country'], 
    area:MexicanPhoneNumberThreeDigitAreaCode['area'], 
    exchange:MexicanPhoneNumberThreeDigitAreaCode['exchange'], 
    line:MexicanPhoneNumberThreeDigitAreaCode['line'] ):MexicanPhoneNumber
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
is_<ValidMexicanPhoneNumber>(validMex)
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

// Test 100 phone numbers
const phone1 = phoneNumber('1', '416', '555', '0001')
const phone2 = phoneNumber('1', '647', '555', '0002')
const phone3 = phoneNumber('1', '437', '555', '0003')
const phone4 = phoneNumber('1', '514', '555', '0004')
const phone5 = phoneNumber('1', '438', '555', '0005')
const phone6 = phoneNumber('1', '212', '555', '0006')
const phone7 = phoneNumber('1', '315', '555', '0007')
const phone8 = phoneNumber('1', '518', '555', '0008')
const phone9 = phoneNumber('1', '646', '555', '0009')
const phone10 = phoneNumber('1', '718', '555', '0010')
const phone11 = phoneNumber('1', '917', '555', '0011')
const phone12 = phoneNumber('1', '312', '555', '0012')
const phone13 = phoneNumber('1', '773', '555', '0013')
const phone14 = phoneNumber('1', '872', '555', '0014')
const phone15 = phoneNumber('52', '55', '1234', '0015')
const phone16 = phoneNumber('52', '664', '123', '0016')
const phone17 = phoneNumber('1', '416', '678', '0017')
const phone18 = phoneNumber('1', '647', '890', '0018')
const phone19 = phoneNumber('1', '437', '123', '0019')
const phone20 = phoneNumber('1', '514', '456', '0020')
const phone21 = phoneNumber('1', '438', '789', '0021')
const phone22 = phoneNumber('1', '212', '012', '0022')
const phone23 = phoneNumber('1', '315', '345', '0023')
const phone24 = phoneNumber('1', '518', '678', '0024')
const phone25 = phoneNumber('1', '646', '901', '0025')
const phone26 = phoneNumber('1', '718', '234', '0026')
const phone27 = phoneNumber('1', '917', '567', '0027')
const phone28 = phoneNumber('1', '312', '890', '0028')
const phone29 = phoneNumber('1', '773', '123', '0029')
const phone30 = phoneNumber('1', '872', '456', '0030')
const phone31 = phoneNumber('52', '55', '7890', '0031')
const phone32 = phoneNumber('52', '664', '234', '0032')
const phone33 = phoneNumber('1', '416', '567', '0033')
const phone34 = phoneNumber('1', '647', '890', '0034')
const phone35 = phoneNumber('1', '437', '123', '0035')
const phone36 = phoneNumber('1', '514', '456', '0036')
const phone37 = phoneNumber('1', '438', '789', '0037')
const phone38 = phoneNumber('1', '212', '012', '0038')
const phone39 = phoneNumber('1', '315', '345', '0039')
const phone40 = phoneNumber('1', '518', '678', '0040')
const phone41 = phoneNumber('1', '646', '901', '0041')
const phone42 = phoneNumber('1', '718', '234', '0042')
const phone43 = phoneNumber('1', '917', '567', '0043')
const phone44 = phoneNumber('1', '312', '890', '0044')
const phone45 = phoneNumber('1', '773', '123', '0045')
const phone46 = phoneNumber('1', '872', '456', '0046')
const phone47 = phoneNumber('52', '55', '7890', '0047')
const phone48 = phoneNumber('52', '664', '234', '0048')
const phone49 = phoneNumber('1', '416', '111', '0049')
const phone50 = phoneNumber('1', '647', '222', '0050')
const phone51 = phoneNumber('1', '437', '333', '0051')
const phone52 = phoneNumber('1', '514', '444', '0052')
const phone53 = phoneNumber('1', '438', '555', '0053')
const phone54 = phoneNumber('1', '212', '666', '0054')
const phone55 = phoneNumber('1', '315', '777', '0055')
const phone56 = phoneNumber('1', '518', '888', '0056')
const phone57 = phoneNumber('1', '646', '999', '0057')
const phone58 = phoneNumber('1', '718', '000', '0058')
const phone59 = phoneNumber('1', '917', '101', '0059')
const phone60 = phoneNumber('1', '312', '202', '0060')
const phone61 = phoneNumber('1', '773', '303', '0061')
const phone62 = phoneNumber('1', '872', '404', '0062')
const phone63 = phoneNumber('52', '55', '5050', '0063')
const phone64 = phoneNumber('52', '664', '606', '0064')
const phone65 = phoneNumber('1', '416', '707', '0065')
const phone66 = phoneNumber('1', '647', '808', '0066')
const phone67 = phoneNumber('1', '437', '909', '0067')
const phone68 = phoneNumber('1', '514', '010', '0068')
const phone69 = phoneNumber('1', '438', '121', '0069')
const phone70 = phoneNumber('1', '212', '232', '0070')
const phone71 = phoneNumber('1', '315', '343', '0071')
const phone72 = phoneNumber('1', '518', '454', '0072')
const phone73 = phoneNumber('1', '646', '565', '0073')
const phone74 = phoneNumber('1', '718', '676', '0074')
const phone75 = phoneNumber('1', '917', '787', '0075')
const phone76 = phoneNumber('1', '312', '898', '0076')
const phone77 = phoneNumber('1', '773', '909', '0077')
const phone78 = phoneNumber('1', '872', '010', '0078')
const phone79 = phoneNumber('52', '55', '1212', '0079')
const phone80 = phoneNumber('52', '664', '343', '0080')
const phone81 = phoneNumber('1', '416', '454', '0081')
const phone82 = phoneNumber('1', '647', '565', '0082')
const phone83 = phoneNumber('1', '437', '676', '0083')
const phone84 = phoneNumber('1', '514', '787', '0084')
const phone85 = phoneNumber('1', '438', '898', '0085')
const phone86 = phoneNumber('1', '212', '909', '0086')
const phone87 = phoneNumber('1', '315', '010', '0087')
const phone88 = phoneNumber('1', '518', '121', '0088')
const phone89 = phoneNumber('1', '646', '232', '0089')
const phone90 = phoneNumber('1', '718', '343', '0090')
const phone91 = phoneNumber('1', '917', '454', '0091')
const phone92 = phoneNumber('1', '312', '565', '0092')
const phone93 = phoneNumber('1', '773', '676', '0093')
const phone94 = phoneNumber('1', '872', '787', '0094')
const phone95 = phoneNumber('52', '55', '8989', '0095')
const phone96 = phoneNumber('52', '664', '010', '0096')
const phone97 = phoneNumber('1', '416', '121', '0097')
const phone98 = phoneNumber('1', '647', '232', '0098')
const phone99 = phoneNumber('1', '437', '343', '0099')
const phone100 = phoneNumber('52', '55', '4545', '0100')

// Test sending SMS to all phone numbers
sendSms(phone1)
sendSms(phone2)
sendSms(phone3)
sendSms(phone4)
sendSms(phone5)
sendSms(phone6)
sendSms(phone7)
sendSms(phone8)
sendSms(phone9)
sendSms(phone10)
sendSms(phone11)
sendSms(phone12)
sendSms(phone13)
sendSms(phone14)
sendSms(phone15)
sendSms(phone16)
sendSms(phone17)
sendSms(phone18)
sendSms(phone19)
sendSms(phone20)
sendSms(phone21)
sendSms(phone22)
sendSms(phone23)
sendSms(phone24)
sendSms(phone25)
sendSms(phone26)
sendSms(phone27)
sendSms(phone28)
sendSms(phone29)
sendSms(phone30)
sendSms(phone31)
sendSms(phone32)
sendSms(phone33)
sendSms(phone34)
sendSms(phone35)
sendSms(phone36)
sendSms(phone37)
sendSms(phone38)
sendSms(phone39)
sendSms(phone40)
sendSms(phone41)
sendSms(phone42)
sendSms(phone43)
sendSms(phone44)
sendSms(phone45)
sendSms(phone46)
sendSms(phone47)
sendSms(phone48)
sendSms(phone49)
sendSms(phone50)
sendSms(phone51)
sendSms(phone52)
sendSms(phone53)
sendSms(phone54)
sendSms(phone55)
sendSms(phone56)
sendSms(phone57)
sendSms(phone58)
sendSms(phone59)
sendSms(phone60)
sendSms(phone61)
sendSms(phone62)
sendSms(phone63)
sendSms(phone64)
sendSms(phone65)
sendSms(phone66)
sendSms(phone67)
sendSms(phone68)
sendSms(phone69)
sendSms(phone70)
sendSms(phone71)
sendSms(phone72)
sendSms(phone73)
sendSms(phone74)
sendSms(phone75)
sendSms(phone76)
sendSms(phone77)
sendSms(phone78)
sendSms(phone79)
sendSms(phone80)
sendSms(phone81)
sendSms(phone82)
sendSms(phone83)
sendSms(phone84)
sendSms(phone85)
sendSms(phone86)
sendSms(phone87)
sendSms(phone88)
sendSms(phone89)
sendSms(phone90)
sendSms(phone91)
sendSms(phone92)
sendSms(phone93)
sendSms(phone94)
sendSms(phone95)
sendSms(phone96)
sendSms(phone97)
sendSms(phone98)
sendSms(phone99)
sendSms(phone100)

// Test specific function calls with valid phone numbers
sendValidCanadianSms(phone1) // Toronto
sendValidCanadianSms(phone2) // Toronto
sendValidCanadianSms(phone3) // Toronto
sendValidCanadianSms(phone4) // Montreal
sendValidCanadianSms(phone5) // Montreal

sendValidSms(phone6)  // New York
sendValidSms(phone7)  // New York
sendValidSms(phone8)  // New York
sendValidSms(phone9)  // New York
sendValidSms(phone10) // New York
sendValidSms(phone11) // New York
sendValidSms(phone12) // Chicago
sendValidSms(phone13) // Chicago
sendValidSms(phone14) // Chicago

sendValidMexicanSms(phone15) // Mexico City
sendValidMexicanSms(phone16) // Tijuana
