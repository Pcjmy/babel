import Babel from '@babel/core'
import presetEnv from '@babel/preset-env'
import fs from 'node:fs'
import react from '@babel/preset-react'
const file = fs.readFileSync('./app.jsx', 'utf8')
const result = Babel.transform(file, {
    presets: [
        [presetEnv, { useBuiltIns: "usage", corejs: 3 }],
        react
    ]
})
console.log(result.code)
