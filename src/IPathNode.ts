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

    data?: unknown;
}
