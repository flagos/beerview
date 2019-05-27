style_categories = [
    {
        "id": "1",
        "revision": {
            "number": "1",
            "$t": "2015"
        },
        "name": "Standard American Beer",
        "notes": "This category describes everyday American beers that have a wide public appeal. Containing both ales and lagers, the beers of this category are not typically complex, and have smooth, accessible flavors. The ales tend to have lager-like qualities, or are designed to appeal to mass-market lager drinkers as crossover beers. Mass-market beers with a more international appeal or origin are described in the International Lager category.",
        "subcategory": [
            {
                "id": "1A",
                "name": "American Light Lager",
                "impression": "Highly carbonated, very light-bodied, nearly flavorless lager designed to be consumed very cold. Very refreshing and thirst quenching.",
                "aroma": "Low to no malt aroma, although it can be perceived as grainy, sweet, or corn-like if present. Hop aroma is light to none, with a spicy or floral hop character if present. While a clean fermentation character is desirable, a light amount of yeast character (particularly a light apple fruitiness) is not a fault. Light DMS is not a fault.",
                "appearance": "Very pale straw to pale yellow color. White, frothy head seldom persists. Very clear.",
                "flavor": "Relatively neutral palate with a crisp and dry finish and a low to very low grainy or corn-like flavor that might be perceived as sweetness due to the low bitterness. Hop flavor ranges from none to low levels, and can have a floral, spicy, or herbal quality (although rarely strong enough to detect). Low to very low hop bitterness. Balance may vary from slightly malty to slightly bitter, but is relatively close to even. High levels of carbonation may accentuate the crispness of the dry finish. Clean lager fermentation character.",
                "mouthfeel": "Very light (sometimes watery) body. Very highly carbonated with slight carbonic bite on the tongue.",
                "comments": "Designed to appeal to as broad a range of the general public as possible. Strong flavors are a fault.",
                "history": "Coors briefly made a light lager in the early 1940s. Modern versions were first produced by Rheingold in 1967 to appeal to diet-conscious drinkers, but only became popular starting in 1973 after Miller Brewing acquired the recipe and marketed the beer heavily to sports fans with the “tastes great, less filling” campaign. Beers of this genre became the largest sellers in the United States in the 1990s.",
                "ingredients": "Two- or six-row barley with high percentage (up to 40%) of rice or corn as adjuncts. Additional enzymes can further lighten the body and lower carbohydrates.",
                "comparison": "A lighter-bodied, lower-alcohol, lower calorie version of an American Lager. Less hop character and bitterness than a Leichtbier.",
                "examples": [
                    "Bud Light",
                    "Coors Light",
                    "Keystone Light",
                    "Michelob Light",
                    "Miller Lite",
                    "Old Milwaukee Light"
                ],
                "tags": [
                    "session-strength",
                    "pale-color",
                    "bottom-fermented",
                    "lagered",
                    "north-america",
                    "traditional-style",
                    "pale-lager-family",
                    "balanced"
                ],
                "stats": {
                    "og": {
                        "flexible": "false",
                        "low": "1.028",
                        "high": "1.040"
                    },
                    "fg": {
                        "flexible": "false",
                        "low": "0.998",
                        "high": "1.008"
                    },
                    "ibu": {
                        "flexible": "false",
                        "low": "8",
                        "high": "12"
                    },
                    "srm": {
                        "flexible": "false",
                        "low": "2",
                        "high": "3"
                    },
                    "abv": {
                        "flexible": "false",
                        "low": "2.8",
                        "high": "4.2"
                    }
                }
            },
            {
                "id": "1B",
                "name": "American Light Something Else",
            }

        ]
    }
];


const assert = require('assert');

var app = require('../style_parser.js');


it('style parser: style exists', () => {
    matched_style = app.search_style("Standard American Beer", "American Light Lager", "");
    assert.equal(matched_style['id'], '1A');
});

it('style parser: category exists but style not found', () => {
    assert.throws(function () {app.search_style("Standard American Beer", "American Light Shit", "");}, Error, "style not found");
});

it('style parser: category does not exists but style does', () => {
    assert.throws(function () {app.search_style("Standard American Shit", "American Light Lager", "");}, Error, "style not found");
});

it('style parser: category exists and given style is a prefix of what exists', () => {
    assert.throws(function () {app.search_style("Standard American Beer", "American Light ", "");}, Error, "style not found");
});

it('style parser: category is a prefix of what exists and style exists', () => {
    assert.throws(function () {app.search_style("Standard American ", "American Light Lager", "");}, Error, "style not found");
});

it('style parser: style exists with correct id', () => {
    matched_style = app.search_style("Standard American Beer", "American Light Lager", "1A");
    assert.equal(matched_style['id'], '1A');
});

it('style parser: style id over style names', () => {
    matched_style = app.search_style("Standard American Beer", "American Light Something Else", "1A");
    assert.equal(matched_style['id'], '1A');
});

it('style parser: style exists with uncorrect id', () => {
    matched_style = app.search_style("Standard American Beer", "American Light Lager", "2B");
    assert.equal(matched_style['id'], '1A');
});
