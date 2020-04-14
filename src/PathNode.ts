export interface IPathNode {
    readonly key: string;
    readonly parent: IPathNode | null;
    readonly wildcard: IPathNode | null;

    isWildcard: boolean;
    isLeaf: boolean;

    readonly path: string;

    getChild(key: string) : IPathNode | null;
    addChild(child: IPathNode, wildcard: boolean): void;

    attachToParent(parent: IPathNode): void;

    data: any | null;
}

export class PathNode implements IPathNode {
    private readonly _key: string;

    private _children: Map<string, IPathNode> = new Map<string, IPathNode>();

    private _parent: IPathNode | null = null;
    private _wildcard: IPathNode | null = null;

    private _isWildcard: boolean = false;
    private _isLeaf: boolean = false;

    private _data: any | null = null;

    constructor(key: string) {
        this._key = key;
    }

    get key(): string {
        return this._key;
    }

    get parent(): IPathNode | null {
        return this._parent;
    }

    get wildcard(): IPathNode | null {
        return this._wildcard;
    }

    get isWildcard(): boolean {
        return this._isWildcard;
    }

    set isWildcard(v: boolean) {
        this._isWildcard = v;
    }

    get isLeaf(): boolean {
        return this._isLeaf;
    }

    set isLeaf(v: boolean) {
        this._isLeaf = v;
    }

    get data(): any {
        return this._data;
    }

    set data(data: any) {
        if (!this.isLeaf) {
            throw new Error("Cannot store data in non-leaf node");
        }
        this._data = data;
    }

    getChild(key: string) : IPathNode | null {
        return this._children.get(key);
    }

    addChild(child: IPathNode, wildcard: boolean): void {
        if (wildcard) {
            this._wildcard = child;
            child.isWildcard = true;
        } else {
            this._children.set(child.key, child);
        }
        child.attachToParent(this);
    }

    attachToParent(parent: IPathNode): void {
        this._parent = parent;
    }

    get path(): string {
        const output: string[] = [];

        for (let node : IPathNode | null = this; node !== null; node = node.parent) {
            if (node.isWildcard) {
                output.unshift(':' + node.key);
            } else {
                output.unshift(node.key);
            }
        }

        return output.join('/');
    }
}