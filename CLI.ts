import chalk from "chalk";
import * as readline from "readline";

const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const question = async (qq: string) => {
  return new Promise((resolve) => {
    read.question(qq, (res) => resolve(res));
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
