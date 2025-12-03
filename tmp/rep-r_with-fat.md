# Typist: Practical Type-First Utilities for TypeScript

> Show what your types are made of

Typist is a collection of small, focused utilities for compile-time validation in TypeScript.

It enables:
* Static assertions that must compile or fail
* Phantom values for transporting type identity
* Structural and relational checks via verdict types
* Type materialization utilities for debugging complex inference
* Block-based grouping for type-level test suites

### Essential Primitives for Type-First Development

Typist exists to support a type‑first approach to software development: leveraging the compiler as an active analytical tool, enforcing architectural constraints, validating domain models, and enabling precise, inference‑driven workflows. This can significantly strengthen code generation capabilities.

Check out [The Type‑First Revolution](`/articles/type-first-revolution`) to learn more about type-first development.

### Zero Cost

Typist has no dependencies, virtually zero runtime overhead, and bundles less than 1KB gzipped and uglified.

### Live Demos

Explore code examples in a *live compiler environment*. 
Browse our example [TypeScapes](`/typescapes`). 

### Applied Case Studies

* [Expressively Typed Phone Numbers](`articles/expressively-typed-phone-numbers`)
* [Isomorphic Server Actions Architecture](`articles/isomorphic-server-actions-arch`)

## API Functional Groups

### 1. Assertions

Assertions are compile-time guarantees.
Each is a function that returns `void` and causes a TypeScript error if its condition is false.

See [Assertions](`/typist/docs/assertions`).

#### `is_<T>(value)`

Asserts that `value` is assignable to `T`.

Signature:

```ts
function is_<T>(value: T): void;
```

Examples (explicit type vs inferred type):

```ts
// explicit type argument
is_<number>(123);      // ok

// @ts-expect-error
is_<string>(123);

// inferred via typeof
declare const value: number | string;
is_<typeof value>(value); // ok when value is compatible
```

Aliases: `assignable_`.

---

### `has_<Key, Value = any>(value)`

Asserts that a type has a property `Key`, optionally with value type `Value`.

Signature:

```ts
function has_<Key extends PropertyKey, Value = any>(value: { [K in Key]: Value }): void;
```

Examples (explicit key/value vs inferred from phantom):

```ts
type Person = { name: string; age: number };
const person_ = phantom_<Person>();

// explicit key and value type
has_<"name", string>(person_);

// key only, value inferred from Person["age"]
has_<"age">(person_);

// @ts-expect-error
has_<"email">(person_);
```

---

### `extends_<A, B>()`

Asserts that `A extends B`.

Signature:

```ts
function extends_<A, B>(): void;
```

Examples (pure types):

```ts
extends_<"a", string>(); // ok

// @ts-expect-error
extends_<123, string>();

// using typeof and phantoms
const user_ = phantom_<User>();
extends_<typeof user_, User>();
```

---

### `instance_<Ctor>(value)`

Asserts that `value` is an instance of constructor type `Ctor`.

Signature:

```ts
function instance_<Ctor extends new (...args: any[]) => any>(value: InstanceType<Ctor>): void;
```

Examples (explicit constructor and inferred value):

```ts
class Dog {}
class Cat {}

const dog = new Dog();

instance_<Dog>(dog);        // ok
instance_<typeof Dog>(dog); // also valid

// @ts-expect-error
instance_<Cat>(dog);
```

---

### `never_<T>()`

Asserts that a type resolves to `never`.

Signature:

```ts
function never_<T>(): void;
```

Examples (pure types and derived types):

```ts
type Impossible = Extract<"a", "b">; // never

never_<Impossible>(); // ok

// @ts-expect-error
never_<string>();
```

---

### `satisfies_<Expected, Actual>(options)`

Asserts that `Actual` extends `Expected`.

Signature:

```ts
function satisfies_<Expected, Actual>(options: {
  expected: Expected;
  actual: Actual;
}): void;
```

Examples (pure types via phantoms and inferred types):

```ts
type Expected = { id: string };
type Actual   = { id: string; name?: string };

satisfies_({
  expected: phantom_<Expected>(),
  actual:   phantom_<Actual>(),
});

// using typeof to tie to a real value
const user = { id: "1", name: "Ada" } as const;

satisfies_<Expected, typeof user>({
  expected: phantom_<Expected>(),
  actual:   user,
});
```

Aliases: `check_`.

---

### Verdict Assertions: `yes_`, `no_`, `assert_`

These consume verdict types.

Signatures:

```ts
function yes_<V extends $Verdict>(): void;    // V must be $Yes
function no_<V extends $Verdict>(): void;     // V must be $No
function assert_<V extends $Verdict | boolean>(): void; // V must be $Yes or true
```

* `yes_` — requires `$Yes`
* `no_` — requires `$No`
* `assert_` — requires `$Yes` **or** boolean `true`

Examples:

```ts
yes_<$Extends<"a", string>>();

// @ts-expect-error
yes_<$Extends<"a", number>>();

no_<$Extends<"a", number>>();

// @ts-expect-error
no_<$Extends<"a", string>>();

assert_<true>();
assert_<$Equal<"a", "a">>();
```

---

## 2. Phantom Values

*For extended reference and examples, see: `/docs/phantoms` on the website.*

A phantom value is a nominal runtime value used solely to **transport type information**.

### `phantom_<T>(value?)`

Creates a value with type `T`.
The argument `value` is optional, ignored by the compiler, and retained only at runtime if you supply it.

Signature:

```ts
function phantom_<T>(value?: unknown): T;
```

Examples (pure type and inferred type):

```ts
// pure type
const user_ = phantom_<User>();

// inferred from a concrete value
const raw = { id: "1", name: "Ada" };
const projected_ = phantom_<typeof raw>();

const debugged_ = phantom_<User>({ label: "example" });
```

Aliases: `p_`, `type_`, `t_`, `force_`.

---

## 3. Operators

*For the full operator reference, extended examples, and deeper explanations, see: `/docs/operators`.*

Operators return values (unlike assertions). They manipulate or carry type identity.

### `assign_<T>(value)`

Returns the provided value, enforcing that it is assignable to `T`. Used to safely widen literal inference.

Signature:

```ts
function assign_<T>(value: T): T;
```

Aliases: `as_`, `widen_`.

Examples (literal widening):

```ts
const literal = "hello" as const;

// widen to a broader union type
const x = assign_<string | number>(literal);
```

---

### `like_<T>(a, b)`

Returns a phantom of the **common inferred type** of `a` and `b`. Typist lets TypeScript infer a single `T` that both arguments conform to ("best common type"), and `like_` gives you a phantom of that `T`.

Aliases: `common_`.

Signature:

```ts
function like_<T>(a: T, b: T): T;
```

Examples (inferring and extracting the common type):

```ts
const rick = { age:65, pickle:true }
const morty = { age:14, girlfriend:null }

const person_ = like_(p1, p2)
```

---

### `intersect_<A, B>()`

Produces a phantom of type `A & B`.

Signature:

```ts
function intersect_<A, B>(): A & B;
```

Examples (pure types):

```ts
const ab_ = intersect_<A, B>();
```

---

### `union_<A, B>()`

Produces a phantom of type `A | B`.

Signature:

```ts
function union_<A, B>(): A | B;
```

Examples (pure types):

```ts
const u_ = union_<A, B>();
```

---

### `any_(value?)`

Produces a phantom typed as `any`.

Signature:

```ts
function any_(value?: unknown): any;
```

Aliases: `__`.

Examples:

```ts
const anything_ = any_("foo");
const wildcard_ = __();
```

---

### `resolve_<T>(value?)`

Creates a value of an **expanded** presentation of `T`. This expansion is *semantically equivalent* to the original (mutually assignable), but easier to inspect.

Signature:

```ts
function resolve_<T>(value?: T): T;
```

Function aliases: `r_`.
Type aliases: `_r<T>`.

Examples (type-only usage):

```ts
type Expanded = _r<Original>;
```

---

### `flush_<T>(value?)`

Recursive version of `resolve_`. Expands nested structures while remaining equivalent to the original type.

Signature:

```ts
function flush_<T>(value?: T): T;
```

Function aliases: `f_`.
Type aliases: `_f<T>`.

Examples (type-only usage):

```ts
type Deep = _f<ComplexType>;
```

Key guarantee:

> `_r<T>` and `_f<T>` are *equivalent* to `T`.
> They change visibility, not meaning.

---

## 4. Verdict Types

*For verdict theory, design rationale, and extended diagnostics examples, visit: `/docs/verdicts`.*

Verdicts represent explicit yes/no results with diagnostic metadata.

### `$Verdict`

Base discriminant template.

### `$Yes`

Indicates success.

### `$No<Message, Dump>`

Indicates failure; includes:

* `message: string`
* `dump: readonly any[]`

### `$Extends<A, B>`

Returns `$Yes` or `$No` for subtype direction.

### `$Equal<A, B>`

Returns `$Yes` if mutually assignable, `$No` otherwise.

Hovering them in your editor reveals detailed reasoning.

---

## 5. Blocks

*For block patterns, multi-file examples, and guidance on structuring type-level test suites, see: `/docs/blocks`.*

Blocks group type-level checks.
They behave similarly to `describe()` or test fixtures, but at compile time.

### `example_(label?, fn)`

Runs `fn`, allows assertions inside it, and returns the type of the final expression.

Aliases: `test_`, `proof_`.

Signature:

```ts
function example_<T>(label: string, fn: () => T): T;
function example_<T>(fn: () => T): T;
```

Examples (pure type fixture vs inferred type):

```ts
const userExample = example_("user", () => {
  const u_ = phantom_<User>();
  is_<User>(u_);
  return u_;
});

const valueExample = example_(() => {
  const x = { id: "1" as const };
  is_<{ id: string }>(x);
  return x;
});
```

---

## 6. Related Tools

Overlap exists with:

* `tsd`
* `dtslint`
* `conditional-type-checks`
* Native `@ts-expect-error`

Typist differs by providing **inline**, no-tooling primitives that mesh directly with ordinary TypeScript code and type-level logic.

---

## Further Reading

* **Type-First Development Overview:** `/guides/type-first`
* **Typist Concepts & Philosophy:** `/guides/typist-concepts`
* **Demonstrations (“Typescapes”):** `/examples/*`
* **Case Studies:** e.g. Phone Number Types — `/articles/phone-numbers`

## Summary

Typist provides:

* Static assertions
* Phantom-based type transport
* Verdict types for structured diagnostics
* Materialization tools for type introspection
* Safe widening, intersection, union operators
* Block structures for grouped type-level tests

It does not replace TypeScript’s type system—it simply gives you the precision tools to work directly with it.
