<div align="center">

# 🎭 @typefirst/typist

[![npm version](https://img.shields.io/npm/v/@typefirst/typist?style=flat-square)](https://www.npmjs.com/package/@typefirst/typist)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](https://opensource.org/licenses/MIT)
[![Zero Runtime](https://img.shields.io/badge/Runtime-Zero-00d4aa?style=flat-square)](#features)
[![Bundle Size](https://img.shields.io/badge/Bundle-0kb-success?style=flat-square)](#features)

**A minimal, compositional, and debug-friendly suite of type-level utilities for TypeScript**

*Treats types as first-class values, leveraging the compiler's structural type system to encode symbolic verdicts, composable constraints, and static proofs.*

[Installation](#-installation) • [Quick Start](#-quick-start) • [API Reference](#-api-reference) • [Examples](#-examples)

</div>

---

## ✨ Features

- 🎭 **Phantom Types** – Represent symbolic or nominal values without runtime cost
- 🔍 **Type Assertions** – Test assignability, identity, and structure in-place  
- ⚖️ **Verdict Encoding** – Static error annotation, debugging, and type introspection
- 🧩 **Symbolic Inference** – Type comparison as first-class idioms
- 🚀 **Zero Runtime** – Pure compile-time type operations
- 📦 **ESM Ready** – Modern module system support
- 🎯 **IDE Friendly** – Rich IntelliSense and error reporting

## 📦 Installation

```bash
npm install @typefirst/typist
```

```bash
pnpm add @typefirst/typist
```

```bash
yarn add @typefirst/typist
```

> **Requirements:** TypeScript 4.9+ and Node.js 18+

## 🚀 Quick Start

```typescript
import { t, is_, $Equal, yes_, never_ } from '@typefirst/typist'

// Create phantom values for type manipulation
const user = t<{ name: string; age: number }>()

// Test type relationships
is_<string>(user.name)                    // ✓ Type assertion
yes_<$Equal<number, typeof user.age>>()   // ✓ Equality check  
never_<string & number>()                 // ✓ Impossibility proof
```

---

## 📚 API Reference

### 🎭 Phantom Types

Create "values" of types purely for type-checking without runtime overhead:

```typescript
import { t, type_ } from '@typefirst/typist'

type User = { name: string; id: number }
const phantom = t<User>()        // Phantom User value
const typed = type_<string>()    // Alternative syntax

// Use phantom values in type operations
is_<string>(phantom.name)        // ✓ Access properties for type checking
```

**Available operators:**
- `t<T>()` / `type_<T>()` – Create phantom type instance
- `assign_<T>(v)` – Assign with type constraint
- `widen_<T>(v)` – Widen to const assertion
- `specify_<T>()` – Create type specializer
- `force_<T>()` – Force type cast

### 🔍 Assertions

Essential static type-level assertion kit for unit tests and debugging:

```typescript
import { 
  is_, assignable_, has_, extends_, 
  never_, yes_, decidable_ 
} from '@typefirst/typist/assertions'

// Type compatibility checks
is_<string>("hello")                    // ✓ Direct assignment test
assignable_<number>(42)                 // ✓ Assignability test
has_<"name", string>({ name: "Alice" }) // ✓ Property existence check
extends_<"foo", string>()               // ✓ Subtype relationship
never_<string & number>()               // ✓ Impossibility proof

// Verdict assertions
yes_<$Equal<42, 42>>()                  // ✓ Assert positive verdict
decidable_<$Equal<string, number>>()    // ✓ Assert decidable comparison
```

### ⚖️ Verdicts

Symbolic markers for encoding static type comparison results:

```typescript
import type { $Yes, $No, $Maybe, $Verdict } from '@typefirst/typist/verdicts'

// Verdict types encode comparison results
type $Verdict = { $___verdict: boolean }

type $Yes = {
  $___verdict: true
  $___type_error: false 
}

type $No<Key extends string, Dump extends readonly any[] = []> = {
  $___verdict: false
  $___type_error: true
  $___type_error_key: Key
  $___dump: Dump
}

type $Maybe = $Verdict & ($Yes | $No<string>)
```

**Usage in comparisons:**
```typescript
type Success = $Equal<42, 42>          // → $Yes
type Failure = $Equal<string, number>  // → $No<"not-equal", [string, number]>
```

### 🧩 Comparators

Static binary type-level comparisons with rich error reporting:

```typescript
import type { $Extends, $Equal } from '@typefirst/typist/comparators'

// Structural subtype test
type $Extends<L, R> = [L] extends [R] 
  ? $Yes 
  : $No<'right-does-not-extend-left', [L, R]>

// Symmetric assignability (deep identity)  
type $Equal<T1, T2> = 
  ([T1] extends [T2] ? [T2] extends [T1] ? true : false : false) extends true
    ? $Yes 
    : $No<'not-equal', [T1, T2]>
```

**Examples:**
```typescript
type IsString = $Extends<"hello", string>        // → $Yes
type IsExact = $Equal<{ a: 1 }, { a: 1 }>        // → $Yes  
type NotEqual = $Equal<{ a: 1 }, { a: number }>  // → $No<"not-equal", [...]>
```

### 🧪 Test Blocks

Non-executing wrappers for static test blocks and symbolic validations:

```typescript
import { test_, example_, proof_ } from '@typefirst/typist/blocks'

test_('type equality checks', () => {
  yes_<$Equal<42, 42>>()
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

---

## 💡 Examples

### Path-based Object Access

```typescript
import { $Equal, is_, never_, t, test_, yes_ } from '@typefirst/typist'

type GetAtPath<Obj, Path extends readonly any[]> =
  Path extends readonly [infer Head, ...infer Tail]
    ? Head extends keyof Obj
      ? Tail extends readonly any[]
        ? GetAtPath<Obj[Head], Tail>
        : Obj[Head]
      : Obj extends readonly (infer Elem)[]
        ? GetAtPath<Elem, Path>
        : never
    : Obj

test_('path-based access validation', () => {
  type MyObj = { 
    foo: { bar: { baz: string }, qux: number }, 
    corge: boolean 
  }
  
  is_<GetAtPath<MyObj, ['foo', 'bar', 'baz']>>(t<string>()) 
  is_<GetAtPath<MyObj, ['foo', 'qux']>>(t<number>())
  is_<GetAtPath<MyObj, ['corge']>>(t<boolean>())
  yes_<$Equal<MyObj, GetAtPath<MyObj, []>>>()
  
  never_<GetAtPath<MyObj, ['foo', 'bar', 'nope']>>()
  never_<GetAtPath<MyObj, ['invalid']>>()
})
```

### Type-Safe Configuration Validation

```typescript
import { has_, extends_, yes_, $Equal } from '@typefirst/typist'

test_('configuration type validation', () => {
  type Config = {
    database: { host: string; port: number }
    cache: { enabled: boolean; ttl: number }
  }
  
  const config = t<Config>()
  
  has_<'database', Config['database']>(config)
  has_<'host', string>(config.database)
  extends_<number, typeof config.database.port>()
  yes_<$Equal<boolean, typeof config.cache.enabled>>()
})
```

---

## 🎯 Use Cases

- **📋 Type-Level Unit Testing** – Write comprehensive type tests alongside your code
- **🔍 Static Analysis** – Build compile-time validation and constraint systems  
- **📚 API Documentation** – Encode type relationships directly in your interfaces
- **🛡️ Type Safety** – Prove impossibility and enforce invariants at compile time
- **🔧 Library Development** – Create robust type-level APIs with rich error messages
- **🎓 Learning TypeScript** – Understand advanced type system concepts through examples

---

## 🏗️ Project Structure

```
packages/typist/
├── index.ts          # Main exports
├── assertions.ts     # Type assertion utilities  
├── comparators.ts    # Type comparison operations
├── verdicts.ts       # Verdict type definitions
├── operators.ts      # Phantom type operators
├── blocks.ts         # Test block utilities
├── phantom.ts        # Phantom type helpers
└── package.json      # Package configuration
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

MIT © [type-first](https://github.com/typefirst)

---

<div align="center">

**[⬆ Back to Top](#-type-firsttypist)**

Made with ❤️ by the [type-first](https://github.com/typefirst) team

</div>
