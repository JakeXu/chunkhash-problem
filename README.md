# chunkhash-problem
[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

Showing [a problem](https://github.com/webpack/webpack/issues/1315) where vendor chunkhashes are not always the same even when the contents don't change.

Just edit `src/entry.js`, change the value of `myVar` and run `npm run build`.
