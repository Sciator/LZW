import { range, asReadonly, reducerSum, reducerFlat, slices } from "./common";

const byte = 0x1_00;
export class BufferHelper {
  public static bytes = 4;
  public static get maxNum() { return byte ** BufferHelper.bytes - 1; }

  public static number = asReadonly({
    toBuffer: (num: number) => {
      if (num > BufferHelper.maxNum)
        throw new Error(`Cannot express ${num} with ${BufferHelper.bytes} bytes`);
      return Buffer.from(
        range(BufferHelper.bytes)
          .map(d => {
            return Math.floor(num / (byte ** d)) % byte;
          })
      )
        ;
    },
    fromBuffer: (bytes: Buffer) => {
      return [...bytes]
        .map((n, d) => n * (byte ** d))
        .reduce(reducerSum, 0)
        ;
    },
  });

  public static numberArray = asReadonly({
    toBuffer: (nums: number[]) => {
      return Buffer.from(
        nums
          .map(n => [...BufferHelper.number.toBuffer(n)])
          .reduce(reducerFlat, [])
      )
        ;
    },
    fromBuffer: (bytes: Buffer) => {
      return slices([...bytes], BufferHelper.bytes)
        .map(b => BufferHelper.number.fromBuffer(Buffer.from(b)))
        ;
    },
  });
}

