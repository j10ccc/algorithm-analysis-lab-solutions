# Algorithm assignments monorepo

BTH004 _Algorithm Analysis_ laboratory assignments solutions.

## Requirements

It is a monorepo based on [bun](https://bun.sh). Before get started, instead of NodeJS, you should use your package manager global install bun.

## Run

Before executing running commands, install the dependencies.

```shell
$ bun install
```

Then run the index file in root repo with `--algorithm` and `--input` arguments passed.

```shell
# All available --algorithm values can be found in package.json
$ bun index.ts --algorithm greedy --input ./input/case_1.json

# Alternatively using alias
$ bun greedy --input ./input/case_1.json
```

> [!NOTE]
> Two assignments input cases are provided in `input/`, you can refer the type of them

## Debug

You should debug for the index file `/index.ts` by passing some arguments mentioned in previous section.

If you use VSCode or VSCodium, you can easily start bun debug by adding this configuration in `.vscode/launch.json`. Looking the example for debugging neighbor search with input file `case_6.json`

```json
{
  "type": "bun",
  "request": "launch",
  "name": "Debug neighbor search",
  "program": "${workspaceFolder}/index.ts",
  "cwd": "${workspaceFolder}",
  "stopOnEntry": false,
  "watchMode": false,
  "internalConsoleOptions": "neverOpen",
  "args": [
    "--algorithm",
    "neighborSearch",
    "--input",
    "${workspaceFolder}/input/case_1.json"
  ]
},
```