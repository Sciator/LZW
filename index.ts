import { compress, decompress } from "./LZW";
import { BufferHelper } from "./BufferHelper";
import yargs = require("yargs");
import { questionYN } from "./CLI";
import { processFile } from "./ProcessFile";
import chalk = require("chalk");

// tslint:disable-next-line: no-unused-expression
yargs
  .command(
    "* [file] [output]",
    "de/compress given file",
    (b) => b
      .positional("file", { describe: "file to compress/decompress", type: "string", alias: "in" })
      .positional("output", { describe: "file output, [input].lzw if not specified", type: "string", alias: "out" })
      .demandOption("file")
      .option("compress", { alias: "C", boolean: true })
      .option("decompress", { alias: "D", boolean: true })
      .conflicts("compress", "decompress")
      .option("force", {
        alias: "f", boolean: true,
        describe: "forces overvriting output file when already existrs"
      })
    ,
    (async args => {
      const operation = (args.compress && "C") || (args.decompress && "D") || undefined;
      const forceOverwrite = args.force || false;

      const t0 = Date.now();
      await processFile(args.file as string, args.output as string, operation, forceOverwrite);
      console.info(chalk.green(`Done ! ${Date.now() - t0} ms`));
    }))
  .argv
  ;
