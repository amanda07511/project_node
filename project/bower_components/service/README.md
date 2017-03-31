service.js
==========

Service.JS is an Inversion Of Control (IoC) container for JavaScript.
Similar to Symfony's [Dependency Injection Component (DIC)](http://symfony.com/doc/2.0/components/dependency_injection/introduction.html) it allows you to separate the construction of objects in your application from the rest of the code.

Parameters
----------

Parameters allow you to the separate the configuration of the options for your services from the service definitions themselves.
It is possible to use a container just to store parameters, as in the following:

```javascript
require([
    "service"  // Path to /vendor/service.js/service.js, with ".js" auto-appended by Modular
], function (
    service
) {
    "use strict";

    var components = service.create(),
        container = components.container,
        objectLoader = components.objectLoader,
        object = {
            "parameters": {
                "majorVersion": 4,
                "minorVersion": 2,
                "revision": 1024,
                "version": "%majorVersion%.%minorVersion%.%revision%"
            }
        };

    objectLoader.load(object);

    console.log(container.getParameter("majorVersion")); // Will print "4" to the console
    console.log(container.getParameter("minorVersion")); // Will print "2" to the console
    console.log(container.getParameter("revision"));     // Will print "1024" to the console
    console.log(container.getParameter("version"));      // Will print "4.2.1024" to the console
});
```

As can be seen in the example above, it is possible to refer to other parameters from within a string value for another parameter.
This is achieved by enclosing the name of the referenced parameters in percentage signs, as shown above.

Services
--------

Services allow you to separate the construction of objects for your application from the logic that uses them.

Real-world example
------------------
You wish to create a Virtual Machine for a programming language called "Flow". "Flow" will be a superset of ECMAScript, with one addition: a new language construct called "print" has been added:

```javascript
// ...
vm.run("print 4;"); // Should print "4" to the console
// ...
```

To do so, you require a parser, interpreter and console for output. Note that, as demonstrated below, it can still make sense to create "hard dependencies" outside of the IoC container, eg. for FlowProgram below. A typical setup may look like the following:

```javascript
/*
 * NB: Named defines will be used to encapsulate the module folder structure within this one file.
 *     Ordinarily, the definitions below would be anonymous and stored in separate module files:
 *     "Parser/Flow" would point to "/Parser/Flow.js", etc.
 */

// Module /util.js
define("util", [
    "modular" // The "modular" special dependency - used here to give a few useful utilities
], function (
    modular
) {
    "use strict";

    return modular.util;
});

// Module /Console.js
define("Console", [
    "util"
], function (
    util
) {
    "use strict";

    function Console() {
        this.writer = function () {};
    }

    util.extend(Console.prototype, {
        bind: function (args) {
            if (args.write) {
                this.writer = args.write;
            }
        },

        write: function (message) {
            this.writer(message);
        }
    });

    return Console;
});

// Module /Interpreter/Flow.js
define("Interpreter/Flow", [
    "util"
], function (
    util
) {
    "use strict";

    function FlowInterpreter(console) {
        this.console = console;
    }

    util.extend(FlowInterpreter.prototype, {
        run: function (program) {
            var console = this.console,
                runner = program.compile();

            runner(function (message) {
                console.write(message);
            });
        }
    });

    return FlowInterpreter;
});

// Module /Parser/Flow.js
define("Parser/Flow", [
    "util",
    "Program/Flow"
], function (
    util,
    FlowProgram
) {
    "use strict";

    function FlowParser() {

    }

    util.extend(FlowParser.prototype, {
        parse: function (code) {
            code = code.replace(/print\s+([\d.]+|"[^"]*");/g, "print($1);");
            return new FlowProgram(code);
        }
    });

    return FlowParser;
});

// Module /Program/Flow.js
define("Program/Flow", [
    "util"
], function (
    util
) {
    "use strict";

    function FlowProgram(code) {
        this.code = code;
    }

    util.extend(FlowProgram.prototype, {
        compile: function () {
            return new Function("print", this.code);
        }
    });

    return FlowProgram;
});

// Module /VM/Flow.js
define("VM/Flow", [
    "util"
], function (
    util
) {
    "use strict";

    function FlowVM(parser, interpreter) {
        this.parser = parser;
        this.interpreter = interpreter;
    }

    util.extend(FlowVM.prototype, {
        run: function (code) {
            var program = this.parser.parse(code);
            this.interpreter.run(program);
        }
    });

    return FlowVM;
});

require([
    "../service" // Path to service.js, with ".js" auto-appended by Modular
], function (
    service
) {
    "use strict";

    var components = service.create(),
        container = components.container,
        objectLoader = components.objectLoader,
        object = {
            "services": {
                "parser": {
                    "class": "Parser/Flow"
                },
                "interpreter": {
                    "class": "Interpreter/Flow",
                    "arguments": ["@console"]
                },
                "console": {
                    "class": "Console"
                },
                "vm": {
                    "class": "VM/Flow",
                    "arguments": ["@parser", "@interpreter"]
                }
            }
        },
        console,
        vm;

    objectLoader.load(object);

    container.get("console", "vm")
        .done(function (console, vm) {
            console.bind({
                "write": function (message) {
                    var item = document.createElement("li");
                    item.appendChild(document.createTextNode(message));
                    document.getElementById("console").appendChild(item);
                }
            });

            vm.run("print \"Hello from the Flow!\";");  // Will print "Hello from the Flow!" to the console
            vm.run("print 47;");  // Will print "47" to the console
        });
});
```

Note that the actual construction of the service objects ("parser", "interpreter", "console" and "vm") is handled by Service.JS.
