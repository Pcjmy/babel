import Babel from '@babel/core'
import template from '@babel/template' // 使用它来将代码批量生成节点
import fs from 'node:fs'

const file = fs.readFileSync('./test1.js', 'utf8')

function babelPlugintryCatch({ types: t }) {
  return {
    visitor: {
      FunctionDeclaration: {
        enter(path) {
          /**
           * 1. 获取当前函数体
           * 2. 如果是async函数，则创建tryCatch并将原函数内容放到try体内
           * 3. 替换原函数
          */
          // 1. 获取当前函数节点信息
          const { params, generator, async, id, body } =path.node;
          // 如果是async，则执行替换
          if (async) {
            // 生成 console.log(error) 的节点数据
            const catchHandler = template.statement('console.log(error)')();
            // 创建trycatch节点，并把原函数体内的代码放到try{}中，把刚刚生成的catchHandler放到catch体内
            const tryStatement = t.tryStatement(body, t.catchClause(t.identifier('error'), t.BlockStatement([catchHandler])));
            // 创建一个新的函数节点并替换原节点
            path.replaceWith(t.functionDeclaration(id, params, t.BlockStatement([tryStatement]), generator, async))
            // 跳过当前节点，否则会重新进入当前节点
            path.skip();
          }
        }
      }
    }
  }
}

const result = Babel.transform(file, {
  plugins: [
      babelPlugintryCatch
  ]
})

console.log(result.code)
