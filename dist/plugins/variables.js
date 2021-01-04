/******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
    /******/
    /******/ 		// Check if module is in cache
    /******/ 		if(installedModules[moduleId]) {
      /******/ 			return installedModules[moduleId].exports;
      /******/ 		}
    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = installedModules[moduleId] = {
      /******/ 			i: moduleId,
      /******/ 			l: false,
      /******/ 			exports: {}
      /******/ 		};
    /******/
    /******/ 		// Execute the module function
    /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ 		// Flag the module as loaded
    /******/ 		module.l = true;
    /******/
    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
    /******/ 		if(!__webpack_require__.o(exports, name)) {
      /******/ 			Object.defineProperty(exports, name, {
        /******/ 				configurable: false,
        /******/ 				enumerable: true,
        /******/ 				get: getter
        /******/ 			});
      /******/ 		}
    /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
    /******/ 		var getter = module && module.__esModule ?
      /******/ 			function getDefault() { return module['default']; } :
      /******/ 			function getModuleExports() { return module; };
    /******/ 		__webpack_require__.d(getter, 'a', getter);
    /******/ 		return getter;
    /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(__webpack_require__.s = 0);
  /******/ })
  /************************************************************************/
  /******/ ([
    /* 0 */
    /***/ (function(module, exports, __webpack_require__) {

      var variablesObj = null;
      var variablesFile;
      var nsResolver = null;
      var variablesFileType;


      function resolveVar(v){
        if (variablesFile && variablesObj == null){
          initVariablesObj();
        }
        let replacement = []
        if (variablesFileType == "xml"){
          replacement = resolveXMLVar(v);
        }else if (variablesFileType == "json"){
          replacement = resolveJSONVar(v);
        }
        return replacement.length === 0 ? "${"+v+"}" : replacement
      }

      function resolveJSONVar(v){
        variable = v;
        if (!variable.startsWith("$")){
          variable = "$."+variable;
        }
        try{
          var jp = __webpack_require__(1).JSONPath;
          ret = jp({path: variable, json: variablesObj});
        }catch(e){
          ret = "${"+v+"}"
        }
        return ret.length === 0 ?  "${"+v+"}" : ret;
      }

      function resolveXMLVar(v){
        variable = v;
        if (!variable.startsWith("/")){
          variable = "/"+variable.replace(/(\.)/g,"/");
        }
        try{
          ret = variablesObj.evaluate(variable, variablesObj, null, XPathResult.ANY_TYPE,null).iterateNext().childNodes[0].nodeValue;
        }catch(e){
          ret = "${"+v+"}"
        }
        return ret
      }

      function initVariablesObj(){
        xhttp = new XMLHttpRequest();
        xhttp.open("GET", variablesFile, false);
        xhttp.send(null);
        str = xhttp.response;
        variablesObj = stringToObj(str,variablesFileType);
      }

      function stringToObj(str, type){
        var variablesObj=null;
        if (type == "xml"){
          str = str.replace(/(<[\s\S]*)xmlns=\"[^"]*\"([^>]*>)/g, "$1$2") //remove default namespace
          if (window.DOMParser)
          {
            parser=new DOMParser();
            variablesObj=parser.parseFromString(str,"text/xml");
          }
          else // Internet Explorer
          {
            variablesObj=new ActiveXObject("Microsoft.XMLDOM");
            variablesObj.async="false";
            variablesObj.loadXML(str);
          }
        }else if (type == "json"){
          variablesObj = JSON.parse(str);
        }
        return variablesObj;
      }

      function install(hook,vm){
        variablesFile = vm.config.variablesFile;
        variablesFileType = vm.config.variablesFileType;
        if (!variablesFileType) variablesFileType=variablesFile.split('.').pop();
        if (!variablesFileType) variablesFileType = "xml";
        variablesFileType = variablesFileType.toLowerCase();

        hook.afterEach(function(html, next) {
          next(html.replace(/\${([^\}]*)}/g, function(a, b){return resolveVar(b)}))
        })
      }

      if (!window.$docsify) {
        window.$docsify = {}
      }

      window.$docsify.plugins = (window.$docsify.plugins || []).concat(install)


      /***/ }),
    /* 1 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
      /* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JSONPath", function() { return JSONPath; });
        function _typeof(obj) {
          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function (obj) {
              return typeof obj;
            };
          } else {
            _typeof = function (obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
          }

          return _typeof(obj);
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
          }

          subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
              value: subClass,
              writable: true,
              configurable: true
            }
          });
          if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _getPrototypeOf(o) {
          _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
          };
          return _getPrototypeOf(o);
        }

        function _setPrototypeOf(o, p) {
          _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
          };

          return _setPrototypeOf(o, p);
        }

        function isNativeReflectConstruct() {
          if (typeof Reflect === "undefined" || !Reflect.construct) return false;
          if (Reflect.construct.sham) return false;
          if (typeof Proxy === "function") return true;

          try {
            Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
            return true;
          } catch (e) {
            return false;
          }
        }

        function _construct(Parent, args, Class) {
          if (isNativeReflectConstruct()) {
            _construct = Reflect.construct;
          } else {
            _construct = function _construct(Parent, args, Class) {
              var a = [null];
              a.push.apply(a, args);
              var Constructor = Function.bind.apply(Parent, a);
              var instance = new Constructor();
              if (Class) _setPrototypeOf(instance, Class.prototype);
              return instance;
            };
          }

          return _construct.apply(null, arguments);
        }

        function _isNativeFunction(fn) {
          return Function.toString.call(fn).indexOf("[native code]") !== -1;
        }

        function _wrapNativeSuper(Class) {
          var _cache = typeof Map === "function" ? new Map() : undefined;

          _wrapNativeSuper = function _wrapNativeSuper(Class) {
            if (Class === null || !_isNativeFunction(Class)) return Class;

            if (typeof Class !== "function") {
              throw new TypeError("Super expression must either be null or a function");
            }

            if (typeof _cache !== "undefined") {
              if (_cache.has(Class)) return _cache.get(Class);

              _cache.set(Class, Wrapper);
            }

            function Wrapper() {
              return _construct(Class, arguments, _getPrototypeOf(this).constructor);
            }

            Wrapper.prototype = Object.create(Class.prototype, {
              constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
              }
            });
            return _setPrototypeOf(Wrapper, Class);
          };

          return _wrapNativeSuper(Class);
        }

        function _assertThisInitialized(self) {
          if (self === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }

          return self;
        }

        function _possibleConstructorReturn(self, call) {
          if (call && (typeof call === "object" || typeof call === "function")) {
            return call;
          }

          return _assertThisInitialized(self);
        }

        /* eslint-disable no-eval, jsdoc/check-types */
// Todo: Reenable jsdoc/check-types once PR merged: https://github.com/gajus/eslint-plugin-jsdoc/pull/270
        var globalEval = eval; // eslint-disable-next-line import/no-commonjs

        var supportsNodeVM = typeof module !== 'undefined' && Boolean(module.exports) && !(typeof navigator !== 'undefined' && navigator.product === 'ReactNative');
        var allowedResultTypes = ['value', 'path', 'pointer', 'parent', 'parentProperty', 'all'];
        var hasOwnProp = Object.prototype.hasOwnProperty;
        /**
         * @typedef {null|boolean|number|string|PlainObject|GenericArray} JSONObject
         */

        /**
         * @callback ConditionCallback
         * @param item
         * @returns {boolean}
         */

        /**
         * Copy items out of one array into another.
         * @param {Array} source Array with items to copy
         * @param {Array} target Array to which to copy
         * @param {ConditionCallback} conditionCb Callback passed the current item; will move
         *     item if evaluates to `true`
         * @returns {undefined}
         */

        var moveToAnotherArray = function moveToAnotherArray(source, target, conditionCb) {
          var il = source.length;

          for (var i = 0; i < il; i++) {
            var item = source[i];

            if (conditionCb(item)) {
              target.push(source.splice(i--, 1)[0]);
            }
          }
        };

        var vm = supportsNodeVM ? __webpack_require__(3) : {
          /**
           * @param {string} expr Expression to evaluate
           * @param {PlainObject} context Object whose items will be added to evaluation
           * @returns {Any} Result of evaluated code
           */
          runInNewContext: function runInNewContext(expr, context) {
            var keys = Object.keys(context);
            var funcs = [];
            moveToAnotherArray(keys, funcs, function (key) {
              return typeof context[key] === 'function';
            });
            var code = funcs.reduce(function (s, func) {
              var fString = context[func].toString();

              if (!/function/.exec(fString)) {
                fString = 'function ' + fString;
              }

              return 'var ' + func + '=' + fString + ';' + s;
            }, '') + keys.reduce(function (s, vr) {
              return 'var ' + vr + '=' + JSON.stringify(context[vr]).replace( // http://www.thespanner.co.uk/2011/07/25/the-json-specification-is-now-wrong/
                /\u2028|\u2029/g, function (m) {
                  return "\\u202" + (m === "\u2028" ? '8' : '9');
                }) + ';' + s;
            }, expr);
            return globalEval(code);
          }
        };
        /**
         * Copies array and then pushes item into it.
         * @param {Array} arr Array to copy and into which to push
         * @param {Any} item Array item to add (to end)
         * @returns {Array} Copy of the original array
         */

        function push(arr, item) {
          arr = arr.slice();
          arr.push(item);
          return arr;
        }
        /**
         * Copies array and then unshifts item into it.
         * @param {Any} item Array item to add (to beginning)
         * @param {Array} arr Array to copy and into which to unshift
         * @returns {Array} Copy of the original array
         */


        function unshift(item, arr) {
          arr = arr.slice();
          arr.unshift(item);
          return arr;
        }
        /**
         * Caught when JSONPath is used without `new` but rethrown if with `new`
         * @extends Error
         */


        var NewError =
          /*#__PURE__*/
          function (_Error) {
            _inherits(NewError, _Error);

            /**
             * @param {Any} value The evaluated scalar value
             */
            function NewError(value) {
              var _this;

              _classCallCheck(this, NewError);

              _this = _possibleConstructorReturn(this, _getPrototypeOf(NewError).call(this, 'JSONPath should not be called with "new" (it prevents return of (unwrapped) scalar values)'));
              _this.avoidNew = true;
              _this.value = value;
              _this.name = 'NewError';
              return _this;
            }

            return NewError;
          }(_wrapNativeSuper(Error));
        /**
         * @typedef {PlainObject} ReturnObject
         * @property {string} path
         * @property {JSONObject} value
         * @property {PlainObject|GenericArray} parent
         * @property {string} parentProperty
         */

        /**
         * @callback JSONPathCallback
         * @param {string|PlainObject} preferredOutput
         * @param {"value"|"property"} type
         * @param {ReturnObject} fullRetObj
         */

        /**
         * @callback OtherTypeCallback
         * @param {JSONObject} val
         * @param {string} path
         * @param {PlainObject|GenericArray} parent
         * @param {string} parentPropName
         */

        /**
         * @param {PlainObject} [opts] If present, must be an object
         * @param {string} expr JSON path to evaluate
         * @param {JSON} obj JSON object to evaluate against
         * @param {JSONPathCallback} callback Passed 3 arguments: 1) desired payload per `resultType`,
         *     2) `"value"|"property"`, 3) Full returned object with all payloads
         * @param {OtherTypeCallback} otherTypeCallback If `@other()` is at the end of one's query, this
         *  will be invoked with the value of the item, its path, its parent, and its parent's
         *  property name, and it should return a boolean indicating whether the supplied value
         *  belongs to the "other" type or not (or it may handle transformations and return `false`).
         * @returns {JSONPath}
         * @class
         */


        function JSONPath(opts, expr, obj, callback, otherTypeCallback) {
          // eslint-disable-next-line no-restricted-syntax
          if (!(this instanceof JSONPath)) {
            try {
              return new JSONPath(opts, expr, obj, callback, otherTypeCallback);
            } catch (e) {
              if (!e.avoidNew) {
                throw e;
              }

              return e.value;
            }
          }

          if (typeof opts === 'string') {
            otherTypeCallback = callback;
            callback = obj;
            obj = expr;
            expr = opts;
            opts = {};
          }

          opts = opts || {};
          var objArgs = hasOwnProp.call(opts, 'json') && hasOwnProp.call(opts, 'path');
          this.json = opts.json || obj;
          this.path = opts.path || expr;
          this.resultType = opts.resultType && opts.resultType.toLowerCase() || 'value';
          this.flatten = opts.flatten || false;
          this.wrap = hasOwnProp.call(opts, 'wrap') ? opts.wrap : true;
          this.sandbox = opts.sandbox || {};
          this.preventEval = opts.preventEval || false;
          this.parent = opts.parent || null;
          this.parentProperty = opts.parentProperty || null;
          this.callback = opts.callback || callback || null;

          this.otherTypeCallback = opts.otherTypeCallback || otherTypeCallback || function () {
            throw new Error('You must supply an otherTypeCallback callback option with the @other() operator.');
          };

          if (opts.autostart !== false) {
            var ret = this.evaluate({
              path: objArgs ? opts.path : expr,
              json: objArgs ? opts.json : obj
            });

            if (!ret || _typeof(ret) !== 'object') {
              throw new NewError(ret);
            }

            return ret;
          }
        } // PUBLIC METHODS


        JSONPath.prototype.evaluate = function (expr, json, callback, otherTypeCallback) {
          var that = this;
          var currParent = this.parent,
            currParentProperty = this.parentProperty;
          var flatten = this.flatten,
            wrap = this.wrap;
          this.currResultType = this.resultType;
          this.currPreventEval = this.preventEval;
          this.currSandbox = this.sandbox;
          callback = callback || this.callback;
          this.currOtherTypeCallback = otherTypeCallback || this.otherTypeCallback;
          json = json || this.json;
          expr = expr || this.path;

          if (expr && _typeof(expr) === 'object') {
            if (!expr.path) {
              throw new Error('You must supply a "path" property when providing an object argument to JSONPath.evaluate().');
            }

            json = hasOwnProp.call(expr, 'json') ? expr.json : json;
            flatten = hasOwnProp.call(expr, 'flatten') ? expr.flatten : flatten;
            this.currResultType = hasOwnProp.call(expr, 'resultType') ? expr.resultType : this.currResultType;
            this.currSandbox = hasOwnProp.call(expr, 'sandbox') ? expr.sandbox : this.currSandbox;
            wrap = hasOwnProp.call(expr, 'wrap') ? expr.wrap : wrap;
            this.currPreventEval = hasOwnProp.call(expr, 'preventEval') ? expr.preventEval : this.currPreventEval;
            callback = hasOwnProp.call(expr, 'callback') ? expr.callback : callback;
            this.currOtherTypeCallback = hasOwnProp.call(expr, 'otherTypeCallback') ? expr.otherTypeCallback : this.currOtherTypeCallback;
            currParent = hasOwnProp.call(expr, 'parent') ? expr.parent : currParent;
            currParentProperty = hasOwnProp.call(expr, 'parentProperty') ? expr.parentProperty : currParentProperty;
            expr = expr.path;
          }

          currParent = currParent || null;
          currParentProperty = currParentProperty || null;

          if (Array.isArray(expr)) {
            expr = JSONPath.toPathString(expr);
          }

          if (!expr || !json || !allowedResultTypes.includes(this.currResultType)) {
            return undefined;
          }

          this._obj = json;
          var exprList = JSONPath.toPathArray(expr);

          if (exprList[0] === '$' && exprList.length > 1) {
            exprList.shift();
          }

          this._hasParentSelector = null;

          var result = this._trace(exprList, json, ['$'], currParent, currParentProperty, callback).filter(function (ea) {
            return ea && !ea.isParentSelector;
          });

          if (!result.length) {
            return wrap ? [] : undefined;
          }

          if (result.length === 1 && !wrap && !Array.isArray(result[0].value)) {
            return this._getPreferredOutput(result[0]);
          }

          return result.reduce(function (rslt, ea) {
            var valOrPath = that._getPreferredOutput(ea);

            if (flatten && Array.isArray(valOrPath)) {
              rslt = rslt.concat(valOrPath);
            } else {
              rslt.push(valOrPath);
            }

            return rslt;
          }, []);
        }; // PRIVATE METHODS


        JSONPath.prototype._getPreferredOutput = function (ea) {
          var resultType = this.currResultType;

          switch (resultType) {
            default:
              throw new TypeError('Unknown result type');

            case 'all':
              ea.pointer = JSONPath.toPointer(ea.path);
              ea.path = typeof ea.path === 'string' ? ea.path : JSONPath.toPathString(ea.path);
              return ea;

            case 'value':
            case 'parent':
            case 'parentProperty':
              return ea[resultType];

            case 'path':
              return JSONPath.toPathString(ea[resultType]);

            case 'pointer':
              return JSONPath.toPointer(ea.path);
          }
        };

        JSONPath.prototype._handleCallback = function (fullRetObj, callback, type) {
          if (callback) {
            var preferredOutput = this._getPreferredOutput(fullRetObj);

            fullRetObj.path = typeof fullRetObj.path === 'string' ? fullRetObj.path : JSONPath.toPathString(fullRetObj.path); // eslint-disable-next-line callback-return

            callback(preferredOutput, type, fullRetObj);
          }
        };
        /**
         *
         * @param {string} expr
         * @param {JSONObject} val
         * @param {string} path
         * @param {PlainObject|GenericArray} parent
         * @param {string} parentPropName
         * @param {JSONPathCallback} callback
         * @param {boolean} literalPriority
         * @returns {ReturnObject|ReturnObject[]}
         */


        JSONPath.prototype._trace = function (expr, val, path, parent, parentPropName, callback, literalPriority) {
          // No expr to follow? return path and value as the result of this trace branch
          var retObj;
          var that = this;

          if (!expr.length) {
            retObj = {
              path: path,
              value: val,
              parent: parent,
              parentProperty: parentPropName
            };

            this._handleCallback(retObj, callback, 'value');

            return retObj;
          }

          var loc = expr[0],
            x = expr.slice(1); // We need to gather the return value of recursive trace calls in order to
          // do the parent sel computation.

          var ret = [];
          /**
           *
           * @param {ReturnObject|ReturnObject[]} elems
           * @returns {void}
           */

          function addRet(elems) {
            if (Array.isArray(elems)) {
              // This was causing excessive stack size in Node (with or without Babel) against our performance test: `ret.push(...elems);`
              elems.forEach(function (t) {
                ret.push(t);
              });
            } else {
              ret.push(elems);
            }
          }

          if ((typeof loc !== 'string' || literalPriority) && val && hasOwnProp.call(val, loc)) {
            // simple case--directly follow property
            addRet(this._trace(x, val[loc], push(path, loc), val, loc, callback));
          } else if (loc === '*') {
            // all child properties
            // eslint-disable-next-line no-shadow
            this._walk(loc, x, val, path, parent, parentPropName, callback, function (m, l, x, v, p, par, pr, cb) {
              addRet(that._trace(unshift(m, x), v, p, par, pr, cb, true));
            });
          } else if (loc === '..') {
            // all descendent parent properties
            addRet(this._trace(x, val, path, parent, parentPropName, callback)); // Check remaining expression with val's immediate children
            // eslint-disable-next-line no-shadow

            this._walk(loc, x, val, path, parent, parentPropName, callback, function (m, l, x, v, p, par, pr, cb) {
              // We don't join m and x here because we only want parents, not scalar values
              if (_typeof(v[m]) === 'object') {
                // Keep going with recursive descent on val's object children
                addRet(that._trace(unshift(l, x), v[m], push(p, m), v, m, cb));
              }
            }); // The parent sel computation is handled in the frame above using the
            // ancestor object of val

          } else if (loc === '^') {
            // This is not a final endpoint, so we do not invoke the callback here
            this._hasParentSelector = true;
            return path.length ? {
              path: path.slice(0, -1),
              expr: x,
              isParentSelector: true
            } : [];
          } else if (loc === '~') {
            // property name
            retObj = {
              path: push(path, loc),
              value: parentPropName,
              parent: parent,
              parentProperty: null
            };

            this._handleCallback(retObj, callback, 'property');

            return retObj;
          } else if (loc === '$') {
            // root only
            addRet(this._trace(x, val, path, null, null, callback));
          } else if (/^(-?\d*):(-?\d*):?(\d*)$/.test(loc)) {
            // [start:end:step]  Python slice syntax
            addRet(this._slice(loc, x, val, path, parent, parentPropName, callback));
          } else if (loc.indexOf('?(') === 0) {
            // [?(expr)] (filtering)
            if (this.currPreventEval) {
              throw new Error('Eval [?(expr)] prevented in JSONPath expression.');
            } // eslint-disable-next-line no-shadow


            this._walk(loc, x, val, path, parent, parentPropName, callback, function (m, l, x, v, p, par, pr, cb) {
              if (that._eval(l.replace(/^\?\((.*?)\)$/, '$1'), v[m], m, p, par, pr)) {
                addRet(that._trace(unshift(m, x), v, p, par, pr, cb));
              }
            });
          } else if (loc[0] === '(') {
            // [(expr)] (dynamic property/index)
            if (this.currPreventEval) {
              throw new Error('Eval [(expr)] prevented in JSONPath expression.');
            } // As this will resolve to a property name (but we don't know it yet), property and parent information is relative to the parent of the property to which this expression will resolve


            addRet(this._trace(unshift(this._eval(loc, val, path[path.length - 1], path.slice(0, -1), parent, parentPropName), x), val, path, parent, parentPropName, callback));
          } else if (loc[0] === '@') {
            // value type: @boolean(), etc.
            var addType = false;
            var valueType = loc.slice(1, -2);

            switch (valueType) {
              default:
                throw new TypeError('Unknown value type ' + valueType);

              case 'scalar':
                if (!val || !['object', 'function'].includes(_typeof(val))) {
                  addType = true;
                }

                break;

              case 'boolean':
              case 'string':
              case 'undefined':
              case 'function':
                if (_typeof(val) === valueType) {
                  // eslint-disable-line valid-typeof
                  addType = true;
                }

                break;

              case 'number':
                if (_typeof(val) === valueType && isFinite(val)) {
                  // eslint-disable-line valid-typeof
                  addType = true;
                }

                break;

              case 'nonFinite':
                if (typeof val === 'number' && !isFinite(val)) {
                  addType = true;
                }

                break;

              case 'object':
                if (val && _typeof(val) === valueType) {
                  // eslint-disable-line valid-typeof
                  addType = true;
                }

                break;

              case 'array':
                if (Array.isArray(val)) {
                  addType = true;
                }

                break;

              case 'other':
                addType = this.currOtherTypeCallback(val, path, parent, parentPropName);
                break;

              case 'integer':
                if (val === Number(val) && isFinite(val) && !(val % 1)) {
                  addType = true;
                }

                break;

              case 'null':
                if (val === null) {
                  addType = true;
                }

                break;
            }

            if (addType) {
              retObj = {
                path: path,
                value: val,
                parent: parent,
                parentProperty: parentPropName
              };

              this._handleCallback(retObj, callback, 'value');

              return retObj;
            }
          } else if (loc[0] === '`' && val && hasOwnProp.call(val, loc.slice(1))) {
            // `-escaped property
            var locProp = loc.slice(1);
            addRet(this._trace(x, val[locProp], push(path, locProp), val, locProp, callback, true));
          } else if (loc.includes(',')) {
            // [name1,name2,...]
            var parts = loc.split(',');
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = parts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var part = _step.value;
                addRet(this._trace(unshift(part, x), val, path, parent, parentPropName, callback));
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          } else if (!literalPriority && val && hasOwnProp.call(val, loc)) {
            // simple case--directly follow property
            addRet(this._trace(x, val[loc], push(path, loc), val, loc, callback, true));
          } // We check the resulting values for parent selections. For parent
          // selections we discard the value object and continue the trace with the
          // current val object


          if (this._hasParentSelector) {
            for (var t = 0; t < ret.length; t++) {
              var rett = ret[t];

              if (rett.isParentSelector) {
                var tmp = that._trace(rett.expr, val, rett.path, parent, parentPropName, callback);

                if (Array.isArray(tmp)) {
                  ret[t] = tmp[0];
                  var tl = tmp.length;

                  for (var tt = 1; tt < tl; tt++) {
                    t++;
                    ret.splice(t, 0, tmp[tt]);
                  }
                } else {
                  ret[t] = tmp;
                }
              }
            }
          }

          return ret;
        };

        JSONPath.prototype._walk = function (loc, expr, val, path, parent, parentPropName, callback, f) {
          if (Array.isArray(val)) {
            var n = val.length;

            for (var i = 0; i < n; i++) {
              f(i, loc, expr, val, path, parent, parentPropName, callback);
            }
          } else if (_typeof(val) === 'object') {
            for (var m in val) {
              if (hasOwnProp.call(val, m)) {
                f(m, loc, expr, val, path, parent, parentPropName, callback);
              }
            }
          }
        };

        JSONPath.prototype._slice = function (loc, expr, val, path, parent, parentPropName, callback) {
          if (!Array.isArray(val)) {
            return undefined;
          }

          var len = val.length,
            parts = loc.split(':'),
            step = parts[2] && parseInt(parts[2]) || 1;
          var start = parts[0] && parseInt(parts[0]) || 0,
            end = parts[1] && parseInt(parts[1]) || len;
          start = start < 0 ? Math.max(0, start + len) : Math.min(len, start);
          end = end < 0 ? Math.max(0, end + len) : Math.min(len, end);
          var ret = [];

          for (var i = start; i < end; i += step) {
            var tmp = this._trace(unshift(i, expr), val, path, parent, parentPropName, callback);

            if (Array.isArray(tmp)) {
              // This was causing excessive stack size in Node (with or without Babel) against our performance test: `ret.push(...tmp);`
              tmp.forEach(function (t) {
                ret.push(t);
              });
            } else {
              ret.push(tmp);
            }
          }

          return ret;
        };

        JSONPath.prototype._eval = function (code, _v, _vname, path, parent, parentPropName) {
          if (!this._obj || !_v) {
            return false;
          }

          if (code.includes('@parentProperty')) {
            this.currSandbox._$_parentProperty = parentPropName;
            code = code.replace(/@parentProperty/g, '_$_parentProperty');
          }

          if (code.includes('@parent')) {
            this.currSandbox._$_parent = parent;
            code = code.replace(/@parent/g, '_$_parent');
          }

          if (code.includes('@property')) {
            this.currSandbox._$_property = _vname;
            code = code.replace(/@property/g, '_$_property');
          }

          if (code.includes('@path')) {
            this.currSandbox._$_path = JSONPath.toPathString(path.concat([_vname]));
            code = code.replace(/@path/g, '_$_path');
          }

          if (code.match(/@([.\s)[])/)) {
            this.currSandbox._$_v = _v;
            code = code.replace(/@([.\s)[])/g, '_$_v$1');
          }

          try {
            return vm.runInNewContext(code, this.currSandbox);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
            throw new Error('jsonPath: ' + e.message + ': ' + code);
          }
        }; // PUBLIC CLASS PROPERTIES AND METHODS
// Could store the cache object itself


        JSONPath.cache = {};
        /**
         * @param {string[]} pathArr Array to convert
         * @returns {string} The path string
         */

        JSONPath.toPathString = function (pathArr) {
          var x = pathArr,
            n = x.length;
          var p = '$';

          for (var i = 1; i < n; i++) {
            if (!/^(~|\^|@.*?\(\))$/.test(x[i])) {
              p += /^[0-9*]+$/.test(x[i]) ? '[' + x[i] + ']' : "['" + x[i] + "']";
            }
          }

          return p;
        };
        /**
         * @param {string} pointer JSON Path
         * @returns {string} JSON Pointer
         */


        JSONPath.toPointer = function (pointer) {
          var x = pointer,
            n = x.length;
          var p = '';

          for (var i = 1; i < n; i++) {
            if (!/^(~|\^|@.*?\(\))$/.test(x[i])) {
              p += '/' + x[i].toString().replace(/~/g, '~0').replace(/\//g, '~1');
            }
          }

          return p;
        };
        /**
         * @param {string} expr Expression to convert
         * @returns {string[]}
         */


        JSONPath.toPathArray = function (expr) {
          var cache = JSONPath.cache;

          if (cache[expr]) {
            return cache[expr].concat();
          }

          var subx = [];
          var normalized = expr // Properties
            .replace(/@(?:null|boolean|number|string|integer|undefined|nonFinite|scalar|array|object|function|other)\(\)/g, ';$&;') // Parenthetical evaluations (filtering and otherwise), directly
            //   within brackets or single quotes
            .replace(/[['](\??\(.*?\))[\]']/g, function ($0, $1) {
              return '[#' + (subx.push($1) - 1) + ']';
            }) // Escape periods and tildes within properties
            .replace(/\['([^'\]]*)'\]/g, function ($0, prop) {
              return "['" + prop.replace(/\./g, '%@%').replace(/~/g, '%%@@%%') + "']";
            }) // Properties operator
            .replace(/~/g, ';~;') // Split by property boundaries
            .replace(/'?\.'?(?![^[]*\])|\['?/g, ';') // Reinsert periods within properties
            .replace(/%@%/g, '.') // Reinsert tildes within properties
            .replace(/%%@@%%/g, '~') // Parent
            .replace(/(?:;)?(\^+)(?:;)?/g, function ($0, ups) {
              return ';' + ups.split('').join(';') + ';';
            }) // Descendents
            .replace(/;;;|;;/g, ';..;') // Remove trailing
            .replace(/;$|'?\]|'$/g, '');
          var exprList = normalized.split(';').map(function (exp) {
            var match = exp.match(/#(\d+)/);
            return !match || !match[1] ? exp : subx[match[1]];
          });
          cache[expr] = exprList;
          return cache[expr];
        };



        /* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(2)(module)))

      /***/ }),
    /* 2 */
    /***/ (function(module, exports) {

      module.exports = function(originalModule) {
        if(!originalModule.webpackPolyfill) {
          var module = Object.create(originalModule);
          // module.parent = undefined by default
          if(!module.children) module.children = [];
          Object.defineProperty(module, "loaded", {
            enumerable: true,
            get: function() {
              return module.l;
            }
          });
          Object.defineProperty(module, "id", {
            enumerable: true,
            get: function() {
              return module.i;
            }
          });
          Object.defineProperty(module, "exports", {
            enumerable: true,
          });
          module.webpackPolyfill = 1;
        }
        return module;
      };


      /***/ }),
    /* 3 */
    /***/ (function(module, exports, __webpack_require__) {

      var indexOf = __webpack_require__(4);

      var Object_keys = function (obj) {
        if (Object.keys) return Object.keys(obj)
        else {
          var res = [];
          for (var key in obj) res.push(key)
          return res;
        }
      };

      var forEach = function (xs, fn) {
        if (xs.forEach) return xs.forEach(fn)
        else for (var i = 0; i < xs.length; i++) {
          fn(xs[i], i, xs);
        }
      };

      var defineProp = (function() {
        try {
          Object.defineProperty({}, '_', {});
          return function(obj, name, value) {
            Object.defineProperty(obj, name, {
              writable: true,
              enumerable: false,
              configurable: true,
              value: value
            })
          };
        } catch(e) {
          return function(obj, name, value) {
            obj[name] = value;
          };
        }
      }());

      var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
        'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
        'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
        'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
        'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

      function Context() {}
      Context.prototype = {};

      var Script = exports.Script = function NodeScript (code) {
        if (!(this instanceof Script)) return new Script(code);
        this.code = code;
      };

      Script.prototype.runInContext = function (context) {
        if (!(context instanceof Context)) {
          throw new TypeError("needs a 'context' argument.");
        }

        var iframe = document.createElement('iframe');
        if (!iframe.style) iframe.style = {};
        iframe.style.display = 'none';

        document.body.appendChild(iframe);

        var win = iframe.contentWindow;
        var wEval = win.eval, wExecScript = win.execScript;

        if (!wEval && wExecScript) {
          // win.eval() magically appears when this is called in IE:
          wExecScript.call(win, 'null');
          wEval = win.eval;
        }

        forEach(Object_keys(context), function (key) {
          win[key] = context[key];
        });
        forEach(globals, function (key) {
          if (context[key]) {
            win[key] = context[key];
          }
        });

        var winKeys = Object_keys(win);

        var res = wEval.call(win, this.code);

        forEach(Object_keys(win), function (key) {
          // Avoid copying circular objects like `top` and `window` by only
          // updating existing context properties or new properties in the `win`
          // that was only introduced after the eval.
          if (key in context || indexOf(winKeys, key) === -1) {
            context[key] = win[key];
          }
        });

        forEach(globals, function (key) {
          if (!(key in context)) {
            defineProp(context, key, win[key]);
          }
        });

        document.body.removeChild(iframe);

        return res;
      };

      Script.prototype.runInThisContext = function () {
        return eval(this.code); // maybe...
      };

      Script.prototype.runInNewContext = function (context) {
        var ctx = Script.createContext(context);
        var res = this.runInContext(ctx);

        forEach(Object_keys(ctx), function (key) {
          context[key] = ctx[key];
        });

        return res;
      };

      forEach(Object_keys(Script.prototype), function (name) {
        exports[name] = Script[name] = function (code) {
          var s = Script(code);
          return s[name].apply(s, [].slice.call(arguments, 1));
        };
      });

      exports.createScript = function (code) {
        return exports.Script(code);
      };

      exports.createContext = Script.createContext = function (context) {
        var copy = new Context();
        if(typeof context === 'object') {
          forEach(Object_keys(context), function (key) {
            copy[key] = context[key];
          });
        }
        return copy;
      };


      /***/ }),
    /* 4 */
    /***/ (function(module, exports) {


      var indexOf = [].indexOf;

      module.exports = function(arr, obj){
        if (indexOf) return arr.indexOf(obj);
        for (var i = 0; i < arr.length; ++i) {
          if (arr[i] === obj) return i;
        }
        return -1;
      };

      /***/ })
    /******/ ]);
