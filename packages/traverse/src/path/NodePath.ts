import { validations, visitorKeys } from '@tiny-babel/types';
import { AstNode } from './../types';
import traverse from './../index';
import Scope from './Scope';

// TODO: 调用 node.isVariableDeclaration 等工具函数时，可以自动识别出 isVariableDeclaration
type ValidationType = {};

/**
 * ast 节点的 path 路径
 */
class NodePath implements ValidationType {
  /** 当前节点 */
  node: AstNode;
  /** 父节点 */
  parent: AstNode;
  /** 父节点的 path */
  parentPath?: NodePath;
  /** 当前节点在父节点的 key */
  key?: string;
  /** 若当前节点在父节点的 key 的值为数组格式时，需传入数组下标 */
  listKey?: number;
  __scope: any;
  constructor(
    node: any,
    parent?: any,
    parentPath?: NodePath,
    key?: string,
    listKey?: number
  ) {
    this.node = node;
    this.parent = parent;
    this.parentPath = parentPath;
    this.key = key;
    this.listKey = listKey;

    // 判断 ast 类型的工具函数
    Object.keys(validations).forEach((key) => {
      this[key] = validations[key].bind(this, node);
    });
  }

  get scope() {
    if (this.__scope) {
      return this.__scope;
    }

    const isBlock = this.isBlcok();
    const parentScope = this.parentPath && this.parentPath.scope;

    return (this.__scope = isBlock
      ? new Scope(parentScope, this)
      : parentScope);
  }

  isBlcok() {
    return visitorKeys.get(this.node.type)?.isBlock;
  }

  /**
   * 替换当前节点
   * @param node 新节点
   */
  replaceWith(node: Node) {
    if (this.listKey != undefined) {
      this.parent[this.key as string].splice(this.listKey, 1, node);
    } else {
      this.parent[this.key as string] = node;
    }
  }

  /**
   * 删除当前节点
   */
  remove() {
    if (this.listKey != undefined) {
      this.parent[this.key as string].splice(this.listKey, 1);
    } else {
      this.parent[this.key as string] = null;
    }
  }

  /**
   * 查找节点
   * 从当前节点开始
   */
  find(callback: (path: NodePath) => this) {
    let curPath: NodePath | undefined = this;
    // 若找到节点时，就返回当前节点的 path
    while (curPath && !callback(curPath)) {
      curPath = curPath.parentPath;
    }

    return curPath;
  }

  /**
   * 查找节点
   * 从当前节点的父节点开始
   */
  findParent(callback: (path: NodePath) => this) {
    let curPath = this.parentPath;
    // 若找到节点时，就返回当前节点的 parentPath
    while (curPath && !callback(curPath)) {
      curPath = curPath.parentPath;
    }

    return curPath;
  }

  /**
   * 同 traverse 逻辑，path.traverse 不需要再遍历当前节点，从子节点开始遍历即可
   */
  traverse(visitors) {
    const defination = visitorKeys.get(this.node.type);

    if (defination?.visitor) {
      defination.visitor.forEach((key) => {
        const prop = this.node[key];
        if (Array.isArray(prop)) {
          prop.forEach((childNode, index) => {
            traverse(childNode, visitors, this.node, this);
          });
        } else {
          traverse(prop, visitors, this.node, this);
        }
      });
    }
  }

  /**
   * 标识是否跳过子节点的遍历
   */
  skip() {
    this.node.__shouldSkip = true;
  }

  /**
   * 将当前节点打印成目标代码
   */
  toString() {
    // TODO: 生成目标代码
    // return generate(this.node).code
  }
}

export default NodePath;
