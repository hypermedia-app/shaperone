import p from './package.json' with { type: 'json' }

export default {
  entryPoints: [
    '*.ts',
    'lib/**/*.ts',
    'models/**/*.ts',
  ],
  format: 'esm',
  platform: 'browser',
  outdir: '.',
  bundle: true,
  splitting: true,
  sourcemap: true,
  external: [
    'crypto',
    ...Object.keys(p.dependencies),
  ],
}
