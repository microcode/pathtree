import {
    PathNode
} from "./PathNode";

import * as chai from "chai";
import "mocha";

const expect = chai.expect;

describe('PathNode', function () {
    it('should set a key on construction', function () {
        const node = new PathNode('foo');

        expect(node.key).to.equal('foo');
    });

    it('should allow adding a child node', function () {
        const a = new PathNode('foo');
        const b = new PathNode('bar');

        b.isLeaf = true;
        a.addChild(b, false);

        expect(a).to.equal(b.parent);
        expect(b.path).to.equal('foo/bar');
    });

    it('should allow adding a wildcard node', function () {
        const a = new PathNode('foo');
        const b = new PathNode('bar');

        b.isLeaf = true;
        a.addChild(b, true);

        expect(b.parent).to.equal(a);
        expect(b.isWildcard).to.be.true;
        expect(b.path).to.equal('foo/:bar');
    });

    it('should not allow storing data in non-leaf node', function () {
        const node = new PathNode('bar');

        expect(() => { node.data = "foo" }).to.throw("Cannot store data in non-leaf node");
        expect(node.data).to.be.null;
    });

    it('should allow storing data in leaf node', function () {
        const node = new PathNode('bar');

        node.isLeaf = true;
        node.data = "foo";

        expect(node.data).to.equal("foo");
    });
});
