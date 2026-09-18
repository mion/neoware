import _ from "lodash";
import FileSystem from "node:fs";
import Path from "node:path";

class Schema {
    constructor(entities, relationships) {
        this.entities = entities;
        this.relationships = relationships;
    }

    toTypeScript() {
        const code = this.entities.map(sourceEntity => {
            const relationships = this.relationships[sourceEntity] || [];
            const properties = relationships.map(targetEntity => {
                return `public ${_.camelCase(targetEntity)}: ${targetEntity} | null = null;`
            });
            return `class ${sourceEntity} {\n${properties.map(p => `\t${p}`).join("\n")}\n}`;
        });
        return code.join("\n\n");
    }

    static parse(json) {
        const excalidrawFile = JSON.parse(json);
        const elements = (excalidrawFile.elements ?? []).filter(e => !e.isDeleted);

        // A container's label is the text element that points back at it via
        // `containerId`. Reading it from the text side (rather than from the
        // rectangle's `boundElements`) means we never have to resolve ids twice.
        const labelByContainerId = new Map(
            elements
                .filter(e => e.type === "text" && e.containerId != null)
                .map(e => [e.containerId, (e.originalText ?? e.text ?? "").trim()])
        );

        // id -> entity name, for every rectangle that actually carries a label.
        const entityById = new Map(
            elements
                .filter(e => e.type === "rectangle" && labelByContainerId.has(e.id))
                .map(e => [e.id, labelByContainerId.get(e.id)])
        );

        const entities = _.uniq(Array.from(entityById.values()));

        // Arrows carry the only trustworthy direction information: `startBinding`
        // is the source, `endBinding` the target. A rectangle's `boundElements`
        // lists arrows that merely pass nearby, so it can't be used here.
        const relationships = {};
        for (const arrow of elements.filter(e => e.type === "arrow")) {
            const source = entityById.get(arrow.startBinding?.elementId);
            const target = entityById.get(arrow.endBinding?.elementId);
            if (source == null || target == null) continue;
            (relationships[source] ??= []).push(target);
        }
        for (const source of Object.keys(relationships)) {
            relationships[source] = _.uniq(relationships[source]);
        }

        return new Schema(entities, relationships);
    }

    static stringify(schema) {
        return JSON.stringify(schema, null, 2);
    }
}

function main(pathToJsonFile) {
    const read = path => FileSystem.readFileSync(path, "utf-8");
    const write = (path, data) => FileSystem.writeFileSync(path, data, "utf-8");
    const { root, dir, base, name, ext } = Path.parse(pathToJsonFile);
    const json = read(pathToJsonFile);
    const schema = Schema.parse(json);
    write(name + ".ts", schema.toTypeScript());
    write(name + ".json", Schema.stringify(schema));
}

main(...Array.from(process.argv).slice(2));