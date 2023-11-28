import chalk from "chalk";
import Assignment1Solution from "assignment1-solutions";
import fs from "fs";

const ALGORITHMS = {
  ...Assignment1Solution
}

const algorithm = process.argv[process.argv.indexOf("--algorithm") + 1] as keyof typeof ALGORITHMS;
const input = process.argv[process.argv.indexOf("--input") + 1]

const data: any = require(input);

const result = ALGORITHMS[algorithm](data);

const output = `./out/${algorithm}/${algorithm}_${new Date().getTime()}.json`;

fs.mkdirSync(output.slice(0, output.lastIndexOf("/") + 1), { recursive: true });
fs.writeFileSync(output, JSON.stringify(result));

console.log(chalk.green("Output generated in"), chalk.underline(output));
