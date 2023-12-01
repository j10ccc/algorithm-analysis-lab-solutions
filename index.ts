import chalk from "chalk";
import Assignment1Solution from "assignment1-solutions";
import Assignment2Solution from "assignment2-solutions";
import fs from "fs";
import { performance } from "perf_hooks";

const ALGORITHMS = {
  ...Assignment1Solution,
  ...Assignment2Solution
}

const algorithm = process.argv[process.argv.indexOf("--algorithm") + 1] as keyof typeof ALGORITHMS;
const input = process.argv[process.argv.indexOf("--input") + 1]

const data: any = require(input);

const startTime = performance.now();
const result = ALGORITHMS[algorithm](data);
const endTime = performance.now();
console.log(chalk.blue("Run time:", endTime - startTime, "ms"));

const output = `./out/${algorithm}/${algorithm}_${new Date().getTime()}.json`;

fs.mkdirSync(output.slice(0, output.lastIndexOf("/") + 1), { recursive: true });
fs.writeFileSync(output, JSON.stringify(result));

console.log(chalk.green("Output generated in"), chalk.underline(output));
