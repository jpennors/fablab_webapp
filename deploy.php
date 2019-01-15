<?php
namespace Deployer;
require 'recipe/laravel.php';

// Configuration
set('keep_releases', 3);

set('ssh_type', 'native');
set('ssh_multiplexing', false);

set('repository', 'git@gitlab.utc.fr:smarchie/fablab-webapp.git');
set('writable_use_sudo', false);
set('bin/php', '/opt/plesk/php/7.1/bin/php');
set('bin/composer', '{{bin/php}} /usr/lib/plesk-9.0/composer.phar');
set('bin/npm', function() {
    if(commandExist('npm-cache')) {
        return run('which npm-cache')->toString();
    }

    return run('which npm')->toString();
});

add('shared_files', [ '.env', 'resources/app/env.js' ]);
add('shared_dirs', []);

add('writable_dirs', []);

// Servers
serverList('servers.yml');

// Tasks

desc('Restart PHP-FPM service');
task('php-fpm:restart', function () {
    // The user must have rights for restart service
    // /etc/sudoers: username ALL=NOPASSWD:/bin/systemctl restart php-fpm.service
    run('systemctl restart php-fpm.service');
});
#after('deploy:symlink', 'php-fpm:restart');

task('npm:install', function() {
    run('cd {{release_path}} && {{bin/npm}} install npm');
});

task('gulp', function() {
    run('cd {{release_path}} && node_modules/.bin/gulp');
});

desc('Execute artisan config:clear');
task('artisan:config:clear', function () {
    run('{{bin/php}} {{release_path}}/artisan config:clear');
});

before('deploy:symlink', 'npm:install');

after('npm:install', 'gulp');

// [Optional] if deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');

// Migrate database before symlink new release.

// desc('Execute artisan migrate:fresh');
task('artisan:migrate:fresh', function () {
    run('{{bin/php}} {{release_path}}/artisan migrate:fresh --force');
});

//desc('Execute artisan db:seed');
desc('Execute artisan db:seed');
task('artisan:db:seed', function () {
    $output = run('{{bin/php}} {{release_path}}/artisan db:seed --force');
    writeln('<info>' . $output . '</info>');
});

before('deploy:symlink', 'artisan:migrate:fresh');
after('artisan:migrate:fresh', 'artisan:db:seed');

before('deploy:symlink', 'artisan:config:clear');
