const rtl = require('postcss-rtl')

module.exports = {
  plugins: [
    rtl({
      // Custom selector handler to avoid double-processing [dir] selectors
      addPrefixToSelector(selector, prefix) {
        // If the selector already contains a [dir attribute, don't add another
        if (selector.match(/\[dir/)) {
          return selector
        }
        return `${prefix} ${selector}`
      },
    }),
  ],
}
