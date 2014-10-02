# app template


Boilerplate for my Angular apps

## Project Structure

```
├── app/
│   ├── assets/
│   │   ├── stylesheets/
│   │   ├── img/
│   │   │   ├── png
│   │   │   ├── svg
|   |   |   |
│   ├── bower_components/
│   ├── common/
│   |   ├── directives.js
│   |   ├── filter.js
│   |   ├── services.js
│   ├── module-foo/
|   │   ├── submodule-baz/
|   |   |   |── _submodule-baz.html
|   |   |   |── _submodule-baz.scss
|   |   |   |── submodule-baz.js
|   |   |── module-foo.js
|   |   |── _module-foo.html
|   |   |── _module-foo.scss
|   |   |── directives.js
|   |   |── services.js
│   ├── module-bar/
|   |   |── _module-bar.html
|   |   |── _module-bar.scss
|   |   |── module-bar.js
|   |── app.js
|   |── app.scss
|   |── config.js
│   |── index.html
.bowerrc
.editorconfig
.gitignore
.jsbeautifyrc
.jshintrc
bower.json
gulpfile.js
LICENSE
package.json
README.md
```

### General
- The project utilizes a fractal pattern

### JavaScript
- Each module should be totally self-contained. Any functionality shared across modules should be moved into `common/`.
- Modules can have their own directives, services, filters, etc. If multiple files are needed in order to maintain file size,
a folder should be created (`directives/`, `services/`, etc) and the broken up files should be placed into their respective folders
with less abstract naming conventions.
- JavaScript files should always be as close as possible - preferably on the same level - as their HTML partials.
- If a directive has a partial - which they tend to - a new folder should be created that is named accordingly (meaning not something generic)
and the HTML partial and the JavaScript file should be placed together in that folder.

### Sass
- `app.scss` is merely a table of contents. There should be no Sass in the file.
- Each module is responsible for exporting its submodules. In other words, `app.scss` should only import top level modules.
- Sass that needs to be shared among modules should be moved into `assets/stylesheets/`.

### Modules

A typical module will look something like this:

```javascript
(function() {
    'use strict';

    var moduleName = 'foo',

        angularDependencies = [
            'ui.router',
            'foo.services',
            'foo.directives',
            'common.filters'
        ];

    define([
        'require',
        'angular',
        'lodash',
        'ui.router',
        './services',
        './directives',
        'common/filters'
    ], function(require, angular, _) {

        var module = angular.module(moduleName, angularDependencies);

        module.config(['$stateProvider',
            function($stateProvider) {

                $stateProvider.state('app.foo', {
                    url: '/foo',
                    controller: 'FooCtrl'
                    templateUrl: require.toUrl('./_foo.html')
                });
            }
        ]);

        module.controller('FooCtrl', ['$scope', 'items', 'otherItems',
            function($scope, items, otherItems) {
                $scope.items = items;
                $scope.otherItems = otherItems;

                $scope.doSomething = function() {
                    // stuff
                };
            }
        ]);

        return module;
    });
})();
```

- Modules are wrapped in IIFEs.
- `require.js` is used to generate urls to the templates, so you don't have to.
- Top level modules should import all of their submodules.
- `app.js` should only import top level modules.
- `r.js` is used to build all the JavaScript into one file.
