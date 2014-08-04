/* global module */
'use strict';

var pkg = require('../package');

module.exports = {
    appDir: 'app',
    buildDir: 'build',

    server: {
        port: 8000,
        url: 'http://localhost:'
    },

    files: {
        html: [
            'app/**/*.html',
            '!app/bower_components/**/*.html',
            '!index.html'
        ],

        js: [
            'gulpfile.js',
            'app/**/*.js',
            '!app/bower_components/**/*.js',
            '!app/templates.js'
        ],

        jsTests: [
            'gulpfile.js',
            'app/**/*.js',
            '!app/bower_components/**/*.js',
            'app/tests/**/*.js'
        ],

        sass: {
            files: [
                'app/**/*.scss',
                '!app/bower_components/**/*.scss'
            ],
            src: 'app/app.scss',
            devDest: 'app/app.css',
            buildDest: 'build/app.css'
        },

        ignore: [
            'app/tests/**/*.js',
            'app/bower_components/**'
        ]
    }
};
