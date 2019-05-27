

function search_style(category, style, style_id) {
    var style_category = null;
    var id_matched = false;
    style_categories.forEach(function(sc){
        if (id_matched == false && sc['name'] == category) {
            style_category = sc;
        }
        if (style_id != "" && sc['id'].startsWith(style_id)) {
            style_category = sc;
            id_matched = true;
        }
	});

    if (style_category == null) {
        throw new Error("style category not found");
    }

    var matched_style = null;
    id_matched = false;
    style_category.subcategory.forEach(function(st){
        if(id_matched == false && st['name'] == style){
            matched_style = st;
        }
        if (style_id != "" && st['id'].startsWith(style_id)) {
            matched_style = st;
            id_matched = true;
        }
    });

    if (matched_style == null) {
        throw new Error("style not found");
    }

    return {
        "style": matched_style,
        "style_category": style_category,
    };
}


module.exports = {
    search_style: search_style,
};
