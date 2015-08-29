tleaf
===

> AngularJS unit test generator

Command line [npm](https://www.npmjs.com/) utility tool built on [Node.js](https://nodejs.org/) to generate [AngularJS](https://angularjs.org/) unit tests based on existing code or create them from scratch.

#### Contents:

  * [How does it work?](#how-does-it-work)
  * [Installation](#installation)
  * [Usage](#usage)
  * [Configuration](#configuration)
  * [Custom templates](#custom-templates)
    * [Data available in templates](#data-available-in-templates)
    * [Template examples](#template-examples)
    * [Extra template helpers](#extra-template-helpers)

## How does it work?

It takes your AngularJS source file and parses it with the help of [esprima](http://esprima.org/) - standard-compliant ECMAScript parser, which results into a code syntax tree. Then it analyzes the tree, looks for AngularJS units and extracts infromation about them. It may ask you some questions to get some more information. Then it generates a test file, based on pre-defined templates, setting up the collected information.

*Note: source code can be very different and complex from project to project (and from person to person), so it's really difficult to cover all cases and styles of writing AngularJS applications to be able to extract required information. If your AngularJs source code is not getting parsed as expected, feel free to create an issue with an example of the source code causing the problem.*

## Installation

Install module globally:

```bash
$ npm i tleaf -g
```

## Usage

***

```bash
$ tleaf [/path/to/source.js] [/path/to/output.spec.js]
```

* `[/path/to/source.js]` - path to AngularJS source code with a unit to test
* `[/path/to/output.spec.js]` - path to output test file

The command parses your source file and extracts all AngularJS units. After that you will be asked which one you'd want to test. The result will be a test file based on template for this unit type.

***

```bash
$ tleaf create [/path/to/output.spec.js]
```

* `[/path/to/output.spec.js]` - path to output test file

The command creates a test file based on answers you provide for a number of questions: what is a name of the unit? what is a type of the unit? what are unit's dependencies? The result will be a test file based on template for this unit type.

***

```bash
$ tleaf init [/path/to/folder]
```

* `[/path/to/folder]` - path to output folder

The command copies default templates to a directory you've provided. You'll be able to modify these templates for your needs and use them to generate test files. That folder will also contain a configuration file for additional options called `config.js`. This folder can be initialized anywhere on your machine, you can use the same configuration and set of templates for multiple projects. It can be included under version control system, but it is not required at all, it's up to you.

***

```bash
$ tleaf use [/path/to/config.js]
```

* `[/path/to/config.js]` - path to configuration file

The command sets current configuration which will be used to generate test files. It accepts a path to a configuration file inside a folder, which was created by executing a command `tleaf init [/path/to/folder]`. This command allows you to use different configurations and set of templates.

***

```bash
$ tleaf use default
```

  The command allows to switch back to default templates.

***

```bash
$ tleaf current
```

  The command shows which configuration is used at the moment.

## Configuration

When you run the command `tleaf init [/path/to/folder]`, all default templates and a configuration file are copied to the location you've provided.
By default configuration file `config.js` is empty, the default configuration is used ([see default configuration file](src/config/default.js)). Available options:

* `indent: [string|integer]` - sets indentation for templates. Tabs by default (`'\t'`). A string will replace one tab. An integer will be a number of spaces to replace one tab.

  ```js
  module.exports = {
    indent: '  '    // 1 tab = 2 spaces,
    indent: '\t'    // 1 tab = 1 tab
    indent: 4       // 1 tab = 4 spaces
    indent: '--'    // 1 tab = '--'
  };
  ```
* `units.process: [array]` - array of unit types which should be parsed and processed. To reorder the appearance of unit types change their order in this array.

  ```js
  module.exports = {
    units: {
      // process only controllers, directives and providers
      // these types will appear in the exact same order
      process: ['controller', 'directive', 'provider']
    }
  };
  ```

*NOTE: providers are the dependencies of your unit.*

* `providers.process: [array]` - array of provider types which should be parsed and processed. To reorder the appearance of provider types change their order in this array.

  ```js
  module.exports = {
    providers: {
      // process only services and values, others will be ignored
      // these types will appear in the exact same order, which means that
      // all services will be rendered first, then all the values, etc.
      process: ['service', 'value']
    }
  };
  ```

* `providers.filter: [array]` - array of provider names, which should be ignored, by default only `$scope` and `$rootScope` are filtered out.

  ```js
  module.exports = {
    providers: {
      // ignore dependencies with these names
      filter: ['$scope', '$rootScope', 'GlobalService', 'SECRET_CONST']
    }
  };
  ```

* `providers.templateMap: [object]` - object, which maps provider types with templates they should use. May be useful, when you want to render *factories* or *services* using *value* template.

  ```js
  module.exports = {
    providers: {
      templateMap: {
        'provider': 'provider', // use default provider template
        'service': 'value',     // use value template for service
        'factory': 'service'    // use service template for factory
      }
    }
  };
  ```

## Custom templates

Test files are generated from the templates, which are kinda JavaScript files, but they get processed like templates to fill it with the gathered data.
When you run the command `tleaf init [/path/to/folder]`, all default templates and a configuration file are copied to the location you've provided.
Most of the templates are based on [angular-test-patterns](https://github.com/daniellmb/angular-test-patterns), a template for providers is based on [this StackOverflow Q/A](http://stackoverflow.com/questions/14771810/how-to-test-angularjs-custom-provider) and the rest of the templates are completed by taking already existing ones as an example. You can take a look at [default templates](src/defaults/templates).
Templates are processed by the templating engine called [Handlebars](http://handlebarsjs.com/), so you can use any of it's features.

### Data available in templates

Information, which is being collected by a parser or from your answers, gets passed to templates. Here is the structure of the data available in templates, consider it a global object in your templates (taking some controller as an example):

```js

{
  // top level

  unit: {

    name: 'UserController',

    type: 'controller',

    module: {
      name: 'admin'
    },

    deps: [
      {
        name: '$http',
        type: 'provider'
      },
      {
        name: 'UserService',
        type: 'service'
      },
      {
        name: 'API_KEY',
        type: 'constant'
      }
    ]
  },

  // top level

  // shortcut for: unit.name
  name: 'UserController',

  // shortcut for: "_" + unit.name + "_"; useful in provide() section
  _name_: '_UserController_',

  // shortcut for: unit.module.name
  module: 'admin',

  // shortcut for: unit.deps; plus some additions
  deps: [
    {
      name: '$http',
      _name_: '_$http_',
      type: 'provider'
    },
    {
      name: 'UserService',
      _name_: '_UserService_',
      type: 'service'
    },
    {
      name: 'API_KEY',
      _name_: '_API_KEY_',
      type: 'constant'
    }
  ],

  // top level

  // args are usually used to define variables or arguments
  arg: {

    // shortcut for unit names
    deps: ['$http', 'UserService', 'API_KEY'],

    // shortcut for unit names; useful in provide() section
    _deps_: ['_$http_', '_UserService_', '_API_KEY_']

  }

}
```

### Template examples

Here you can find some examples of composing the templates. You can discover more use-cases by looking at [default templates](src/defaults/templates).

1. Load module:

  Template:

  ```js
  module('{{module}}');
  ```

  After render:

  ```js
  module('admin');
  ```

2. Initialize variables:

  Template:

  ```js
  var {{name}}{{and arg.deps}};
  ```

  After render:

  ```js
  var UserController, $http, UserService, API_KEY;
  ```

3. Provide dependencies:

  Template:

  ```js
  module(function ($provide) {
    {{#each deps}}
    {{> (this.provider) this}} // renders a partial for current dep type
    {{/each}}
  });
  ```

  After render:

  ```js
  module(function ($provide) {
    $provide.provider('$http', function () {
      this.$get = function () {
        return {};
      };
    });
    $provide.service('UserService', function () {
    });
    $provide.constant('API_KEY', '');
  });
  ```

### Extra template helpers

Handlerbars allows to create custom helpers to help render the data, here are some of them built-in in the module, which might be helpful:

* `{{only array}}` - joins array of strings with `", "`:

  ```js
  $http, UserService, API_KEY
  ```

* `{{and array}}` - joins array of strings with `", "`, but also adds extra `", "` in front:

  ```js
  , $http, UserService, API_KEY
  ```

* `{{dashCase string}}` - converts string to dash-case, useful when working with directives:

  ```
  "ngBindHtml" => "ng-bind-html"
  ```

* `{{defaults value defaultValue}}` - renders *value* if it is not *undefined*, *defaultValue* otherwise.

## Test

```bash
$ npm install
$ npm test
```

## License
MIT © [Michael Radionov](https://github.com/mradionov)