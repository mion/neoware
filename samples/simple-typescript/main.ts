#!/usr/bin/env -S npx tsx

import Path from "node:path";

const my = Path.parse(process.argv[1]);

function log(...args: any[]) {
    return console.log.apply(
        console,
        [ new Date().toLocaleTimeString(), `\t[${my.name}]\t`, ...args ]
    );
}

log({ argv: process.argv });
