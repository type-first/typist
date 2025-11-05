; /* md */ `
## typist.phantom
* *minimal phantom values*
* runtime-safe constructor to instantiate simple phantoms, an essential tool for *type-first programming*.
* the technique can be characterized as effectively *"lying to the compiler"* by abusing the \`as\` operator, 
  providing no value at all and instead using only the type information via the \`typeof\` operator.
* useful when building with generic types and complex inference logic, symbolic proofs and test harnesses where concrete values are not needed.
* allows you to pass pure types around using the same syntax as regular values.
`// ----

export const phantom_
  = <T>(x:unknown = null): T => x as T