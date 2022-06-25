import { parse } from '@tiny-babel/parser'
import traverse from '@tiny-babel/traverse'

const ast = parse(`
  const a = 1234
  let b = 'abcd'
`, {
  ecmaVersion: 'latest',
  plugins: [
    'literal'
  ]
})

traverse(ast, {
  Identifier: {
    exit(path) {
      console.log('path====', path);
      
      console.log('isVariableDeclaration', path?.isVariableDeclaration());
      
      let curPath = path
      while (curPath) {
        // console.log('curPath.node.type', curPath.node);
        
        curPath = curPath.parentPath
      }
    }
  }
})
