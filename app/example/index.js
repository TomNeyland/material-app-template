import * as angular from 'angular';
import 'angular-ui-router';

import default as ExampleState from './example';

angular.module('example', [
    'ui.router'
])

.config(ExampleState);
