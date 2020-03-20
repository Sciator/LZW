import { Transform } from "stream";
import { range, getInversedMap, sleep } from "./common";

const getDefaultDict = () => {
  const dict = new Map<string, number>();
  range(0x1_00)
    .forEach(n => dict.set("" + n, n))
    ;
  return dict;
};

const asBuffer = (arr: number[]) => {
  const buffer = Buffer.alloc(arr.length * 4);
  arr.forEach((x, i) => {
    buffer.writeUInt32BE(x, i * 4);
  });
  return buffer;
};

const fromBuffer = (buf: Buffer): [number[], Buffer] => {
  const arr: number[] = [];
  const arrLen = Math.floor(buf.length / 4);
  range(arrLen).forEach(x => {
    arr.push(buf.readUInt32BE(x * 4));
  });
  const rest = Buffer.alloc(buf.length - arr.length * 4);
  buf.copy(rest, 0, arrLen * 4);
  return [arr, rest];
};

export class LZWTransformCompress extends Transform {
  private readonly dict: Map<string, number> = getDefaultDict();
  private x: number[] = [];

  public _transform(chunk: Buffer, encoding: string,
    callback: (error: Error | null, data: Buffer) => void) {
    if (encoding !== "buffer")
      throw "";

    const out: number[] = [];

    chunk.forEach(a => {
      const xa = [...this.x, a];

      if (this.dict.has(xa.join())) {
        this.x = xa;
      } else {
        this.dict.set(xa.join(), this.dict.size);
        out.push(this.dict.get(this.x.join()) as number);
        this.x = [a];
      }
    });

    callback(null, asBuffer(out));
  }

  public _flush(callback: (err?: Error | null, data?: Buffer) => void) {
    if (this.x.length)
      callback(null, asBuffer([this.dict.get(this.x.join()) as number]));
    callback();
  }
}

export class LZWTransformDecompress extends Transform {
  private readonly dict = getInversedMap(getDefaultDict());
  private rest: Buffer = Buffer.alloc(0);
  private xp: number[] = [];
  private x: number[] = [];

  public async _transform(chunk: Buffer, encoding: string,
    callback: (error: Error | null, data: Buffer) => void) {
    if (encoding !== "buffer")
      throw "";
    const [nums, rest] = fromBuffer(Buffer.concat([this.rest, chunk]));
    this.rest = rest;
    const out: number[] = [];

    nums.forEach((i: number) => {
      if (this.dict.has(i))
        this.x = (this.dict.get(i) as string).split(",").map(__ => +__);
      else
        this.x = [...this.xp, this.xp[0]];

      if (this.xp.length > 0) {
        const xpa = [...this.xp, this.x[0]];
        this.dict.set(this.dict.size, xpa.join());
      }
      this.xp = this.x;

      out.push(...(this.dict.get(i) as string).split(",").map(__ => +__));
    });

    callback(null, Buffer.from(out));
  }

  public _flush(callback: (err?: Error | null, data?: Buffer) => void) { callback(); }
}

