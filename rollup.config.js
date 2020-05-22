import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import pkg from './package.json'
import resolve from '@rollup/plugin-node-resolve'
import sass from 'rollup-plugin-sass'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const name = 'Timeline'

export default {
  input: './src/index.ts',

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external
  external: [],

  plugins: [
    sass({
      output: pkg.css
    }),
    // Allows node_modules resolution
    resolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    // Compile TypeScript/JavaScript files
    babel({ extensions, include: ['src/**/*'] })
  ],

  output: [
    {
      file: pkg.main,
      format: 'iife',
      name,
      strict: false,

      // https://rollupjs.org/guide/en#output-globals-g-globals
      globals: {}
    }
  ]
}
