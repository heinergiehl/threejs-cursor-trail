// Basic tests that don't require Three.js
describe('Package Structure', () => {
  it('should have correct package name and version', () => {
    const pkg = require('../../package.json');
    expect(pkg.name).toBe('@heinergiehl/threejs-cursor-trail');
    expect(pkg.version).toBe('1.0.0');
  });

  it('should have proper build outputs', () => {
    const fs = require('fs');
    expect(fs.existsSync('./dist/index.esm.js')).toBe(true);
    expect(fs.existsSync('./dist/index.cjs.js')).toBe(true);
    expect(fs.existsSync('./dist/index.umd.js')).toBe(true);
    expect(fs.existsSync('./dist/index.d.ts')).toBe(true);
  });
});