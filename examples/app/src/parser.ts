console.log('app start =========');

import { parse } from '@tiny-babel/parser'

const ast = parse(`
  const a = 1234
  let b = 'abcd'
`, {
  ecmaVersion: 'latest',
  plugins: [
    'literal'
  ]
})

console.log('ast',JSON.stringify(ast, null, 2));

