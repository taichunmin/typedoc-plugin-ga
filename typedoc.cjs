module.exports = {
    entryPoints: [
        './source/index.ts'
    ],
    name: 'typedoc-plugin-ga',
    navigationLinks: {
        'Github': 'https://github.com/euberdeveloper/typedoc-plugin-ga'
    },
    excludeExternals: true,
    includeVersion: true,
    tsconfig: 'source/tsconfig.json',
    gaID: process.env.GA_TOKEN,
    excludePrivate: true,
    excludeProtected: true,
    disableSources: true,
    out: './docs/documentation/html'
};