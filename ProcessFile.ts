import * as fs from "fs";
import { extname } from "path";
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
    || (operation !== "C" && extname(input).toLowerCase() === ".lzw")
    ;

  const output = outputOptional || (isDecompress
    ? input.split(".").slice(-1)[0] === "lzw"
      ? input.split(".").slice(0, -1).join(".")
      : input
    : input + ".lzw"
  );

  if (await promisify(fs.exists)(output)
    && !forceOverwrite
    && !await questionYN(`Output file ${output} already exists. Override ?`)
  ) return;

  const length = (await promisify(fs.stat)(input)).size;

  const progressBar = new SingleBar({ clearOnComplete: true }, Presets.shades_classic);
  progressBar.start(length, 0);

  await new Promise(done =>
    fs.createReadStream(input)
      .pipe(
        Progress({ length })
          .on("progress", ({ transferred }) => progressBar.update(transferred))
      )
      .pipe(
        isDecompress
          ? new LZWTransformDecompress()
          : new LZWTransformCompress()
      )
      .pipe(fs.createWriteStream(output))
      .on("close", done)
  );

  progressBar.stop();
};
