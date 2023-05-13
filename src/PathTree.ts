import { IPathNode } from "./IPathNode";
import { PathNode } from "./PathNode";

export type PathCapture = Map<string, string>;
type PathParts = string[];

export class PathTree {

    _root : IPathNode = new PathNode("");

    insert(path: string) {
        const parts = PathTree.getParts(path);

        let node = this._root;

        for (const word of parts) {
            if (word[0] === ':') {
                let wildcard = node.wildcard;
                const param = word.substr(1);

                for (let parent: IPathNode | null = node; parent !== null; parent = parent.parent) {
                    if (parent.isWildcard && (param === parent.key)) {
                        throw new Error("Cannot have the same wildcard on different levels");
                    }
                }

                if (!wildcard) {
                    wildcard = new PathNode(param);
                    node.addChild(wildcard, true);
                }

                if (wildcard.key !== param) {
                    throw new Error("Wildcard parameter is not matching");
                }

                node = wildcard;
            } else {
                let child = node.getChild(word);
                if (!child) {
                    child = new PathNode(word);
                    node.addChild(child, false);
                }
                node = child;
            }
        }

        node.isLeaf = true;
        return node;
    }

    find(path: string, capture: PathCapture | null): IPathNode | null {
        const parts = PathTree.getParts(path);

        let node = this._root;
        for (const word of parts) {
            const child = node.getChild(word);

            if (child) {
                node = child;
            } else if (node.wildcard) {
                node = node.wildcard;

                if (capture) {
                    capture.set(node.key, word);
                }
            } else {
                return null;
            }
        }

        return node.isLeaf ? node : null;
    }

    contains(url: string): boolean {
        return this.find(url, null) !== null;
    }

    private static getParts(path: string): PathParts {
        if (path[0] !== '/') {
            throw new Error("Path needs a leading slash");
        }
        return path.substr(1).split("/");
    }
}
