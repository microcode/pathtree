class PathNode {
    constructor(key) {
        this._key = key;

        this._children = new Map();

        this._parent_node = null;
        this._wildcard_node = null;

        this._is_wildcard = false;
        this._is_leaf = false;

        this._data = null;

        Object.seal(this);
    }

    get key() {
        return this._key;
    }

    get parent_node() {
        return this._parent_node;
    }

    get wildcard_node() {
        return this._wildcard_node;
    }

    get is_wildcard() {
        return this._is_wildcard;
    }

    set is_wildcard(value) {
        this._is_wildcard = value;
    }

    get is_leaf() {
        return this._is_leaf;
    }

    set is_leaf(value) {
        this._is_leaf = value;
    }

    get children() {
        return this._children;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        if (!this._is_leaf) {
            throw new Error("Cannot store data in non-leaf node");
        }
        this._data = value;
    }

    add_child(child) {
        this._children.set(child.key, child);
        child._parent_node = this;
    }

    add_wildcard(wildcard) {
        this._wildcard_node = wildcard;
        wildcard._parent_node = this;
        wildcard.is_wildcard = true;
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
            node = node.parent_node;
        }

        return output.join('/');
    }
}

exports.PathNode = PathNode;

