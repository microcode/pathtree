import {
    PathTree,
    PathCapture
} from "./PathTree";

import * as chai from "chai";
import "mocha";

const expect = chai.expect;

describe('PathTree', function () {
    it('should insert and return a value', function () {
        const tree = new PathTree();

        tree.insert("/test");

        expect(tree.contains("/test")).to.be.true;
        expect(tree.contains("/tes")).to.be.false;
        expect(tree.contains("/test/extra")).to.be.false;
        expect(tree.contains("/other")).to.be.false;
    });

    it('should enforce a leading slash', function () {
        const tree = new PathTree();

        tree.insert("/test");
        expect(() => { tree.insert("test"); }).to.throw("Path needs a leading slash");
    });

    it('should handle wildcard entries', function () {
        const tree = new PathTree();

        tree.insert("/foo");
        tree.insert("/foo/:wildcard");
        tree.insert("/foo/:wildcard/bar");

        expect(tree.contains('/foo')).to.be.true;
        expect(tree.contains('/foo/1234')).to.be.true;
        expect(tree.contains('/foo/1234/bar')).to.be.true;
        expect(tree.contains('/foo/1234/blutti')).to.be.false;
        expect(tree.find('/foo/1234/bar', null).path).to.equal('/foo/:wildcard/bar');
    });

    it('should capture wildcard parameters', function () {
        const tree = new PathTree();

        tree.insert("/foo/:wildcard/bar");

        const capture = new Map<string, string>();
        expect(tree.find('/foo/1234/bar', capture)).to.not.be.null;

        expect(Array.from(capture.keys())).to.deep.equal(['wildcard']);
        expect(Array.from(capture.values())).to.deep.equal(['1234']);
    });

    it('should enforce the same wildcard for all paths', function () {
        const tree = new PathTree();

        tree.insert("/foo");
        tree.insert("/foo/:wildcard1");

        expect(() => { tree.insert("/foo/:wildcard2") }).to.throw("Wildcard parameter is not matching");
    });

    it('should not allow the same wildcard name on different levels', function () {
        const tree = new PathTree();

        expect(() => { tree.insert("/foo/:a/bar/:a") }).to.throw("Cannot have the same wildcard on different levels");
    });

    it('should allow storing data in node', function () {
        const tree = new PathTree();

        const inserted = tree.insert("/foo");
        inserted.data = "bar";

        const found = tree.find("/foo", null);
        expect(found).to.not.be.null;
        expect(found.data).to.equal("bar");
    });
});
