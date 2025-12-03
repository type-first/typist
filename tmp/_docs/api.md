# API Reference

Complete reference for all @typefirst/typist utilities.

## Table of Contents

- [Operators](#operators) - Phantom type creation and manipulation
- [Assertions](#assertions) - Type relationship testing
- [Comparators](#comparators) - Symbolic type comparisons
- [Verdicts](#verdicts) - Type comparison result encoding
- [Blocks](#blocks) - Test organization utilities

---

## Operators

Type creation and manipulation utilities that work with phantom types.

### `t_<T>()` / `type_<T>()` / `phantom_<T>()`

Creates a phantom value of type `T` without any runtime cost.

```typescript
import { t_, type_, phantom_ } from '@typefirst/typist'

const user = t_<{ name: string; age: number }>()
const str = type_<string>()
const num = phantom_<42>()

// Access properties for type checking
is_<string>(user.name)
is_<number>(user.age)
```

**Aliases**: `p_<T>()` (short form)

**Parameters**:
- `x?: unknown` - Optional value to associate (ignored at runtime)

**Returns**: `T` (phantom value)

**Use Cases**:
- Creating type instances for testing
- Type manipulation and transformation
- Generic type instantiation

### `assign_<T>(value)`

Assigns a value with type constraint, ensuring the value is assignable to `T`.

```typescript
import { assign_ } from '@typefirst/typist'

const str = assign_<string>('hello')        // ✓ string literal → string
const num = assign_<number>(42)             // ✓ number literal → number  
// const invalid = assign_<string>(123)     // ❌ Type error
```

**Aliases**: `a_<T>()`, `as_<T>()`, `widen_<T>()`

**Parameters**:
- `v: T` - Value that must be assignable to T

**Returns**: `T` (the input value, type-constrained)

### `like_<T>(x, y)`

Creates a value representing the common type of two expressions.

```typescript
import { like_, common_ } from '@typefirst/typist'

const result = like_(42, 'hello')           // Type: string | number
const shared = common_('a', 'b')            // Type: string
```

**Aliases**: `common_<T>()`

**Parameters**:
- `x: T` - First value
- `y: T` - Second value  

**Returns**: `T` (phantom value of common type)

### `intersect_<T0, T1>()`

Creates a phantom value representing the intersection of two types.

```typescript
import { intersect_ } from '@typefirst/typist'

type A = { name: string }
type B = { age: number }
const combined = intersect_<A, B>()         // Type: A & B

is_<string>(combined.name)
is_<number>(combined.age)
```

**Parameters**:
- `v0?: T0` - Optional first type instance
- `v1?: T1` - Optional second type instance

**Returns**: `T0 & T1` (intersection type)

### `union_<T0, T1>()`

Creates a phantom value representing the union of two types.

```typescript
import { union_ } from '@typefirst/typist'

const either = union_<string, number>()    // Type: string | number
```

**Parameters**:
- `v0?: T0` - Optional first type instance
- `v1?: T1` - Optional second type instance

**Returns**: `T0 | T1` (union type)

### `any_()`

Creates an `any` typed value.

```typescript
import { any_, __ } from '@typefirst/typist'

const anything = any_()                     // Type: any
const wildcard = __()                       // Short alias
```

**Aliases**: `__()` (short form)

**Returns**: `any`

### `resolve_<T>()` / `r_<T>()`

Resolves complex types to their simplified forms.

```typescript
import { resolve_, r_ } from '@typefirst/typist'

type Complex = Promise<{ items: string[] }>
const resolved = r_<Complex>()
// Simplifies nested structures for better readability
```

**Type Resolution Rules**:
- Functions: preserved as-is
- Tuples: mapped to indexed object types
- Arrays: simplified to `Array<T[number]>`
- Objects: property types recursively resolved
- Primitives: unchanged

### `flush_<T>()` / `f_<T>()`

Recursively flushes and normalizes type structures.

```typescript
import { flush_, f_ } from '@typefirst/typist'

type Nested = { data: { items: readonly string[] } }
const flushed = f_<Nested>()
// Deep normalization of readonly/mutable variants
```

**Similar to `resolve_`** but with deeper recursive processing.

### `force_<T>()`

Force-casts a value to type `T` (unsafe operation).

```typescript
import { force_ } from '@typefirst/typist'

const forced = force_<string>(123)         // Type: string (unsafe!)
// Use sparingly - bypasses type safety
```

**⚠️ Warning**: This performs unsafe type casting. Use only when necessary and you're certain about type compatibility.

---

## Assertions

Functions for testing type relationships and constraints statically.

### `is_<T>(value)`

Tests whether a value is assignable to type `T`.

```typescript
import { is_ } from '@typefirst/typist/assertions'

is_<string>('hello')                        // ✓ Passes
is_<number>(42)                             // ✓ Passes
// is_<string>(123)                         // ❌ Type error
```

**Aliases**: `assignable_<T>()`

**Parameters**:
- `x: T` - Value that must be assignable to T

**Returns**: `{}` (empty object, only used for type checking)

### `has_<Property, Type>(object)`

Tests whether an object has a property of a specific type.

```typescript
import { has_ } from '@typefirst/typist/assertions'

has_<'name', string>({ name: 'Alice' })    // ✓ Object has string property 'name'
has_<'age', number>({ age: 30 })           // ✓ Object has number property 'age'
// has_<'id', string>({ id: 123 })         // ❌ Property exists but wrong type
```

**Parameters**:
- `x: { [k in Property]: Type }` - Object with required property

**Returns**: `{}` (empty object, only used for type checking)

### `extends_<Subtype, Supertype>()`

Tests whether one type extends (is assignable to) another.

```typescript
import { extends_ } from '@typefirst/typist/assertions'

extends_<'hello', string>()                 // ✓ String literal extends string
extends_<number, number | string>()        // ✓ Number extends union
// extends_<string, number>()               // ❌ String does not extend number
```

**Parameters**:
- `y?: Subtype` - The subtype (optional)
- `x?: Supertype` - The supertype (optional)

**Returns**: `{}` (empty object, only used for type checking)

### `instance_<Constructor>(value)`

Tests whether a value is an instance of a constructor type.

```typescript
import { instance_ } from '@typefirst/typist/assertions'

class User { name!: string }
const user = new User()

instance_<typeof User>(user)               // ✓ Instance check passes
// instance_<typeof User>({ name: 'fake' }) // ❌ Not actual instance
```

**Parameters**:
- `x?: InstanceType<T>` - Instance to check

**Returns**: `{}` (empty object, only used for type checking)

### `never_<T>()`

Asserts that type `T` is `never` (impossible/empty type).

```typescript
import { never_ } from '@typefirst/typist/assertions'

never_<string & number>()                  // ✓ Intersection is never
never_<'a' & 'b'>()                        // ✓ Incompatible literals
// never_<string>()                         // ❌ String is not never
```

**Parameters**:
- `x?: T` - Value that must be of type `never`

**Returns**: `{}` (empty object, only used for type checking)

### `yes_<Verdict>()`

Asserts that a verdict type is positive (`$Yes`).

```typescript
import { yes_ } from '@typefirst/typist/assertions'\nimport { $Equal } from '@typefirst/typist/comparators'\n\nyes_<$Equal<string, string>>()             // ✓ Types are equal\nyes_<$Equal<42, 42>>()                     // ✓ Literals are equal\n// yes_<$Equal<string, number>>()           // ❌ Types not equal\n```

**Parameters**:
- `t?: T` - Verdict that must be `$Yes`

**Returns**: `{}` (empty object, only used for type checking)

### `no_<Verdict>()`

Asserts that a verdict type is negative (`$No`).

```typescript
import { no_ } from '@typefirst/typist/assertions'\nimport { $Equal } from '@typefirst/typist/comparators'\n\nno_<$Equal<string, number>>()              // ✓ Types are not equal\n// no_<$Equal<string, string>>()            // ❌ Types are actually equal\n```

**Parameters**:
- `t?: T` - Verdict that must be `$No<...>`

**Returns**: `{}` (empty object, only used for type checking)

### `assert_<Condition>()`

General assertion that requires a condition to be `true` or `$Yes`.

```typescript
import { assert_ } from '@typefirst/typist/assertions'\n\nassert_<true>()                            // ✓ Boolean literal\nassert_<$Yes>()                            // ✓ Positive verdict\n// assert_<false>()                         // ❌ Condition is false\n```

**Parameters**:
- `x?: X` - Condition that must be `true` or `$Yes`

**Returns**: `{}` (empty object, only used for type checking)

### `check_<T>(comparison)`

Validates that expected and actual types match.

```typescript
import { check_ } from '@typefirst/typist/assertions'\n\ncheck_<string>({ expected: 'hello' as string, actual: 'world' as string })\n// Both sides must be assignable to T\n```

**Parameters**:
- `x: { expected: T, actual: T }` - Object with expected and actual values

**Returns**: `{}` (empty object, only used for type checking)

---

## Comparators

Symbolic type comparisons that return verdict types.

### `$Equal<T1, T2>`

Tests whether two types are structurally equal (mutual assignability).

```typescript
import { $Equal } from '@typefirst/typist/comparators'\n\ntype Same = $Equal<string, string>          // → $Yes\ntype Different = $Equal<string, number>     // → $No<'not-equal', [string, number]>\ntype Objects = $Equal<{a: 1}, {a: 1}>       // → $Yes\n```

**Algorithm**: Checks if `[T1] extends [T2]` and `[T2] extends [T1]`

**Returns**: 
- `$Yes` if types are equal
- `$No<'not-equal', [T1, T2]>` if types differ

### `$Extends<Left, Right>`

Tests whether the left type extends (is assignable to) the right type.

```typescript
import { $Extends } from '@typefirst/typist/comparators'\n\ntype Sub = $Extends<'hello', string>        // → $Yes\ntype Super = $Extends<string, 'hello'>      // → $No<'right-does-not-extend-left', [string, 'hello']>\ntype Union = $Extends<string, string | number> // → $Yes\n```

**Algorithm**: Checks if `[Left] extends [Right]`

**Returns**:
- `$Yes` if left extends right  
- `$No<'right-does-not-extend-left', [Left, Right]>` if not

---

## Verdicts

Type-level result encoding for comparisons and operations.

### `$Verdict`

Base type for all verdict types.

```typescript
type $Verdict = {
  $___verdict: boolean
}\n```

**Properties**:
- `$___verdict: boolean` - Whether the verdict is positive

### `$Yes`

Represents a successful/positive result.

```typescript
type $Yes = {
  $___verdict: true
}\n```

**Usage**: Returned by successful type comparisons

### `$No<Message, Dump>`

Represents a failed/negative result with error information.

```typescript
type $No<Msg extends string, Dump extends readonly any[] = []> = {
  $___verdict: false
  $___message: Msg 
  $___dump: Dump
}\n```

**Type Parameters**:
- `Msg` - Error message describing the failure
- `Dump` - Additional type information for debugging

**Properties**:
- `$___verdict: false` - Indicates failure
- `$___message: Msg` - Human-readable error message
- `$___dump: Dump` - Array of relevant types for debugging

**Common Messages**:
- `'not-equal'` - Types are not structurally equal
- `'right-does-not-extend-left'` - Subtype relationship failed

---

## Blocks

Utilities for organizing and structuring type-level tests and examples.

### `test_<T>(fn)` 

Creates a named test block for type-level validations.

```typescript
import { test_ } from '@typefirst/typist/blocks'\n\ntest_('user type validation', () => {\n  type User = { name: string; id: number }\n  const user = t_<User>()\n  \n  is_<string>(user.name)\n  is_<number>(user.id)\n  yes_<$Equal<User, typeof user>>()\n})\n```

**Overloads**:
- `test_<T>(fn: () => T): T` - Anonymous test
- `test_<T>(label: string, fn: () => T): T` - Named test

**Parameters**:
- `label?: string` - Optional test description
- `fn: () => T` - Test function containing assertions

**Returns**: `T` (the return type of the test function)

### `example_<T>(fn)`

Creates an example block that demonstrates type behavior.

```typescript
import { example_ } from '@typefirst/typist/blocks'\n\nconst userExample = example_('creating users', () => {\n  const user = { name: 'Alice', age: 30 }\n  is_<string>(user.name)\n  return user\n})\n// userExample has the inferred type from the function\n```

**Overloads**: Same as `test_`

**Use Cases**:
- Documentation examples
- Type behavior demonstrations  
- Reusable type construction patterns

### `proof_<T>(fn)`

Creates a proof block for demonstrating type-level invariants.

```typescript
import { proof_ } from '@typefirst/typist/blocks'\n\nproof_(() => {\n  // Prove mathematical properties of types\n  never_<string & never>()              // Intersection with never is never\n  yes_<$Equal<keyof {}, never>>()       // Empty object has no keys\n  yes_<$Equal<never[], never>>()        // Array of never is never\n})\n```

**Use Cases**:
- Mathematical proofs about type system\n- Demonstrating type-level theorems\n- Validating type system assumptions

---

## Import Paths

The library provides multiple import strategies:

### Main Entry Point
```typescript\nimport { t_, is_, $Equal, yes_ } from '@typefirst/typist'\n```

### Submodule Imports  
```typescript\nimport { is_, never_, extends_ } from '@typefirst/typist/assertions'\nimport { $Equal, $Extends } from '@typefirst/typist/comparators'\nimport { $Yes, $No } from '@typefirst/typist/verdicts'\nimport { phantom_, assign_ } from '@typefirst/typist/operators'\nimport { test_, example_ } from '@typefirst/typist/blocks'\n```

### Barrel Exports
All utilities are also available through the main entry point for convenience.

---

## Type Safety Notes

1. **Compile-Time Only**: All utilities are eliminated during compilation
2. **Zero Runtime**: No performance impact on final JavaScript
3. **Type Errors**: Failed assertions show as TypeScript errors
4. **IDE Integration**: Full IntelliSense support with error details
5. **Gradual Adoption**: Use only what you need, mix with regular TypeScript

---

## Performance Considerations

- **Compilation Speed**: Complex type operations may slow TypeScript compilation
- **Error Messages**: Deep type failures can generate verbose error messages  
- **Memory Usage**: Extensive use may increase TypeScript memory consumption
- **Best Practices**: Use judiciously in hot code paths during development

For more information, see the [Performance Guide](guide.md#performance).