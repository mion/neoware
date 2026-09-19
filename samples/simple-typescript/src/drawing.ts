import Shape from "./shape.ts";

const uniqueIdentifier = () => Date.now() + "_" + Math.random().toString(16).substring(2);

export default class Drawing {
    public readonly uid: string;
    public readonly shapes: Shape[];

    constructor(shapes: Shape[]) {
        this.uid = uniqueIdentifier();
        this.shapes = shapes;
    }

    get [Symbol.toStringTag]() {
        return this.uid;
    }

    add(shape: Shape): Error | null {
        if (this.shapes.filter(s => s.uid === shape.uid).length > 0) {
            return new Error("cannot add another `Shape` with the same `uid`: " + shape.uid);
        } else {
            this.shapes.push(shape);
            return null;
        }
    }
}