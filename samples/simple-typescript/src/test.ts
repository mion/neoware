import test from "node:test";
import assert from "node:assert";
import util from "node:util";

import Shape from "./shape.ts";
import Drawing from "./drawing.ts";

test("creation of a drawing", () => {
    assert.doesNotThrow(() => {
        let d = new Drawing([]);
    }, "failed to create an empty `Drawing`");
});

test("configuration of a drawing", () => {
    let drawing = new Drawing([]);
    let res: Error | null;
    assert.doesNotThrow(() => {
        res = drawing.add(new Shape("circle", {"diameter": 10}));
        assert.equal(res, null);
    }, "failed to add a `Shape` to an empty `Drawing`");
});