import { parse } from '@tiny-babel/parser';
import traverse from '@tiny-babel/traverse';
import generator from '@tiny-babel/generator';

const sourceCode = `
const c = 1;
const d = 2;
const e = 4;

function add(a, b) {
    const tmp = 1;
    return a + b;
}

add(c, d);
`;

const ast = parse(sourceCode, {
  ecmaVersion: 'latest',
  plugins: ['literal'],
});

traverse(ast, {
  Program(path) {
    console.log('================================');
    console.log('Program.scope', path.scope);
    console.log('================================');

    Object.entries(path.scope.bindings).forEach(([id, binding]) => {
      if (!binding.referenced) {
        binding.path.remove();
      }
    });
  },
  FunctionDeclaration(path) {
    console.log('================================');
    console.log('FunctionDeclaration.scope', path.scope);
    console.log('================================');

    Object.entries(path.scope.bindings).forEach(([id, binding]) => {
      if (!binding.referenced) {
        binding.path.remove();
      }
    });
  },
});

console.log('ast', JSON.stringify(ast, null, 2));

console.log('generator', generator(ast, sourceCode, 'foo.js'));
