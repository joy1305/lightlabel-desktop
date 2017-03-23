'use strict';

var Q = require('q');
var pathUtil = require('path');
var childProcess = require('child_process');
var utils = require('./utils');
var gulpPath = pathUtil.resolve('./node_modules/.bin/gulp');
var runBuild = function () {
    var deferred = Q.defer();

    var build = childProcess.spawn(gulpPath, [
        'build',
        '--env=' + utils.getEnvName(),
        '--color'
    ], {
        stdio: 'inherit'
    });

    build.on('close', function (code) {
        deferred.resolve();
    });

    return deferred.promise;
};

runBuild();
