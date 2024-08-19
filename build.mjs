import fs from 'node:fs';
import { build } from 'esbuild';

import packageJson from './package.json' assert { type: 'json' };

function getExternalDependencies(allow = []) {
    const deps = packageJson.dependencies ? Object.keys(packageJson.dependencies).filter(dep => !allow.includes(dep)) : [];
    const devDeps = packageJson.devDependencies ? Object.keys(packageJson.devDependencies).filter(dep => !allow.includes(dep)) : [];
    const peerDeps = packageJson.peerDependencies ? Object.keys(packageJson.peerDependencies).filter(dep => !allow.includes(dep)) : [];
    return [...deps, ...devDeps, ...peerDeps];
}

async function buildModule() {
    const shared = {
        platform: 'node',
        entryPoints: ['source/index.ts'],
        bundle: true,
        minify: true,
        treeShaking: true,
        sourcemap: true,
        external: getExternalDependencies()
    };

    await build({
        ...shared,
        outfile: 'bundled/lib/commonjs/index.js',
        format: 'cjs'
    });

    await build({
        ...shared,
        outfile: 'bundled/lib/esm/index.esm.js',
        format: 'esm'
    });
}

function generateCommonjsPackageJson() {
    const packageJsonCommonJs = JSON.stringify({ ...packageJson, type: undefined }, null, 2);
    fs.writeFileSync('./bundled/lib/commonjs/package.json', packageJsonCommonJs);
}

await buildModule();
generateCommonjsPackageJson();