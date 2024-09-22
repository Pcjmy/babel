const { transformSync } = require("@babel/core");

const sourceCode = `
 function getAge(){
   var age = 12;
   console.log(age);
   var name = 'zhufeng';
   console.log(name);
 }
 `;
//压缩其实就是把变量从有意义变成无意义，尽可能的短_、a、b
const uglifyPlugin = () => {
  return {
    visitor: {
      //这是一个别名，用于捕获所有作用域节点：函数、类的函数、函数表达式、语句快、if else 、while、for
      Scopable(path) {
        //path.scope.bindings 取出作用域内的所有变量
        //取出后进行重命名
        // console.log(path.scope.bindings);
        Object.entries(path.scope.bindings).forEach(([key, binding]) => {
          console.log('key=', key);
          const newName = path.scope.generateUid(); //在当前作用域内生成一个新的uid，并且不会和任何本地定义的变量冲突的标识符
          binding.path.scope.rename(key, newName);
        });
      },
    },
  };
};

const { code } = transformSync(sourceCode, {
  plugins: [uglifyPlugin()],
});

console.log(code);
