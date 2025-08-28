// import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: `src/index.ts`,
  output: [
    {
      file: 'konva.js',
      name: 'Konva',
      format: 'umd',
      sourcemap: false,
      freeze: false,
      globals: {
        'pixi.js': 'PIXI', // Tell UMD that `pixi.js` is available as `PIXI`
      },
    },
    // { file: pkg.module, format: 'es', sourcemap: true }
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ['pixi.js'],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    // json(),
    // Compile TypeScript files
    typescript({
      useTsconfigDeclarationDir: true,
      abortOnError: false,
      removeComments: false,
      tsconfigOverride: {
        compilerOptions: {
          module: 'ES2020',
        },
      },
    }),

    // resolve(), // Allows Rollup to find modules in node_modules
    // commonjs()
    // // Allow node_modules resolution, so you can use 'external' to control
    // // which external modules to include in the bundle
    // // https://github.com/rollup/rollup-plugin-node-resolve#usage
    // resolve(),

    // Resolve source maps to the original source
    // sourceMaps()
  ],
};
