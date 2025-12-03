# @typefirst/typist

A minimal, composable toolkit for writing **type-level code, tests, and proofs** in TypeScript. Typist provides phantom values, assertion helpers, and verdict types so you can describe and check relationships purely at compile time—without adding any runtime cost.

- **Zero runtime:** helpers erase at emit time and perform no runtime work.
- **Debuggable types:** verdicts carry messages and dumps to make compiler errors readable.
- **Composable primitives:** build your own constraints, comparators, and test blocks.
- **IDE-friendly:** signatures are small and designed to surface useful IntelliSense.

## Contents

- [Install](#install)
- [Quick start](#quick-start)
- [Concepts](#concepts)
  - [Phantom values](#phantom-values)
  - [Assertions](#assertions)
  - [Verdicts and comparators](#verdicts-and-comparators)
  - [Operators](#operators)
  - [Test blocks](#test-blocks)
- [Patterns and examples](#patterns-and-examples)
- [API reference](#api-reference)
- [Project layout](#project-layout)
- [Contributing](#contributing)
- [License](#license)

## Install

Typist is type-only and ships as an ESM module.

```bash
npm install @typefirst/typist
# or
pnpm add @typefirst/typist
yarn add @typefirst/typist
```

Requirements: TypeScript 4.9+ and Node.js 18+.

## Quick start

Use phantom values to work with types as if they were values, and assertions to make the compiler validate relationships.

```typescript
import { t_, is_, yes_, never_, $Equal } from '@typefirst/typist'

// Create a phantom value for type-only work
const user = t_< { name: string; age: number } >()

// Check assignability
is_<string>(user.name)          // compiles
// is_<number>(user.name)       // compiler error

// Encode decisions as verdicts
type NameIsString = $Equal<typeof user.name, string> // $Yes
type AgeIsString  = $Equal<typeof user.age, string>  // $No<'not-equal', [...]>

// Assert verdicts
yes_<NameIsString>()
never_<AgeIsString>() // fails if AgeIsString is not `never`
```

## Concepts

### Phantom values

Phantoms give you a value-shaped handle for any type without needing data at runtime.

```typescript
import { t_, type_, phantom_, force_ } from '@typefirst/typist'

const phantomUser = t_<User>()     // prefer t_ / type_ / phantom_ aliases
const forced = force_<42>()        // narrows a value unsafely; still no runtime work
```

All phantom constructors return their input cast to the requested type; they are intentionally no-ops at runtime.

### Assertions

Assertion helpers are tiny functions that exist only to inform the type checker. Each call either compiles or produces a readable compiler error.

```typescript
import { is_, assignable_, has_, extends_, instance_, never_, yes_, no_, assert_, check_ } from '@typefirst/typist/assertions'

is_<string>('hello')
assignable_<number>(42)
has_<'name', string>({ name: 'Ada' })
extends_<Array<any>, any[]>()
instance_<abstract new () => Date>()

// verdict assertions
yes_<$Equal<1, 1>>()                    // passes
no_<$No<'not-equal', [1, 2]>>()         // passes
assert_<true>()                         // accepts `true | $Yes`
check_({ expected: 'a' as const, actual: 'a' as const })
never_<string & number>()               // expects `never`
```

All helpers erase from output; they do not evaluate the values passed in.

### Verdicts and comparators

Verdicts are descriptive results of type comparisons. The built-in comparators return them so you get meaningful compiler feedback.

```typescript
import type { $Yes, $No, $Verdict } from '@typefirst/typist/verdicts'
import type { $Extends, $Equal } from '@typefirst/typist/comparators'

type OK = $Extends<'x', string>           // $Yes
type Nope = $Equal<{ a: 1 }, { a: 2 }>    // $No<'not-equal', [...]>

type $Extends<L, R> =
  [L] extends [R] ? $Yes : $No<'right-does-not-extend-left', [L, R]>

type $Equal<T1, T2> =
  ([T1] extends [T2] ? [T2] extends [T1] ? true : false : false) extends true
    ? $Yes
    : $No<'not-equal', [T1, T2]>
```

You can define your own comparators by returning `$Yes` or `$No`.

### Operators

Operators are small utilities for constructing or massaging types.

- `assign_ / a_ / as_ / widen_` – identity helpers for inference and const-widening.
- `like_ / common_` – unify two values to a common inferred type.
- `intersect_`, `union_` – create phantom intersections/unions.
- `any_ / __` – return a phantom `any`.
- `resolve_ / r_` with `_r<T>` – resolve readonly tuples/objects/functions to mutable shapes.
- `flush_ / f_` with `_f<T>` – deep version of `resolve_` (recursively flushes tuples/objects).

All return phantoms; none perform runtime logic.

### Test blocks

`test_`, `example_`, and `proof_` wrap type-level checks to keep scopes tidy while still returning typed values you can re-use.

```typescript
import { test_, example_, proof_ } from '@typefirst/typist/blocks'
import { yes_, never_, $Equal } from '@typefirst/typist'

test_('type equality', () => {
  yes_<$Equal<42, 42>>()
  never_<$Equal<string, number>>() // compiler error if not `never`
  never_<$Equal<string, number>>()
})

const myExample = example_('string literal behavior', () => {
  const str = 'hello' as const
  extends_<string, typeof str>() // 'hello' :< string
  // @ts-expect-error:✔︎ string !< 'hello'
  extends_<typeof str, string>()
  return str
})

proof_(() => {
  // Static proof that intersection with never is never
  never_<string & never>()
  never_<{ a: string } & never>()
})
```

## Patterns and examples

### Path-based access

From `examples/get-path.ts`, a type-safe object path helper backed by static checks:

```typescript
import { $Equal, is_, never_, t_, test_, yes_ } from '@typefirst/typist'

export type GetAtPath<Obj, Path extends readonly any[]> =
  Path extends readonly [infer Head, ...infer Tail]
    ? Head extends keyof Obj
      ? Tail extends readonly any[] ? GetAtPath<Obj[Head], Tail> : Obj[Head]
      : Obj extends readonly (infer Elem)[] ? GetAtPath<Elem, Path> : never
    : Obj

test_(() => {
  type Example = { foo: { bar: { baz: string }, qux: number }, corge: boolean }
  is_<GetAtPath<Example, ['foo', 'bar', 'baz']>>(t_<string>())
  yes_<$Equal<Example, GetAtPath<Example, []>>>()
  never_<GetAtPath<Example, ['foo', 'bar', 'missing']>>()
})
```

### Type-level testing workflow

Add `.ts` files that import typist helpers and run `npm test` (which runs `tsc --noEmit`). Any failed assertion surfaces as a TypeScript error. No runtime test runner is required.

```bash
npm run test
```

### Designing your own comparators

Return `$Yes` or `$No` from conditional types to encode rich error messages:

```typescript
import type { $Yes, $No } from '@typefirst/typist'

type $IsRecord<T> =
  T extends object ? $Yes : $No<'not-a-record', [T]>
```

## Documentation

### 📚 Core Documentation
- [API Reference](docs/api.md) – Complete API documentation with examples
- [Usage Guide](docs/guide.md) – In-depth patterns and best practices
- [Real-World Examples](docs/examples.md) – Practical usage scenarios

### 🚀 Getting Started
- [Migration Guide](docs/migration.md) – Migrate from runtime to type-level validation
- [FAQ](docs/faq.md) – Frequently asked questions and troubleshooting

### 🤝 Contributing
- [Contributing Guide](docs/contributing.md) – Development and contribution guidelines
- [Changelog](CHANGELOG.md) – Version history and breaking changes

## Examples

See the [examples directory](examples/) for complete working examples:

- [Path-based object access](examples/get-path.ts) – Type-safe deep property access

## Zero Runtime

All typist utilities are designed for compile-time use only. The library has **zero runtime overhead** – phantom types, assertions, and comparisons exist only during TypeScript compilation and are completely eliminated from the final JavaScript bundle.

```typescript
// This code:
const user = t_<{ name: string }>()
is_<string>(user.name)

// Compiles to:
// (empty - completely eliminated)
```

## Why typist?

- **Type-First Development**: Build with types as primary design artifacts
- **Static Verification**: Catch type errors at compile time with rich diagnostics
- **Zero Cost**: No runtime performance impact or bundle size increase
- **Composable**: Small, focused utilities that work together seamlessly
- **Debug-Friendly**: Clear error messages and IDE integration
- **Standards-Based**: Uses standard TypeScript features without experimental APIs

## License

MIT © [santiago-elustondo](https://github.com/santiago-elustondo)

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](docs/contributing.md) for guidelines.

---

**[View API Documentation](docs/api.md)** | **[See Examples](examples/)** | **[Read Guide](docs/guide.md)**
<div align="center">

**[⬆ Back to Top](#-type-firsttypist)**

Made with ❤️ by the [type-first](https://github.com/typefirst) team

</div>
