

function search_style(category, style) {
    var style_category = null;
    style_categories.forEach(function(sc){
        if (sc['name'] == category) {
            style_category = sc;
        }
	});

    if (style_category == null) {
        throw new Error("style category not found");
    }

    matched_style = null;
    style_category.subcategory.forEach(function(st){
        if(st['name'] == style){
            matched_style = st;
        }
    });

    if (matched_style == null) {
        throw new Error("style not found");
    }

    return matched_style;
}


module.exports = {
    search_style: search_style,
};
