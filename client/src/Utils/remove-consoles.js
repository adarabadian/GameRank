export const GlobalDebug = (function () {
    var savedConsole = console;
    /**
    * @param {boolean} debugOn
    */
    return function (debugOn) {
        if (debugOn === false) {
            // supress the default console functionality
            console = {};
            console.log = function () { };
            // supress all type of consoles
            
            console.info = function () { };
            console.warn = function () { };
            console.error = function () { };
        } else {
            console = savedConsole;
        }
    };
})();