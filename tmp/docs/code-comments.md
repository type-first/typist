## typist.assertions
* *essential static type-level assertion kit*.
* useful for writing static *type-level unit-tests*, *examples/demonstrations*, and *debugging*

## typist.blocks
* minimal test harness for symbolic examples.
* encode phantom evaluations used to verify type-level behavior.
* function closure avoids pollution and interference, while
  returned type/value gets passed through, so we can import it 
  and build upon it in our downstream tests.

## typist.comparators
* *comparator types* for decidable evaluations*
* they resolve to verdicts.
* you can write your own by writing conditional types that return verdicts

## typist.operators
* return phantoms, sometimes with values.

### phantom_
* *minimal phantom values*
* runtime-safe constructor to instantiate simple phantoms, an essential tool for *type-first programming*.
* the technique can be characterized as effectively *"lying to the compiler"* by abusing the \`as\` operator, 
  providing no value at all and instead using only the type information via the \`typeof\` operator.
* useful when building with generic types and complex inference logic, symbolic proofs and test harnesses where concrete values are not needed.
* allows you to pass pure types around using the same syntax as regular values.
* optional value of any kind can be passed in, sometimes useful (example: being able to log something when you dump to terminal)