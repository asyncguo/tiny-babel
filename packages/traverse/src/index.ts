
import { visitorKeys } from '@tiny-babel/types/src'
import NodePath from './path/NodePath';
import { Visitors } from './types';
import { AstNode } from './types'

function traverse(
  node: AstNode, 
  visitors?: Visitors, 
  parent?: AstNode, 
  parentPath?: NodePath, 
  key?: string, 
  listKey?: number
) {
  // console.log('node=======', JSON.stringify(node, null, 2));
  // console.log('visitorKeys',visitorKeys);
  // 获取当前 ast 允许遍历的属性
  const defination = visitorKeys.get(node.type)

  // 获取不同节点的 visitor 回调函数：enter & exit
  let visitorFuncs = visitors?.[node.type] || {}

  // 默认 visitors 为 enter 阶段函数
  if (typeof visitorFuncs === 'function') {
    visitorFuncs = {
      enter: visitorFuncs
    }
  }

  const path = new NodePath(node, parent, parentPath, key, listKey)

  // 遍历子节点之前执行 enter 阶段函数
  visitorFuncs.enter && visitorFuncs.enter(path)

  // 判断是否跳过子节点的遍历
  if (node.__shouldSkip) {
    delete node.__shouldSkip
    return
  }

  defination?.visitor?.forEach(key => {
    const prop = node[key]
    if (Array.isArray(prop)) {
      prop.forEach((childNode, index) => {
        traverse(childNode, visitors, node, path, key, index)
      })
    } else {
      traverse(prop, visitors, node, path, key)
    }
  })

  // 遍历子节点之后执行 exit 阶段函数
  visitorFuncs.exit && visitorFuncs.exit(path)
}

export default traverse
