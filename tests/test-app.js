const assert = require('assert');
var app = require('../app.js');


it('bar chart abv values', () => {
    assert.equal(app._test.bar_char_compute_left('abv', 0), 0);
});
