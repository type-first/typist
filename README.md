# Typist: Primitive Type-First Utilities

*Show what your types are made of*

Typist is a collection of small, focused utilities for type-level debugging and static validation in TypeScript.

It enables:
* Compiler-enforced static assertions
* Phantom operators for flexible type transportation and inference logic
* Recursive and conditional type inspection techniques with customizable diagnostic type-level metadata
* Type materialization utilities for resolving complex inferred types
* Block-based grouping for type-level test suites

### Essential Primitives for Type-First Development

Typist exists to support a type‑first approach to software development: leveraging the compiler as an active analytical tool, enforcing architectural constraints, validating domain models, and enabling precise, inference‑driven workflows. This can significantly **strengthen code generation capability**.

### Zero Cost

Typist has no dependencies, virtually zero runtime overhead, and bundles less than 1KB gzipped and uglified.

## API Reference

### Assertions

Assertions are compile-time guarantees.
Each is a function that returns `void` and causes a TypeScript error if its condition is false.

#### `is_<Type>(thing)`

Asserts that `thing` is assignable to `Type`.

Alias: `assignable_`

```ts
const timestamp = Date.now()

is_<number>(timestamp)

// @ts-expect-error
is_<string>(timestamp)
```

#### `has_<Key, Value?>(thing)`

Asserts that `thing` has a property `Key`, optionally with value type `Value`.

```ts
const person = { name:'ponyboy', age:15 }

has_<'age'>(person)
has_<'name', string>(person)

// @ts-expect-error
has_<"email">(person)
```

#### `extends_<A, B>()`

Asserts that `A extends B`.

```ts
type User = { email:string, admin:boolean }
type AdminUser = User & { admin:true }

extends_<AdminUser, User>()

const user
  = { email:'ponyboycurtis67@hotmail.com', 
      admin:false } as const

extends_<typeof user, User>()

// @ts-expect-error
extends_<typeof user, AdminUser>()
```

#### `instance_<Ctor>(value)`

Asserts that `value` is an instance of constructor type `Ctor`.

```ts
class Dog {}
class Cat {}

const dog = new Dog()

instance_<Dog>(dog)

// @ts-expect-error
instance_<Cat>(dog)
```

#### `never_<T>()`

Asserts that a type resolves to `never`.

```ts
type Impossible = Extract<'a', 'b'>

never_<Impossible>()

// @ts-expect-error
never_<string>()
```

### Verdict Assertions

These consume `$Verdict` result types (`$Yes` or `$No`).

Generic verdict types allow us to write maximally complex evaluative logic beyond what is possible using only standalone assertion functions, such as conditional recursion. We can test for conditions like strict equality (bidirectional assignability).

* `yes_` — requires `$Yes`
* `no_` — requires `$No`
* `assert_` — requires `$Yes` **or** `true`

```ts
yes_<$Equal<'✌️', '✌️'>>

no_<$Equal<'✌️', string>>

yes_<$Extends<'✌️', string>>

// @ts-expect-error
yes_<$Extends<string, ✌️>>
```

### Verdicts

Verdicts represent explicit yes/no results with diagnostic metadata. You can perform maximally complex type evaluations using recursive conditional logic by writing generic verdict types that resolve to `$Yes` or `$No`.

#### `$Yes`

Indicates success.

#### `$No<Message, Dump>`

Captures metadata at failure path. This is the type-level version of throwing a runtime error with `{ message, data }`.

* `message: string`
* `dump: readonly any[]`

### Verdict Utilities

Commonly useful verdict utility types that ship out-of-the-box: `$Equal<A, B>`, `$Extends<A, B>`

### Phantom Values

A phantom value is a nominal runtime value used solely to **transport type information**. 

#### `phantom_<T>(value?)`

Creates a value with type `T`.
The argument `value` is optional, ignored by the compiler, but retained at runtime if you supply it.

Alias: `p_`, `type_`, `t_`, `force_`

```ts
type Person = { name:string; age:number }

const person_ = phantom_<Person>()

is_<Person>(person_)

// @ts-expect-error
is_<string>(person_)
```

### Operators

Operators return phantom values. They manipulate or capture type identity.

#### `assign_<T>(value)`

Returns the provided value as type `T`, enforcing that the original value type is assignable to `T`. Used to safely widen types to be less specific while preserving runtime value.

Alias: `as_`, `widen_`

```ts
const narrow = 'hello'

is_<'hello'>(narrow)

const wide = assign_<string>(literal)

is_<string>(wide)

// @ts-expect-error
is_<'hello'>(wide)
```

#### `nope_(value?)`

Produces a phantom typed as `never`, preserving runtime value.

```ts
const neverFoo = nope_('foo')
```

#### `any_(value?)`

Produces a phantom typed as `any`, preserving runtime value.

Alias: `__`

```ts
const anyBar = any_('bar')
```

#### `resolve_<T>(value?)`

Returns an expanded representation of `T`, resolving its property names. This expansion is *semantically equivalent* to the original (mutually assignable), but easier to inspect.

Aliases: `r_`

`_r<T>` is the type version of `resolve_`, which we can use with type definitions.

```ts
type Expanded = _r<Original>
```

#### `flush_<T>(value?)`

Recursive version of `resolve_`. Expands nested structures while remaining equivalent to the original type.

Aliases: `f_`

`_r<T>` is the type version of `resolve_`, which we can use with type definitions.

```ts
type Deep = _f<ComplexType>;
```


### Blocks

Blocks provide scope to prevent pollution. The type and runtime value returned by `fn` is passed through. This is the type version of a `describe()` block in a runtime assertion library.

#### `example_(label?, fn)`

Runs `fn`, allows assertions inside it, and returns the type of the final expression.

Aliases: `test_`, `proof_`.

```ts
const exampleUser
  = example_('user', () => 
    { const user = createUser('bob')
      is_<User>(user)
      has_<'id'>(user)
      return user } )
```