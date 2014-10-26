import _ from 'lodash';

class Foo {
    constructor(data) {
        _(this).extend(_.omit(data, '$$hashkey'));
    }
}

export { Foo };
