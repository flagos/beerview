
const assert = require('assert');

var app = require('../scripts/bar_chart/bar_chart.js');


it('bar chart abv values', () => {
    assert.equal(app.bar_char_compute_left('abv', 0), 0);
});
