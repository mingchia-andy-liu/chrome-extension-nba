#!/bin/sh

set -e

rm -rf node_modules

git stash -u

# install
npm install

# test
# npm run lint:js

# bundle the main.js and background.js
npm run webpack
npm run webpack:bg
npm run webpack:popup

# build the release zip
npm run build

git stash pop

# validate the zip
./node_modules/addons-linter/bin/addons-linter dist/$(ls dist | grep -x basketball.*\.zip) --self-hosted

