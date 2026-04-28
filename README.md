fsCli tool
v1.0.0

**** DESCRIPTION ****
A TOOL THAT PERFORMS FS OPERATIONS WITH LESS OVERHEAD

**** REQUIREMENTS ****
NODEJS v12+ with npm

**** USAGE ****

0. Install dependencies

```shell
npm install
```

1. build the project

```shell
npm run build
```

2. link it to your terminal (from the project dir)

```shell
npm link
```

3. test your tool

```
fsCli

```

** EXAMPLES **

```shell
fsCli serach ./ logs 
```

-> prints all files under ./ directory that have the prefix `logs`

```shell
fsCli tree ./src
```

```
├── src
  ├── cli
    searchFiles.ts
    tree.ts
  ├── configs
    loadEnv.ts
  ├── logger
    logger.test.ts
    logger.ts
  ├── modules
    ├── fs
      constants.ts
      getFileHash.ts
      json-loader.ts
      read-summarize.ts
      watchFile.ts
      write-file-safe.ts
  ├── utils
    sanitizeFilePath.ts
  index.ts
```