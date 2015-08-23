tleaf
===

> AngularJS unit test generator

Command line [npm](https://www.npmjs.com/) utility module built on [Node.js](https://nodejs.org/) to generate [AngularJS](https://angularjs.org/) unit tests based on existing code or create them from scratch.

### Installation

Install module globally:

```bash
npm i tleaf -g
```

### Usage

```bash
tleaf [/path/to/source.js] [/path/to/output.spec.js]
```

* `[/path/to/source.js]` - path to AngularJS source code with a unit to test
* `[/path/to/output.spec.js]` - path to output test file

The command will parse your source file and extract all AngularJS units (`controller`, `service`, etc.). After that you will be asked which of them you'd want to test and what are the types of the dependencies (whether it is a `factory` or a `constant` for example). The result will be a test file, based on template for this unit type, with unit, module and dependencies set up.

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

The command will copy templates, which are used to create test files by default, to a directory you've provided. You'll be able to modify these templates for your needs and use them to generate test files. Copied folder will also contain a configuration file for additional options. This folder can be created anywhere on your machine, you can use the same configuration and set of templates for multiple projects. It can be (but does not have to) included under version control systems, it's up to you.

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