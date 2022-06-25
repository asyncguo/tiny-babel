import NodePath from "./NodePath"

class Binding {

}

/**
 * ast 的作用域相关数据
 * 能生成 scope 的 ast 叫做 block，例如：FunctionDeclaration
 * scope 规则：遇到 block 时，就生成新的 scope，否则获取之前的 scope
 */
class Scope {
  /** 父作用域 */
  parent?: Scope
  /** 作用域内的声明 */
  bindings?: Binding
  /** path */
  path?: NodePath
  constructor(parentScope?: Scope, path?: NodePath) {
    this.parent = parentScope
    this.bindings = {}
    this.path = path
  }
}

export default Scope
