import { readFileSync } from 'node:fs';
import terser from '@rollup/plugin-terser';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const banner = `/* tripledollar v${pkg.version}, (c) ${new Date().getFullYear()} Steen Klingberg. License MIT. */`;

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/tripledollar.js',
      format: 'es',
      banner,
      sourcemap: true
    }
  },
  {
    input: 'src/global.js',
    output: {
      file: 'dist/tripledollar.min.js',
      format: 'iife',
      name: '$$$',
      exports: 'default',
      banner,
      sourcemap: true
    },
    plugins: [
      terser({
        format: {
          comments: /tripledollar/
        }
      })
    ]
  }
];
