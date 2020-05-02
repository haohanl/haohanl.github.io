---
layout: post
date: 2019-05-01 19:45
title: "Optimising a Jekyll Site"
category: 
- jekyll
tag:
- jekyll
---

From the moment this site was first erected upon the mighty pedastal that is GitHub Pages, I got myself a jekyll template and got to work making a neat little personal portfolio. 

Here's what I learnt after a spending day optimising the shoddy state of the template.

<!--more-->

## Pre-optimisation

This my compile time before I began to optimise the site, as logged by running  
`bundle exec jekyll build --profile`.

```text
Filename                     | Count |   Bytes |  Time
-----------------------------+-------+---------+------
_layouts/default.html        |    18 | 117.38K | 0.080
_includes/sidebar.html       |    18 |  34.14K | 0.034
...
_layouts/page.html           |     2 |   3.03K | 0.000
_layouts/error.html          |     1 |   0.06K | 0.000
-----------------------------+-------+---------+------
 TOTAL (for 17 files)        |   106 | 223.31K | 0.744
```


So pre-optimisation, the results were `🐌 0.744s / 🐌🐌 0.664s`. First compile time on the left, subsequent compile time on the right. Might seem quite fast already, but I had a nagging feeling it could be better. 

## Compile Time Optimisation
The process of optimising a jekyll site is quite straight forward, after you finish several hours of research. Good thing I'm here to cut through the nonsense. Make sure to run `bundle install` after updating your `Gemfile`.

All tests are run after cleaning up with `bundle exec jekyll clean`.

### 1. Update `jekyll`
My lord does jekyll 4.0.0 speed up compile. The newest release has plenty of new optimisations and now includes a wonderful caching feature. The only thing you need to do is chuck this bad boy into your `Gemfile`.

```rb
gem "jekyll", "~> 4.0.0"
```

Compile time `⌛ 0.516s / ⌛⌛ 0.301s`. That cache really speeds things up. 

### 2. Install `liquid-c`
The next thing to do is to install a faster version of the liquid template processor. It's written in C this time, so its gotta be _fast_ right? Just as before, throw another gem into your `Gemfile`.

```rb
gem "liquid-c"
```

Compile time `⌛ 0.516s / ⌛⌛ 0.277s`. While the initial compile time didn't show any noticable change, the subsequent runs showed a small amount of improvement. 

Gains will naturally depend on the amount of liquid on your site. From my research, the larger the site the more this would help. Mine is quite small right now.


### 3. Replace `kramdown` with `commonmark`
From my testing, kramdown is _adequate_, but not the fastest in the compile time drag race. Here is where [commonmark](https://github.com/jekyll/jekyll-commonmark) leaves the competition in the dust.

Do note however that commonmark doesnt support block attributes like `{:target="_blank"}`. HTML tags will need to be used instead if you really went wild with block attributes. 

I went with the GitHub Pages version of commonmark, [jekyll-commonmark-ghpages](https://github.com/github/jekyll-commonmark-ghpages). This will sanitize your markdown according to the GitHub Pages spec. Things like `iframe` tags will break, but I wasn't planning on using those anyway. 

I dropped the following into my `Gemfile`.

```rb
gem "jekyll-commonmark-ghpages"
```

And added the following to my `_config.yml`.
```yml
commonmark:
    options: ["SMART", "FOOTNOTES"]
    extensions: ["strikethrough", "autolink", "table", "tagfilter"]
```

Compile time `⌛ 0.332s / ⌛⌛ 0.255s`. An amazing improvement. Time to optimise other aspects


## HTML Output Optimisation
I was curious to see what the converted HTML of my site looked like, and I nearly gagged. Here's just a small excerpt.

```html
            <main class="the-content" role="main">
                <div class="search" role="search">
    <div>
        <div class="show-results-count">0 Results</div>
        <div class="search-holder">
            <input type="text" id="search-input" />
        </div>
    </div>
    <ul id="results-container" class="results-container"></ul>
</div>
```

Apparently indents went right out the window and we've scorched the Geneva convention. This is a crime against humanity. 

### 1. Install `jekyll-tidy`
Here's how you fix the warcrime shown above. Install a handy little gem called [jekyll-tidy](https://github.com/apsislabs/jekyll-tidy) into your `Gemfile`.

```rb
gem "jekyll-tidy"
```

Immediately after recompiling, every is right in the world once more. It's truly beautiful. 

```html
<main class="the-content" role="main">
    <div class="search" role="search">
        <div>
            <div class="show-results-count">0 Results</div>
            <div class="search-holder">
                <input type="text" id="search-input"/>
            </div>
        </div>
        <ul id="results-container" class="results-container"></ul>
    </div>
```

Compile time `🔥 0.294s / 🔥🔥 0.267s`. First compile time also dropped as a side effect, though there is now a little bit more overhead on subsequent compiles. 


### 2. Optional Minification
It was at this point I discovered jekyll-tidy has a compression setting. Given GitHub Pages has limited bandwidth, I though this could be potentially useful. Add the following to your `_config.yml` to enable this setting.

```yml
jekyll_tidy:
    compress_html: true
```

After recompiling, my pages became one huge block of raw unfiltered hatred in HTML form. Good thing I'm not the browser interpreting this.

```html
<main class="the-content" role="main"> <div class="search" role="search"> <div> <div class="show-results-count">0 Results</div> <div class="search-holder"> <input type="text" id="search-input"/> </div> </div> <ul id="results-container" class="results-container"></ul> </div>
```

Compile time `⌛ 0.386s / ⌛⌛ 0.367s`. Minifying a whole site definitely adds to the compile time, but it does _slightly_ improve site responsiveness in a _not at all scientific_ side to side comparison. I won't be using this feature in deployment however. 


### 3. Exclude `jekyll-tidy` from Javascript

I did discover that jekyll-tidy broke some of my javascript. To fix that issue, my `_config.yml` contains the following.
```yml
jekyll_tidy:
    exclude: ["assets/js/*"]
    compress_html: false
```

There is negligle impact from doing this in regards to compile time.

## Post Optimisation
After optimising my site, my compile time went from `🐌 0.744s / 🐌🐌 0.664s` to a blazing fast `🔥 0.294s / 🔥🔥 0.267s`. That is a **2.5x** improvement in site compile times. As an added bonus, my output HTML doesn't look like absolute trash. 

That's me done for the evening. Peace.
