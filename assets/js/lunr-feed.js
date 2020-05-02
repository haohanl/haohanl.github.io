var hostname = "";
var index = lunr(function () {
    this.field('title')
    this.field('content', {boost: 10})
    this.field('category')
    this.field('tags')
    this.ref('id')
});



    index.add({
      title: "Optimising a Jekyll Site",
      category: ["jekyll"],
      content: "From the moment this site was first erected upon the mighty pedastal that is GitHub Pages, I got myself a jekyll template and got to work making a neat little personal portfolio.\nHere’s what I learnt after a spending day optimising the shoddy state of the template.\n\nPre-optimisation\nThis my compile time before I began to optimise the site, as logged by running\nbundle exec jekyll build --profile.\nFilename                     | Count |   Bytes |  Time\n-----------------------------+-------+---------+------\n_layouts/default.html        |    18 | 117.38K | 0.080\n_includes/sidebar.html       |    18 |  34.14K | 0.034\n...\n_layouts/page.html           |     2 |   3.03K | 0.000\n_layouts/error.html          |     1 |   0.06K | 0.000\n-----------------------------+-------+---------+------\n TOTAL (for 17 files)        |   106 | 223.31K | 0.744\n\nSo pre-optimisation, the results were 🐌 0.744s / 🐌🐌 0.664s. First compile time on the left, subsequent compile time on the right. Might seem quite fast already, but I had a nagging feeling it could be better.\nCompile Time Optimisation\nThe process of optimising a jekyll site is quite straight forward, after you finish several hours of research. Good thing I’m here to cut through the nonsense. Make sure to run bundle install after updating your Gemfile.\nAll tests are run after cleaning up with bundle exec jekyll clean.\n1. Update jekyll\nMy lord does jekyll 4.0.0 speed up compile. The newest release has plenty of new optimisations and now includes a wonderful caching feature. The only thing you need to do is chuck this bad boy into your Gemfile.\ngem \"jekyll\", \"~&gt; 4.0.0\"\n\nCompile time ⌛ 0.516s / ⌛⌛ 0.301s. That cache really speeds things up.\n2. Install liquid-c\nThe next thing to do is to install a faster version of the liquid template processor. It’s written in C this time, so its gotta be fast right? Just as before, throw another gem into your Gemfile.\ngem \"liquid-c\"\n\nCompile time ⌛ 0.516s / ⌛⌛ 0.277s. While the initial compile time didn’t show any noticable change, the subsequent runs showed a small amount of improvement.\nGains will naturally depend on the amount of liquid on your site. From my research, the larger the site the more this would help. Mine is quite small right now.\n3. Replace kramdown with commonmark\nFrom my testing, kramdown is adequate, but not the fastest in the compile time drag race. Here is where commonmark leaves the competition in the dust.\nDo note however that commonmark doesnt support block attributes like {:target=&quot;_blank&quot;}. HTML tags will need to be used instead if you really went wild with block attributes.\nI went with the GitHub Pages version of commonmark, jekyll-commonmark-ghpages. This will sanitize your markdown according to the GitHub Pages spec. Things like iframe tags will break, but I wasn’t planning on using those anyway.\nI dropped the following into my Gemfile.\ngem \"jekyll-commonmark-ghpages\"\n\nAnd added the following to my _config.yml.\ncommonmark:\n    options: [\"SMART\", \"FOOTNOTES\"]\n    extensions: [\"strikethrough\", \"autolink\", \"table\", \"tagfilter\"]\n\nCompile time ⌛ 0.332s / ⌛⌛ 0.255s. An amazing improvement. Time to optimise other aspects\nHTML Output Optimisation\nI was curious to see what the converted HTML of my site looked like, and I nearly gagged. Here’s just a small excerpt.\n            &lt;main class=\"the-content\" role=\"main\"&gt;\n                &lt;div class=\"search\" role=\"search\"&gt;\n    &lt;div&gt;\n        &lt;div class=\"show-results-count\"&gt;0 Results&lt;/div&gt;\n        &lt;div class=\"search-holder\"&gt;\n            &lt;input type=\"text\" id=\"search-input\" /&gt;\n        &lt;/div&gt;\n    &lt;/div&gt;\n    &lt;ul id=\"results-container\" class=\"results-container\"&gt;&lt;/ul&gt;\n&lt;/div&gt;\n\nApparently indents went right out the window and we’ve scorched the Geneva convention. This is a crime against humanity.\n1. Install jekyll-tidy\nHere’s how you fix the warcrime shown above. Install a handy little gem called jekyll-tidy into your Gemfile.\ngem \"jekyll-tidy\"\n\nImmediately after recompiling, every is right in the world once more. It’s truly beautiful.\n&lt;main class=\"the-content\" role=\"main\"&gt;\n    &lt;div class=\"search\" role=\"search\"&gt;\n        &lt;div&gt;\n            &lt;div class=\"show-results-count\"&gt;0 Results&lt;/div&gt;\n            &lt;div class=\"search-holder\"&gt;\n                &lt;input type=\"text\" id=\"search-input\"/&gt;\n            &lt;/div&gt;\n        &lt;/div&gt;\n        &lt;ul id=\"results-container\" class=\"results-container\"&gt;&lt;/ul&gt;\n    &lt;/div&gt;\n\nCompile time 🔥 0.294s / 🔥🔥 0.267s. First compile time also dropped as a side effect, though there is now a little bit more overhead on subsequent compiles.\n2. Optional Minification\nIt was at this point I discovered jekyll-tidy has a compression setting. Given GitHub Pages has limited bandwidth, I though this could be potentially useful. Add the following to your _config.yml to enable this setting.\njekyll_tidy:\n    compress_html: true\n\nAfter recompiling, my pages became one huge block of raw unfiltered hatred in HTML form. Good thing I’m not the browser interpreting this.\n&lt;main class=\"the-content\" role=\"main\"&gt; &lt;div class=\"search\" role=\"search\"&gt; &lt;div&gt; &lt;div class=\"show-results-count\"&gt;0 Results&lt;/div&gt; &lt;div class=\"search-holder\"&gt; &lt;input type=\"text\" id=\"search-input\"/&gt; &lt;/div&gt; &lt;/div&gt; &lt;ul id=\"results-container\" class=\"results-container\"&gt;&lt;/ul&gt; &lt;/div&gt;\n\nCompile time ⌛ 0.386s / ⌛⌛ 0.367s. Minifying a whole site definitely adds to the compile time, but it does slightly improve site responsiveness in a not at all scientific side to side comparison. I won’t be using this feature in deployment however.\n3. Exclude jekyll-tidy from Javascript\nI did discover that jekyll-tidy broke some of my javascript. To fix that issue, my _config.yml contains the following.\njekyll_tidy:\n    exclude: [\"assets/js/*\"]\n    compress_html: false\n\nThere is negligle impact from doing this in regards to compile time.\nPost Optimisation\nAfter optimising my site, my compile time went from 🐌 0.744s / 🐌🐌 0.664s to a blazing fast 🔥 0.294s / 🔥🔥 0.267s. That is a 2.5x improvement in site compile times. As an added bonus, my output HTML doesn’t look like absolute trash.\nThat’s me done for the evening. Peace.\n",
      tags: ["jekyll"],
      id: 0
    });
    

    index.add({
      title: "Introductions",
      category: ["fluff"],
      content: "Oh wow would you look at that. There’s a website here now.\nFeel free to check back every-so-often and there’s a non-zero chance that there may be something new to see.\nIn the meantime, feel free to click around and see if anything breaks.\n",
      tags: ["fluff"],
      id: 1
    });
    


var store = [{
    "title": "Optimising a Jekyll Site",
    "link": "/jekyll/optimising-jekyll.html",
    "image": null,
    "date": "May 1, 2019",
    "category": ["jekyll"],
    "excerpt": "From the moment this site was first erected upon the mighty pedastal that is GitHub Pages, I got myself a..."
},{
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