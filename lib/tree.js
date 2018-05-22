const { PathNode } = require('./node');

function getParts(path) {
    if (path[0] !== '/') {
        throw new Error("Path needs a leading slash");
    }
    return path.substr(1).split("/");
}

class PathTree {
    constructor() {
        this._root = new PathNode(null);
    }

    insert(path) {
        const parts = getParts(path).map(s => s.toLowerCase());

        let node = this._root;

        for (let word of parts) {
            if (word[0] === ':') {
                let wildcard = node.wildcard_node;
                const param = word.substr(1);

                for (let parent = node; parent !== null; parent = parent.parent_node) {
                    if (parent.is_wildcard && (param === parent.key)) {
                        throw new Error("Cannot have same wildcard on different level");
                    }
                }

                if (!wildcard) {
                    wildcard = new PathNode(param);
                    node.add_wildcard(wildcard);
                }

                if (wildcard.key !== param) {
                    throw new Error("Wildcard parameter not matching");
                }

                node = wildcard;
            } else {
                let child = node.children.get(word);

                if (!child) {
                    child = new PathNode(word);
                    node.add_child(child);
                }

                node = child;
            }
        }

        node.is_leaf = true;
        return node;
    }

    find(path, capture) {
        const parts = getParts(path);

        let node = this._root;
        for (let word of parts) {
            const child = node.children.get(word);

            if (child) {
                node = child;
            } else if (node.wildcard_node) {
                node = node.wildcard_node;

                if (capture) {
                    capture.set(node.key, word);
                }
            } else {
                return null;
            }
        }

        if (!node.is_leaf) {
            return null;
        }

        return node;
    }

    contains(url) {
        return this.find(url) !== null;
    }
}

exports.PathTree = PathTree;
