cat ./src/**/* | /Users/mindtraveller/.npm-packages/lib/node_modules/uglify-es/bin/uglifyjs -o ./docs/bundle.js --compress --mangle
uglifycss ./styles/** --output ./docs/styles.css