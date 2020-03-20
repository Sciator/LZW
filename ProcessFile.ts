import * as fs from "fs";
import * as Path from "path";
import { promisify } from "util";

import { LZWTransformCompress, LZWTransformDecompress } from "./LZWstream";
import { SingleBar, Presets } from "cli-progress";
import Progress from "progress-stream";
import { questionYN } from "./CLI";

export const processFile = async (
  input: string,
  outputOptional?: string,
  operation?: "C" | "D",
  forceOverwrite?: boolean
) => {
  if (!await promisify(fs.exists)(input))
    throw new Error(`Input file doesn't exist! ${input}`);

  const isDecompress = (operation === "D")
    || (operation !== "C" && Path.extname(input).toLowerCase() === ".lzw")
    ;

  const output = outputOptional ||
    isDecompress
    ? input.split(".").slice(-1)[0] === "lzw"
      ? input.split(".").slice(0, -1).join(".")
      : input
    : input + ".lzw"
    ;

  if (await promisify(fs.exists)(output)
    && !forceOverwrite
    && !await questionYN(`Output file ${output} already exists. Override ?`)
  ) return;


  const inputStream = fs.createReadStream(input);
  const inputSize = (await promisify(fs.stat)(input)).size;

  const outputStream = fs.createWriteStream(output);
  const outputClosed = new Promise(r => outputStream.on("close", () => r()));

  const progressBar = new SingleBar({}, Presets.shades_classic);
  progressBar.start(inputSize, 0);

  const progressListener = Progress({ length: inputSize });
  progressListener.on("progress",
    ({ transferred }) => progressBar.update(transferred));

  inputStream
    .pipe(progressListener)
    .pipe(
      isDecompress
        ? new LZWTransformDecompress()
        : new LZWTransformCompress()
    )
    .pipe(outputStream)
    ;

  await outputClosed;
  progressBar.stop();
};
