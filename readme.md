# LZW

Simple implementatio of lzw algorithm.

## Requirements

### Compile and test

1. node with npm installed ( https://nodejs.org/ )
2. global node packages important for building this project: 
   * typescript
   * pkg
3. download local dependencies `npm install`

( global packages can be installed by `npm i -g pkg typescript` )

### Run

No special requirements, compiled package contains everything needed.

## Usage

Parmaters are listed through `-h` argument.

Program has compress/decompress mode. If not specified program will select decopress if file has .lzw extension or compress otherwise.

## Test on random text

Run `npm test`

## Build executables

Run `npm run dist` executables are in build directory

## Run without building

Run with `ts-node ./index.ts` ( + arguments after )

## VSCode debug

* start automatic tsc `tsc --watch`
* insert your testfile inside data directory as test.txt
