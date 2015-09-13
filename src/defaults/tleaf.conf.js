module.exports = function (config) {
  config.set({

    template: {
      // By default templates use tab for indentation
      // You can pass any string and each tab will be replaced with that string.
      // You can pass integer and it will be a number of spaces for indentation.
      indent: '\t',

      // Include "use strict" statement to the top of the generated test file
      useStrict: true,

      // Add commented examples of basic specs to the generated test file
      includeSamples: true
    }

  });
};