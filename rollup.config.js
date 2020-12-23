import babel from 'rollup-plugin-babel'
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/excel-exporter.ts',
  output: {
    file: 'dist/excel-exporter.js',
    format: 'umd',
    name: 'ExcelExporter',
    globals: {
      'exceljs': 'ExcelJS',
      'file-saver': 'saveAs'
    }
  },
  external: [
    'exceljs',
    'file-saver'
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      exclude: 'node_modules/**'
    }),
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
      extensions: [
        '.js',
        '.ts',
      ],
    })
  ],
  watch: {
    include: 'src/**'
  }
}