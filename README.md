# haohanl.github.io

Well hello there. You've reached the repository for my personal website. 

### How to Push

All pushes to `master` are done through TravisCI. Manual commits to the `master` branch will be lost after automatic compilation by TravisCI. 

The working branch `jekyll` contains site generation resources. All commits within the `jekyll` branch automatically gets compiled by TravisCI and the resulting `_site` folder is committed into `master`.

### How to Run

1. To run this site locally, checkout the `jekyll` branch.
2. `cd` into the project folder.
3. Run `bundle install` then `bundle exec jekyll serve`.

A local server will then start on `127.0.0.1:4000`.

The contents of the `_site` folder contains the files for third-party hosting. 



