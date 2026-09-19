export type ShapeType = "rectangle" | "circle" | "polygon" | "line";
export default class Shape {
    public readonly type: ShapeType;
    public readonly parameters: Record<string, string | number | Array<string> | Array<number>>;

    constructor(type: ShapeType, parameters: Record<string, number | string>) {
        this.type = type;
        this.parameters = parameters;
    }
}