import { Parser } from 'acorn'

export default function(prevParser: typeof Parser) {
  return class extends prevParser {
    // 解析标识符
    parseLiteral(...args: any[]) {
      // @ts-ignore
      const node = super.parseLiteral(...args)
      
      // 细分标识符类型
      switch (typeof node.value) {
        case 'number':
          node.type = 'NumericLiteral'
          break;
        case 'string':
          node.type = 'StringLiteral'
          break;
        default:
          break;
      }

      return node
    }
  }
}