tleaf
===

> AngularJS unit test generator

Command line [npm](https://www.npmjs.com/) utility module built on [Node.js](https://nodejs.org/) to generate [AngularJS](https://angularjs.org/) unit tests based on existing code or create them from scratch.

## Installation

Install module globally:

```bash
npm i tleaf -g
```

## Usage

```bash
tleaf [/path/to/source.js] [/path/to/output.spec.js]
```

* `[/path/to/source.js]` - path to AngularJS source code with a unit to test
* `[/path/to/output.spec.js]` - path to output test file

The command parses your source file and extract all AngularJS units (`controller`, `service`, etc.). After that you will be asked which one you'd want to test and what are the types of the dependencies. The result will be a test file, based on template for this unit type, with unit, module and dependencies set up.

***

```bash
tleaf create [/path/to/output.spec.js]
```

* `[/path/to/output.spec.js]` - path to output test file

The command creates a test file based on answers you provide for a number of questions: what's a name of the unit? what's it's type? what are it's dependencies? The result will be a test file, based on template for this unit type, with unit, module and dependencies set up.

***

```bash
tleaf init [/path/to/folder]
```

* `[/path/to/folder]` - path to output folder

The command copies templates, which are used to create test files by default, to a directory you've provided. You'll be able to modify these templates for your needs and use them to generate test files. Copied folder will also contain a configuration file for additional options. This folder can be created anywhere on your machine, you can use the same configuration and set of templates for multiple projects. It can be (but does not have to) included under version control systems, it's up to you.

***

```bash
tleaf use [/path/to/config.js]
```

* `[/path/to/config.js]` - path to configuration file

The command sets current configuration which will be used to generate test files. It accepts a path to a configuration file inside a folder, which was created by executing a command `tleaf init [/path/to/folder]`. This command allows you to use different configurations and set of templates.

***

```bash
tleaf use default
```

  The command allows to switch back to default templates.

***

```bash
tleaf current
```

  The command shows which configuration is used at the moment.

## Configuration

When you run the command `tleaf init [/path/to/folder]`, all default templates and configuration file are copied to the location you've provided.

#### Configuration file

By default configuration file `config.js` is empty, the default configuration is used ([see default configuration file](src/config/default.js)). Available options:

* `indent: [string|integer]` - sets indentation for templates. Tabs by default (`'\t'`). A string will replace one tab. An integer will be a number of spaces which replace one tab.

  ```
  module.exports = {
    indent: '  '    // 1 tab = 2 spaces,
    indent: '\t'    // 1 tab = 1 tab
    indent: 4       // 1 tab = 4 spaces
    indent: '--'    // 1 tab = '--'
  }
  ```

TODO: rest of the options

#### Templates

Test files are generated from the templates, which are kinda like JavaScript files, but they get processed like templates to fill it with collected data. Most of the templates are based on [angular-test-patterns](https://github.com/daniellmb/angular-test-patterns), template for provider is based on [this StackOverflow Q/A](http://stackoverflow.com/questions/14771810/how-to-test-angularjs-custom-provider) and the rest of the templates are made by taking already existing ones as a sample.
Templates are processed by templating engine [Handlebars](http://handlebarsjs.com/), so you can use any of it's features.

###### Available data

Information, which is being collected by a parser or from your answers, gets passed to templates. Structure of the data available in templates (taking some controller as an example):

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

Basically it is a global object in templates and you can use it just like `{{name}}` (renders into `UserController`).

###### Template examples

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

You can discover more use-cases by looking at [default templates](src/defaults/templates).

###### Additional template helpers

* `{{only array}}` - joins array of strings, like `Array.join(', ')`;

  ```js
  $http, UserService, API_KEY
  ```

* `{{and array}}` - joins array of string, like `Array.join(', ')`, but also prepends the string with leading `,` comma;

  ```js
  , $http, UserService, API_KEY
  ```

* `{{dashCase string}}` - converts string to dash case (`"ngBindHtml"` => `"ng-bind-html"`);

* `{{defaults value defaultValue}}` - renders a `value`, or `defaultValue` if `value` is `undefined`.