import * as fs from "fs";
import { asReadonly } from "./common";
import { questionYN } from "./CLI";
import * as Path from "path";
import { decompress, compress } from "./LZW";
import { LZWTransformCompress, LZWTransformDecompress } from "./LZWstream";

export const processFile = async (
  input: string,
  outputOpt?: string,
  operation?: "C" | "D",
  forceOverwrite?: boolean
) => {
  if (!fs.existsSync(input)) {
    // tslint:disable-next-line: no-console
    console.error(`Input file doesn't exist! ${input}`);
    return;
  }

  const isDecompress = (operation === "D")
    || (operation !== "C" &&
      Path.extname(input).toLowerCase() === ".lzw")
    ;

  const output = outputOpt || (
    isDecompress
      // todo: chovaní v případě test.lzw.txt.neco ...
      ? input.split(".").filter(x => x !== "lzw").join(".")
      : input + ".lzw"
  );

  if (fs.existsSync(output)
    && !forceOverwrite
    && !await questionYN(`Output file ${output} already exists. Override ?`)
  ) return;

  const inputStream = fs.createReadStream(input);
  const outputStream = fs.createWriteStream(output);

  if (isDecompress)
    inputStream
      .pipe(new LZWTransformDecompress())
      .pipe(outputStream)
      ;
  else
    inputStream
      .pipe(new LZWTransformCompress())
      .pipe(outputStream)
      ;

  await new Promise(r => { inputStream.on("close", () => { r(); }); });
  // const procFnc = isDecompress ? decompress : compress;
  // const inputData = fs.readFileSync(input);
  // const processedData = procFnc(inputData);
  // fs.writeFileSync(output, processedData);
};



