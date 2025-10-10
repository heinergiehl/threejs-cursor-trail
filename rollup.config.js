import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { dts } from 'rollup-plugin-dts';
import fs from 'fs';

const external = ['three', 'gsap', 'lil-gui'];

// Custom plugin to handle GLSL files
const glslPlugin = () => ({
  name: 'glsl',
  load(id) {
    if (id.includes('?raw')) {
      const actualId = id.replace('?raw', '');
      try {
        const content = fs.readFileSync(actualId, 'utf8');
        return `export default ${JSON.stringify(content)};`;
      } catch (err) {
        console.warn(`Could not load GLSL file: ${actualId}`);
        return `export default "";`;
      }
    }
    return null;
  }
});

const plugins = [
  nodeResolve(),
  commonjs(),
  glslPlugin(),
  typescript({
    tsconfig: './tsconfig.json',
    exclude: ['**/*.test.ts', '**/*.spec.ts', 'demo/**/*', 'examples/**/*'],
    compilerOptions: {
      declaration: false,
      strict: false // Disable strict mode for build to avoid warnings as errors
    }
  })
];

export default defineConfig([
  // ES Module build
  {
    input: 'src/index.ts',
    external,
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    plugins
  },
  
  // CommonJS build
  {
    input: 'src/index.ts',
    external,
    output: {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    plugins
  },
  
  // UMD build (for CDN usage)
  {
    input: 'src/index.ts',
    external: ['three'], // Only Three.js as external for UMD
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'ThreeJSCursorTrail',
      globals: {
        three: 'THREE'
      },
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      glslPlugin(),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.ts', '**/*.spec.ts', 'demo/**/*', 'examples/**/*'],
        compilerOptions: {
          declaration: false,
          strict: false
        }
      })
    ]
  },
  
  // Type definitions
  {
    input: 'src/index.ts',
    external,
    output: {
      file: 'dist/index.d.ts',
      format: 'esm'
    },
    plugins: [
      dts({
        tsconfig: './tsconfig.json'
      })
    ]
  }
]);