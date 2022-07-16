import NodePath from './NodePath';

class Binding {
  id: string;
  path: NodePath;
  referenced: boolean;
  referencePaths: NodePath[];
  constructor(id: string, path: NodePath, scope?: Scope, kind?: string) {
    this.id = id;
    this.path = path;
    this.referenced = false;
    this.referencePaths = [];
  }
}

/**
 * ast 的作用域相关数据
 * 能生成 scope 的 ast 叫做 block，例如：FunctionDeclaration
 * scope 规则：遇到 block 时，就生成新的 scope，否则获取之前的 scope
 */
class Scope {
  /** 父作用域 */
  parent?: Scope;
  /** 作用域内的声明 */
  bindings: Record<string, Binding>;
  /** path */
  path?: NodePath;
  constructor(parentScope?: Scope, path?: NodePath) {
    this.parent = parentScope;
    this.bindings = {};
    this.path = path;

    // 记录 bindings
    path?.traverse({
      // 记录作用域内所有声明到 scope
      VariableDeclarator: (childPath) => {
        this.registerBinding(childPath.node.id.name, childPath);
      },
      // 跳过函数作用域
      FunctionDeclaration: (childPath) => {
        this.registerBinding(childPath.node.id.name, childPath);
      },
    });

    // 记录引用 bindings
    path?.traverse({
      Identifier: (childPath) => {
        console.log('childPath', childPath);

        if (
          !childPath.findParent(
            (p) => p.isVariableDeclarator() || p.isFunctionDeclaration()
          )
        ) {
          console.log('test========', childPath.node);

          const id = childPath.node.name;
          const binding = this.getBinding(id);
          if (binding) {
            binding.referenced = true;
            binding.referencePaths.push(childPath);
          }
        }
      },
    });
  }

  registerBinding(id, path) {
    this.bindings[id] = new Binding(id, path);
  }

  getOwnBinding(id) {
    return this.bindings[id];
  }
  getBinding(id) {
    let res = this.getOwnBinding(id);

    if (res === undefined && this.parent) {
      res = this.parent.getOwnBinding(id);
    }

    return res;
  }

  hasBinding(id) {
    return !!this.getBinding[id];
  }
}

export default Scope;
