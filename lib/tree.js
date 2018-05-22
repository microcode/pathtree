class PathNode {
    constructor(key, is_wildcard) {
        this.key = key;
        this.parent = null;
        this.children = new Map();
        this.is_wildcard = is_wildcard;
        this.wildcard = null;
        this.end = false;

        this._data = null;
    }

    get path() {
        const output = [];
        let node = this;

        while (node !== null) {
            if (node.is_wildcard) {
                output.unshift(':' + node.key);
            } else {
                output.unshift(node.key);
            }
            node = node.parent;
        }

        return output.join('/');
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }
}

function getParts(path) {
    if (path[0] !== '/') {
        throw new Error("Path needs a leading slash");
    }
    return path.substr(1).split("/");
}

class PathTree {
    constructor() {
        this.root = new PathNode(null);
    }

    insert(path) {
        const parts = getParts(path).map(s => s.toLowerCase());

        let node = this.root;

        for (let word of parts) {
            if (word[0] === ':') {
                let child = node.wildcard;
                const param = word.substr(1);

                if (!child) {
                    child = new PathNode(param, true);
                    node.wildcard = child;
                    child.parent = node;
                }

                if (child.key !== param) {
                    throw new Error("Wildcard parameter not matching");
                }

                node = child;
            } else {
                let child = node.children.get(word);

                if (!child) {
                    child = new PathNode(word);
                    node.children.set(word, child);
                    child.parent = node;
                }

                node = child;
            }
        }

        node.end = true;
        return node;
    }

    find(path, capture) {
        const parts = getParts(path);

        let node = this.root;
        for (let word of parts) {
            const child = node.children.get(word);

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

        if (!node.end) {
            return null;
        }

        return node;
    }

    contains(url) {
        return this.find(url) != null;
    }
}

exports.PathNode = PathNode;
exports.PathTree = PathTree;
