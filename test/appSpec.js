/* global describe, it, expect, greet */

define([
    'lodash'
], function(_) {

    describe('just checking', function() {
        it('works for lodash', function() {
            // just checking that _ works
            expect(_.size([1,2,3])).toEqual(3);
        });
    });
});
