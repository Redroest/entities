Package.describe({
    name: 'cloudspider:entities',
    version: '0.4.1',
    summary: 'Allows simple publications and actions with other datasources (like Rest)',
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
        'aldeed:simple-schema@=1.5.3',
        'aldeed:collection2@=2.9.1',
        'aldeed:autoform@=5.8.1',
        'alanning:roles@=1.2.15'
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
