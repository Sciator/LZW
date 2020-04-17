# LZW

Simple implementatio of lzw algorithm.

## Requirements

### Compile and test

1. node installed ( https://nodejs.org/ )
2. global node packages important for building this project: 
   * typescript
   * pkg
3. download local dependencies `npm install`

( global packages can be installed by `npm i -g pkg typescript` )

### Run

No special requirements.

## Usage

Parmaters are listed through `-h` argument.

Program has compress/decompress mode. If not specified program will select decopress if file has .lzw extension or compress otherwise.

## Test on random text

0. ( create data dir `mkdir data` ) 
1. generate random text with `npm run random-file`
2. compress file with `ts-node index.ts "./data/test.txt" -f`
3. decompress file (for check) with `ts-node index.ts "./data/test.txt.lzw" "./data/test.out.txt" -f`


## Build executables

Building:
1. compile typescript `tsc`
2. build executables `pkg ./bin/index.js --out-path ./build/`
3. executables are in build directory

## Run without building

Run with `ts-node ./index.ts` ( + arguments after )

## VSCode debug

* start automatic tsc `tsc --watch`
* insert your testfile inside data directory as test.txt
