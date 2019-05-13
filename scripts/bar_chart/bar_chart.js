
function bar_char_compute_left(type, value) {

    var width = 150;
    var ranges = {
        'abv': [0, 20],
    };

    if (value < ranges[0]) {
        return 0;
    }
    if (value > ranges[1]) {
        return width;
    }
    return ((value - ranges[0])/width);
}

module.exports = {
    bar_char_compute_left: bar_char_compute_left
};
