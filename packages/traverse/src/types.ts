import NodePath from "./path/NodePath"
import { Node as AcornNode } from 'acorn'

export type Visitor = (path?: NodePath) => void

export type Visitors = Record<string, Visitor | {
  enter?: Visitor
  exit?: Visitor
}>

export type AstNode = AcornNode & {
  /** 是否跳过子节点的遍历的标识 */
  __shouldSkip?: boolean
}
