
const assert = require('assert');

var app = require('../bar_chart.js');


it('bar chart: abv min values', () => {
    assert.equal(app.bar_char_compute_left('abv', 0), 0);
});

it('bar chart: abv max values', () => {
    assert.equal(app.bar_char_compute_left('abv', 20), 150);
});

it('bar chart: abv median values', () => {
    assert.equal(app.bar_char_compute_left('abv', 10), 75);
});

it('bar chart: unsupported type', () => {
    assert.throws(function () {app.bar_char_compute_left('crap', 0);}, Error, "type not supported");
});
