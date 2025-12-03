# Typist: Practical Type-First Utilities for TypeScript

Typist is a collection of small, focused utilities for **compile-time type verification** in TypeScript.  
It enables:

- Static assertions that must compile or fail  
- Phantom values for transporting type identity  
- Structural and relational tests via verdict types  
- Type materialization utilities for debugging complex inference  
- Block-based grouping for organized type-level test suites  

All exports end in `_` to indicate that they operate in the “type-first” domain.

---

## 1. Assertions

Assertions are compile-time guarantees.  
Each is a function that returns `void` and causes a TypeScript error if its condition is false.

### `is_<T>(value)`
Asserts that `value` is assignable to `T`.

```ts
is_<number>(123);      // ok
is_<string>("hello");  // ok

// @ts-expect-error
is_<string>(123);
````

Alias: `assignable_`.

---

### `has_<Key, Value = any>(value)`

Asserts that a type has a property `Key`, optionally with value type `Value`.

```ts
has_<"name">(person_);
has_<"age", number>(person_);

// @ts-expect-error
has_<"email">(person_);
```

---

### `extends_<A, B>()`

Asserts that `A extends B`.

```ts
extends_<"a", string>(); // ok

// @ts-expect-error
extends_<123, string>();
```

---

### `instance_<Ctor>(value)`

Asserts that `value` is an instance of constructor type `Ctor`.

```ts
instance_<Dog>(new Dog());

// @ts-expect-error
instance_<Cat>(new Dog());
```

---

### `never_<T>()`

Asserts that a type resolves to `never`.

```ts
never_<never>();      // ok

// @ts-expect-error
never_<string>();
```

---

### `satisfies_<Expected, Actual>(options)`

Asserts that `Actual` extends `Expected`.

```ts
satisfies_({
  expected: phantom_<Expected>(),
  actual:   phantom_<Actual>(),
});
```

Alias: `check_`.

Aliases applied consistently:
Every alias is listed explicitly under its canonical name; no special treatment.

---

### Verdict Assertions: `yes_`, `no_`, `assert_`

These consume verdict types.

* `yes_` — requires `$Yes`
* `no_` — requires `$No`
* `assert_` — requires `$Yes` **or** boolean `true`

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

A phantom value is a nominal runtime value used solely to **transport type information**.

### `phantom_<T>(value?)`

Creates a value with type `T`.
The argument `value` is optional, ignored by the compiler, and retained only at runtime if you supply it.

```ts
const user_ = phantom_<User>();
const debugged_ = phantom_<User>({ label: "example" });
```

Standard aliases:

* `p_`
* `type_`
* `t_`
* `force_`

All aliasing is 1:1 and handled uniformly.

---

## 3. Operators

Operators return values (unlike assertions). They manipulate or carry type identity.

### `assign_<T>(value)`

### `as_<T>(value)`

### `widen_<T>(value)`

All three names refer to the same primitive:

* Returns the provided value
* Enforces that it is assignable to `T`
* Used to safely widen literal inference

```ts
const x = assign_<string | number>("hello");
```

---

### `like_<T>(a, b)` and `common_<T>(a, b)`

Return a phantom of type `T`.
Useful when anchoring multiple values to one inferred type.

```ts
const person_ = like_<Person>(p1, p2);
```

---

### `intersect_<A, B>()`

Produces a phantom of type `A & B`.

```ts
const ab_ = intersect_<A, B>();
```

---

### `union_<A, B>()`

Produces a phantom of type `A | B`.

```ts
const u_ = union_<A, B>();
```

---

### `any_(value?)` and `__`

Produce a phantom typed as `any`.

```ts
const anything_ = any_("foo");
const wildcard_ = __();
```

Aliases follow the same convention: canonical → alias table.

---

### `resolve_<T>(value?)`, `r_`, `_r`

Creates a value of an **expanded** presentation of `T`.
This expansion is *semantically equivalent* to the original (mutually assignable), but easier to inspect.

```ts
type Expanded = _r<Original>;
```

---

### `flush_<T>(value?)`, `f_`, `_f`

Recursive version of `resolve_`.
Expands nested structures while remaining equivalent to the original type.

```ts
type Deep = _f<ComplexType>;
```

Key guarantee:

> `_r<T>` and `_f<T>` are *equivalent* to `T`.
> They change visibility, not meaning.

---

## 4. Verdict Types

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

Blocks group type-level checks.
They behave similarly to `describe()` or test fixtures, but at compile time.

### `example_(label?, fn)`

Runs `fn`, allows assertions inside it, and returns the type of the final expression.

Aliases: `test_`, `proof_`.

```ts
const userExample = example_("user", () => {
  const u_ = phantom_<User>();
  is_<User>(u_);
  return u_;
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