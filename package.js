Package.describe({
    name: 'cloudspider:entities',
    version: '0.4.1',
    summary: 'Allows simple publications and actions to and from from different datasources then mongodb (like Rest)',
    git: 'https://github.com/Redroest/entities',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.3.1');
    api.use([
        'check',
        'mongo',
        'templating',
        'ecmascript',
        'aldeed:simple-schema',
        'aldeed:collection2',
        'aldeed:autoform',
        'alanning:roles'
    ]);

    api.mainModule('common/entity.js', ['client', 'server']);

    api.addFiles([
        'server/entity.js',
        'server/rest.js',
        'server/seeder.js'
    ], 'server');

    api.addFiles([
        'client/entity.js'
    ], 'client');

    api.export(['Seeder', 'Entity', 'RestEntity'], 'server');
});
