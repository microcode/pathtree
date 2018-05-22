const { PathTree } = require('..');

const assert = require('assert');

describe('PathTree', function () {
    it('should insert and return a value', function () {
        const tree = new PathTree();

        tree.insert("/test");

        assert.equal(tree.contains("/test"), true);
        assert.equal(tree.contains("/tes"), false);
        assert.equal(tree.contains("/test/extra"), false);
        assert.equal(tree.contains("/other"), false);
    });

    it('should enforce a leading slash', function () {
        const tree = new PathTree();

        tree.insert("/test");
        assert.throws(() => { tree.insert("test"); }, Error);
    });

    it('should handle wildcard entries', function () {
        const tree = new PathTree();

        tree.insert("/foo");
        tree.insert("/foo/:wildcard");
        tree.insert("/foo/:wildcard/bar");

        assert.equal(tree.contains('/foo'), true);
        assert.equal(tree.contains('/foo/1234'), true);
        assert.equal(tree.contains('/foo/1234/bar'), true);
        assert.equal(tree.contains('/foo/1234/blutti'), false);
        assert.equal(tree.find('/foo/1234/bar').path, '/foo/:wildcard/bar');
    });

    it('should capture wildcard parameters', function () {
        const tree = new PathTree();

        tree.insert("/foo/:wildcard/bar");

        const capture = new Map();
        assert(tree.find('/foo/1234/bar', capture) !== null);

        assert.deepEqual(Array.from(capture.keys()), ['wildcard']);
        assert.deepEqual(Array.from(capture.values()), ['1234']);
    });

    it('should enforce the same wildcard for all paths', function () {
        const tree = new PathTree();

        tree.insert("/foo");
        tree.insert("/foo/:wildcard1");
        assert.throws(() => { tree.insert("/foo/:wildcard2") }, Error);
    });

    it('should allow storing data in node', function () {
        const tree = new PathTree();

        const inserted = tree.insert("/foo");
        inserted.data = "bar";

        const found = tree.find("/foo");
        assert.notEqual(found, null);
        assert.equal(found.data, "bar");
    });
});
