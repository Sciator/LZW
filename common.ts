/** Throw wrapper for use with ?? operator */
export const throwReturn = <T>(msg: string): T => {
  throw new Error(msg);
};

export const randInt: {
  /** generates ranodm integer number */
  (maxExcluded: number): number;
  /** generates ranodm integer number */
  (minIncluded: number, maxExcluded: number): number;
} = (a: number, b?: number): number => {
  if (b === undefined)
    return Math.floor(Math.random() * a);
  else
    return Math.floor(Math.random() * b) + a;
};


export const range: {
  /** creates array with numbers from 0 to max-1 */
  (maxExcluded: number): number[];
  /** creates array with numbers from min to max-1 */
  (minIncluded: number, maxExcluded: number): number[];
} = (a: number, b?: number): number[] => {
  const arr = [];
  if (b === undefined)
    for (let i = 0; i < a; i++)
      arr.push(i);
  else
    for (let i = a; i < b; i++)
      arr.push(i);
  return arr;
};

/** zip together two arrays */
export const zip = <A, B>(arr1: A[], arr2: B[]): [A, B][] => {
  return arr1.map((k, i) => [k, arr2[i]]);
};

/** removes and returns item at given index */
export const popAt = <T>(arr: T[], indx: number) => {
  return arr.splice(indx)[0];
};

type async<Tout, Tin> = (args: Tin) => Promise<Tout>;

/** try to parse json, returns undefinad if parsing failed */
export const JSONparseNoError = <T>(JSONstring: string): T | undefined => {
  try {
    return JSON.parse(JSONstring);
  } catch {
    return undefined;
  }
};

/** create promise that resolves after given ms' */
export const sleep = async (ms: number) => {
  return new Promise((r) => {
    setTimeout(() => r(), ms);
  });
};

/** Returns given object as readonly */
export const asReadonly = <T>(obj: T) => obj as Readonly<T>;

/** Returns last element of an array */
export const last = <T>(arr: T[]) => arr[arr.length - 1];


/** Returns map with switched keys and values (doesn't care about collisions) */
export const getInversedMap = <Tkey, Tval>(map: Map<Tkey, Tval>): Map<Tval, Tkey> => {
  const out = new Map<Tval, Tkey>();
  for (const [key, value] of map.entries())
    out.set(value, key);
  return out;
};

type ArrFindPred<T> = ((value: T, index?: number, obj?: T[]) => boolean);

export const findOrDefault = <T>(arr: T[], pred: ArrFindPred<T>, def: () => T): T => {
  const foundI = arr.findIndex(pred);
  if (foundI === -1)
    return def();
  return arr[foundI];
};

export const inlineSwitch = <TIn, TOut>(val: TIn, choices: ([TIn, TOut] | [undefined, TOut])[]): TOut => {
  const defs = choices.filter(x => x[0] === undefined);
  if (defs.length >= 1)
    throw new Error("cannot return more than one default value");

  return findOrDefault(
    choices.filter(x => x.length === 2) as [TIn, TOut][],
    ([inn]) => (inn === val),
    () => defs.length === 1
      ? defs[0]
      : throwReturn("default was not specified for inline switch")
  )[1];
};

export const reducerSum = (a: number, b: number): number => a + b;
export const reducerFlat = <T>(a: T[], b: T[]): T[] => a.concat(b);

// todo: lepší pojmenování
export const slices = <T>(arr: T[], sliceSize: number): T[][] =>
  range(arr.length / sliceSize)
    .map(sliceI => range(sliceSize)
      .map(elmI => arr[elmI + sliceI * sliceSize]))
  ;

