var hostname = "";
var index = lunr(function () {
    this.field('title')
    this.field('content', {boost: 10})
    this.field('category')
    this.field('tags')
    this.ref('id')
});



    index.add({
      title: "Introductions",
      category: ["fluff"],
      content: "Oh wow would you look at that. There’s a website here now.\nFeel free to check back every-so-often and there’s a non-zero chance that there may be something new to see.\nIn the meantime, feel free to click around and see if anything breaks.\n",
      tags: ["fluff"],
      id: 0
    });
    


var store = [{
    "title": "Introductions",
    "link": "/fluff/introductions.html",
    "image": null,
    "date": "April 19, 2019",
    "category": ["fluff"],
    "excerpt": "Oh wow would you look at that. There’s a website here now. Feel free to check back every-so-often and there’s..."
}]

$(document).ready(function() {
    $('#search-input').on('keyup', function () {
        var resultdiv = $('#results-container');
        if (!resultdiv.is(':visible'))
            resultdiv.show();
        var query = $(this).val();
        var result = index.search(query);
        resultdiv.empty();
        $('.show-results-count').text(result.length + ' Results');
        for (var item in result) {
            var ref = result[item].ref;
            var searchitem = '<li><a href="'+ hostname + store[ref].link+'">'+store[ref].title+'</a></li>';
            resultdiv.append(searchitem);
        }
    });
});