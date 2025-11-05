import { $Equal, is_, never_, t, test_, yes_ } from './index'

export type GetAtPath
  < Obj, Path extends readonly any[] > =
  Path extends readonly [infer Head, ...infer Tail]
    ? Head extends keyof Obj
    ? Tail extends readonly any[]
      ? GetAtPath<Obj[Head], Tail>
      : Obj[Head]
    : Obj extends readonly (infer Elem)[]
      ? GetAtPath<Elem, Path>
      : never
    : Obj

test_(async () => {
  type MyObj = { foo: { bar: { baz: string }, qux: number }, corge: boolean }
  is_<GetAtPath<MyObj, ['foo','bar', 'baz']>>(t<string>()) 
  is_<GetAtPath<MyObj, ['foo', 'qux']>>(t<number>())
  is_<GetAtPath<MyObj, ['corge']>>(t<boolean>())
  yes_< $Equal<MyObj, GetAtPath<MyObj, []> >>()
  never_<GetAtPath<MyObj, ['foo', 'bar', 'nope']>>()
  never_<GetAtPath<MyObj, ['nope']>>()
  never_<GetAtPath<MyObj, ['foo', 'bar', 'nope']>>() })

export const get = 
  <const Obj, const Path extends readonly any[]>
  (o:Obj,p:Path): GetAtPath<Obj, Path> => 
    null as GetAtPath<Obj, Path>

test_(async () => {
  type Student = { name:string, age:18|19|20, student:true }
  type Granny = { name:string, age:90|91|92, student:false }
  const data =
    { bool:t<boolean>(), 
      foo:{ bar:{ win:'⭐️' }, fortyTwo:42 },
      people:t<(Student|Granny)[]>(),
      tuple:[t<Student>(), t<Granny>(), 42] } as const

  type E0 = GetAtPath <typeof data, ['foo', 'bar', 'win']>
  yes_< $Equal<E0,'⭐️'> >()

  const e0 = get(data, ['foo', 'bar', 'win'])
  is_<'⭐️'>(e0)
  is_<string>(e0)
  is_<typeof e0>(t<'⭐️'>())
  // @ts-expect-error:✔︎
  is_<typeof e0>(t<string>())

  const e1 = get(data, ['foo', 'fortyTwo'])
  is_<42>(e1)

  const e2 = get(data, ['bool'])
  is_<boolean>(e2)

  const e3 = get(data, ['people', t<number>(), 'name'])
  is_<string>(e3)

  const e4 = get(data, ['people', t<number>(), 'student'])
  is_<boolean>(e4)
  // @ts-expect-error:✔︎
  is_<true>(e4)

  const e5 = get(data, ['people', 0, 'student'])
  is_<boolean>(e5)

  const e6 = get(data, ['people', 0, 'age'])
  is_<number>(e6)
  is_<typeof e6>(20)
  is_<typeof e6>(91)
  // @ts-expect-error:✔︎
  is_<typeof e6>(3)

  const e7 = get(data, ['tuple', 0, 'student'])
  is_<true>(e7)

  const e8 = get(data, ['tuple', 1, 'student'])
  is_<false>(e8)
  // @ts-expect-error:✔︎
  never_<e8>()

  const e9 = get(data, ['tuple', 2])
  is_<42>(e9)

  const e10 = get(data, ['tuple', 2, 'student'])
  never_(e10) })