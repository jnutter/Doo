var babel = require('babelify/node_modules/babel-core');

module.exports = {
    process: function(src, filename) {
        if (filename.indexOf('node_modules/') === -1) {
            return babel.transform(src, {filename: filename}).code;
        }
        return src;
    }
};
