
function bar_char_compute_left(type, value) {

    var width = 150;
    var ranges = {
        'srm': [0, 100],
        'abv': [0, 20],
        'ibu': [0, 200],
        'og': [1, 1.3],
        'fg': [1, 1.1],
        'buToGu': [0, 1.4],
    };

    if (! type in ranges) {
        throw "type not supported";
    }

    if (value <= ranges[type][0]) {
        return 0;
    }
    if (value >= ranges[type][1]) {
        return width;
    }
    return ((value - ranges[type][0])/(ranges[type][1] - ranges[type][0])) * width;
}

module.exports = {
    bar_char_compute_left: bar_char_compute_left
};
