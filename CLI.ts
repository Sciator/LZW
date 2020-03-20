import * as readline from "readline";
import chalk from "chalk";

export const question = async (qq: string) => {
  return new Promise((resolve) => {
    const read = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    read.question(qq, (res) => {
      read.close();
      resolve(res);
    });
  });
};

export const questionYN = async (qq: string): Promise<boolean> => {
  let res: boolean | undefined;
  do {
    switch (await question(qq + ` [${chalk.greenBright("Y")}/${chalk.redBright("N")}] `)) {
      case "Y": case "y":
        res = true;
        break;
      case "n": case "N":
        res = false;
        break;
    }
  } while (res === undefined);
  return res;
};
