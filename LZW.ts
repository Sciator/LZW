import { range, getInversedMap } from "./common";

const getDefaultDict = () => {
  const dict = new Map<string, number>();
  range(0x1_00)
    .forEach(n => dict.set("" + n, n))
    ;
  return dict;
};

export const compress = (data: number[]): number[] => {
  const dict = getDefaultDict();

  let x: number[] = [];
  const out: number[] = [];
  const outAddX = () => out.push(dict.get(x.join()) as number);

  data.forEach(a => {
    const xa = [...x, a];

    if (dict.has(xa.join())) {
      x = xa;
    } else {
      dict.set(xa.join(), dict.size);
      outAddX();
      x = [a];
    }
  });

  if (x.length) outAddX();

  return out;
};


export const decompress = (compressedData: number[]): number[] => {
  const dict = getInversedMap(getDefaultDict());
  const out: number[] = [];

  let xp: number[] = [];
  let x: number[];

  compressedData
    .map(i => {
      if (dict.has(i))
        x = (dict.get(i) as string).split(",").map(__ => +__);
      else
        x = [...xp, xp[0]];

      if (xp.length) {
        const a = x[0];
        const xpa = [...xp, a];
        dict.set(dict.size, xpa.join());
      }
      xp = x;

      out.push(...(dict.get(i) as string).split(",").map(__ => +__));
    });

  return out;
};
