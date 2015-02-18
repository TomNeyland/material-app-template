import angular from 'angular';
import 'angular-ui-router';

import ExampleState from './example';

angular.module('example', [
    'ui.router'
])

.config(ExampleState);
