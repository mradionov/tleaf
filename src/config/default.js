module.exports = {
  // By default templates use tab for indentation
  // You can pass any string here and each tab will be replaced with that string
  // You can pass integer and it will be a number of spaces for indentation
  indent: '\t',

  units: {

    // List the unit types which should be processed. Only the types mentioned
    // here will be parsed and asked about.
    // The order they appear can be changed by reodering these keys.
    process: [
      'controller', 'directive', 'factory', 'service',
      'filter', 'provider', 'value', 'constant'
    ]

  },

  dependencies: {

    // List the dependencies which should be processed. Only the types mentioned
    // here will be asked about and be included in generated test code.
    // The order they appear can be changed by reodering these keys
    process: ['provider', 'service', 'factory', 'value', 'constant'],

    // Exclude particular dependencies, there won't be any test code generated
    // for them.
    filter: ['$scope'],

    // TODO: map to template path?
    // Map dependency type to a respective template. Can be helpful in case
    // when one wants to mock services and factories with values.
    templateMap: {
      'provider': 'provider',
      'service': 'service',
      'factory': 'factory',
      'value': 'value',
      'constant': 'constant'
    }

  }

};