import * as _ from 'lodash';

class ExampleCtrl {
    constructor(data) {
        this.exampleData = data;
    }

    someMethod() {
        return 'foo';
    }

    get data() {
        return this.exampleData;
    }
}

function ExampleState($stateProvider) {
    $stateProvider.state('app.example', {
        controller: ExampleCtrl,
        controllerAs: 'Example',
        url: '/example',
        templateUrl: '/example/_example.html'
    });
}

export default ['$stateProvider', ExampleState];
