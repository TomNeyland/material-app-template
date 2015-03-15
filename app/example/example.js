import * as _ from 'lodash';

class Example {
    constructor(data) {
        this.exampleData = data;
        console.log(this);
    }

    someMethod() {
        return _.map(this.exampleData, function(data) {
            return (data * 2);
        });
    }

    get data() {
        return this.exampleData;
    }
}

function ExampleState($stateProvider) {
    $stateProvider.state('app.example', {
        controller: ['data', Example],
        controllerAs: 'Example',
        url: '/example',
        template: require('./_example.html'),
        resolve: {
            data: [function() {
                return [1, 2, 3, 4, 5, 6];
            }]
        }
    });
}

export default ['$stateProvider', ExampleState];
