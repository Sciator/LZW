import { range, getInversedMap } from "./common";
import { BufferHelper } from "./BufferHelper";

const getDefaultDict = () => {
  const dict = new Map<string, number>();
  range(0x1_00)
    .forEach(n => dict.set("" + n, n))
    ;
  return dict;
};

export const compress = (data: Buffer) => {
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

  if (x.length > 0) outAddX();

  return BufferHelper.numberArray.toBuffer(out);
};


export const decompress = (compressedData: Buffer) => {
  const dict = getInversedMap(getDefaultDict());
  const out: number[] = [];

  let xp: number[] = [];
  let x: number[];

  BufferHelper.numberArray.fromBuffer(compressedData)
    .map((i: number) => {
      if (dict.has(i))
        x = (dict.get(i) as string).split(",").map(__ => +__);
      else
        x = xp;

      if (xp.length > 0) {
        const xpa = [...xp, x[0]];
        dict.set(dict.size, xpa.join());
      }
      xp = x;

      out.push(...(dict.get(i) as string).split(",").map(__ => +__));
    });

  return Buffer.from(out);
};
