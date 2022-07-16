import { parse } from '@tiny-babel/parser';
import traverse from '@tiny-babel/traverse';
import generator from '@tiny-babel/generator';

const sourceCode = `
const a = 1234
let b = 4321
`;

const ast = parse(sourceCode, {
  ecmaVersion: 'latest',
  plugins: ['literal'],
});

console.log('==========');
console.log('code1', JSON.stringify(ast, null, 2));
console.log('==========');

traverse(ast, {
  Identifier: {
    exit(path) {
      let curPath = path;
      while (curPath) {
        // console.log('curPath.node.type', curPath.node);

        curPath = curPath.parentPath;
      }
    },
  },
  Program(path) {
    console.log('path', path);
  },
});

console.log('==========');
console.log('code2', JSON.stringify(ast, null, 2));
console.log('==========');

console.log('generator', generator(ast, sourceCode, 'foo.js'));
