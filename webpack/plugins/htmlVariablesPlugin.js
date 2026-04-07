const HtmlWebpackPlugin = require('html-webpack-plugin');

const escapeRegExp = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

class HtmlVariablesPlugin {
  constructor(replacements) {
    this.replacements = replacements;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('HtmlVariablesPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'HtmlVariablesPlugin',
        (data, callback) => {
          Object.keys(this.replacements).forEach((key) => {
            const matchStr = `%${escapeRegExp(key)}%`;
            const value = this.replacements[key];

            data.html = data.html.replace(new RegExp(matchStr, 'g'), value);
          });

          callback(null, data);
        }
      );
    });
  }
}

module.exports = HtmlVariablesPlugin;
