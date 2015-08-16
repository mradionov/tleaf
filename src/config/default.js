module.exports = {
  // By default templates use tab for indentation
  // You can pass any string here and each tab will be replaced with that string
  // You can pass integer and it will be a number of spaces for indentation
  indent: '\t',

  // List the unit types which should be processed
  processedUnits: [
    'controller', 'directive', 'factory', 'service', 'filter', 'provider'
  ],

  processedProviders: [
    'constant', 'factory', 'service', 'value', 'provider'
  ],

  filteredDependencies: [
    '$scope'
  ]
};