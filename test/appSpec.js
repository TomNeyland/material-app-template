/* global describe, it, expect, greet */

define([
    'lodash'
], function(_) {

    describe('Checking lodash', function() {
        it('works for size', function() {
            // just checking that _ works
            expect(_.size([1,2,3])).toEqual(3);
        });
    });
});
