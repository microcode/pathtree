const { PathNode } = require('..');

const assert = require('assert');

describe('PathNode', function () {
    it('should set a key on construction', function () {
        const node = new PathNode('foo');

        assert.equal(node.key, 'foo');
    });

    it('should not allow changing key after construction', function () {
        const node = new PathNode('foo');

        node.key = "bar";

        assert.equal(node.key, 'foo');
    });

    it('should allow adding a child node', function () {
        const a = new PathNode('foo');
        const b = new PathNode('bar');

        b.is_leaf = true;
        a.add_child(b);

        assert.equal(b.parent_node, a);
        assert.equal(b.path, 'foo/bar');
    });

    it('should allow adding a wildcard node', function () {
        const a = new PathNode('foo');
        const b = new PathNode('bar');

        b.is_leaf = true;
        a.add_wildcard(b);

        assert.equal(b.parent_node, a);
        assert.equal(b.is_wildcard, true);
        assert.equal(b.path, 'foo/:bar');
    });

    it('should not allow storing data in non-leaf node', function () {
        const node = new PathNode();

        assert.throws(() => { node.data = "foo" }, Error);

        assert.equal(node.data, null);
    });

    it('should allow storing data in leaf node', function () {
        const node = new PathNode();

        node.is_leaf = true;
        node.data = "foo";

        assert.equal(node.data, "foo");
    });
});
