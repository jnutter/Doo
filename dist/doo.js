(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';Object.defineProperty(exports, '__esModule', { value: true });function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}var _libState = require('./lib/state');var _libState2 = _interopRequireDefault(_libState);exports['default'] = 

{ 
    State: _libState2['default'] };module.exports = exports['default'];

},{"./lib/state":3}],2:[function(require,module,exports){
'use strict';Object.defineProperty(exports, '__esModule', { value: true });function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}var _lodashIsdate = require('lodash.isdate');var _lodashIsdate2 = _interopRequireDefault(_lodashIsdate);exports['default'] = 

{ 
    string: { 
        'default': function _default() {
            return '';} }, 


    date: { 
        set: function set(newVal) {
            var newType = undefined;
            if (newVal === null) {
                newType = typeof null;} else 
            if (!(0, _lodashIsdate2['default'])(newVal)) {
                try {
                    var dateVal = new Date(newVal).valueOf();
                    if (isNaN(dateVal)) {
                        // If the newVal cant be parsed, then try parseInt first
                        dateVal = new Date(parseInt(newVal, 10)).valueOf();
                        if (isNaN(dateVal)) {
                            throw TypeError;}}


                    newVal = dateVal;
                    newType = 'date';} 
                catch (e) {
                    newType = typeof newVal;}} else 

            {
                newType = 'date';
                newVal = newVal.valueOf();}


            return { 
                val: newVal, 
                type: newType };}, 


        get: function get(val) {
            if (val === null) {
                return val;}

            return new Date(val);}, 

        'default': function _default() {
            return new Date();} }, 


    array: { 
        set: function set(newVal) {
            return { 
                val: newVal, 
                type: Array.isArray(newVal) ? 'array' : typeof newVal };}, 


        'default': function _default() {
            return [];} }, 


    object: { 
        set: function set(newVal) {
            var newType = typeof newVal;
            if (newType !== 'object' && newVal === undefined) {
                newVal = null;
                newType = 'object';}

            return { 
                val: newVal, 
                type: newType };}, 


        'default': function _default() {
            return {};} } };module.exports = exports['default'];

},{"lodash.isdate":4}],3:[function(require,module,exports){
'use strict';Object.defineProperty(exports, '__esModule', { value: true });var _createClass = (function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};})();function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;} else {return Array.from(arr);}}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError('Cannot call a class as a function');}}var _lodashUniqueid = require('lodash.uniqueid');var _lodashUniqueid2 = _interopRequireDefault(_lodashUniqueid);var _lodashResult = require(
'lodash.result');var _lodashResult2 = _interopRequireDefault(_lodashResult);var _dataTypes = require(
'./data-types');var _dataTypes2 = _interopRequireDefault(_dataTypes);var 

State = (function () {





    function State(attrs) {var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];_classCallCheck(this, State);this._definition = {};this._values = {};
        State._initialModelSetup(this);

        this.cid = (0, _lodashUniqueid2['default'])('state');
        this.parent = options.parent;}_createClass(State, [{ key: 'set', value: 


        function set(key, value, options) {
            var self = this;
            var extraProperties = this.extraProperties;
            var changing = undefined, changes = undefined, newType = undefined, newVal = undefined, def = undefined, cast = undefined, err = undefined, attr = undefined, 
            attrs = undefined, dataType = undefined, silent = undefined, unset = undefined, currentVal = undefined, initial = undefined, hasChanged = undefined, isEqual = undefined;

            // Handle both `"key", value` and `{key: value}` -style arguments.
            if (isObject(key) || key === null) {
                attrs = key;
                options = value;} else 
            {
                attrs = {};
                attrs[key] = value;}


            options = options || {};

            if (!this._validate(attrs, options)) return false;

            // Extract attributes and options.
            unset = options.unset;
            silent = options.silent;
            initial = options.initial;

            changes = [];
            changing = this._changing;
            this._changing = true;

            // if not already changing, store previous
            if (!changing) {
                this._previousAttributes = this.attributes;
                this._changed = {};}


            // For each `set` attribute...
            for (attr in attrs) {
                newVal = attrs[attr];
                newType = typeof newVal;
                currentVal = this._values[attr];
                def = this._definition[attr];

                if (!def) {
                    // if this is a child model or collection
                    if (this._children[attr] || this._collections[attr]) {
                        this[attr].set(newVal, options);
                        continue;} else 
                    if (extraProperties === 'ignore') {
                        continue;} else 
                    if (extraProperties === 'reject') {
                        throw new TypeError('No "' + attr + '" property defined on ' + (this.type || 'this') + ' model and extraProperties not set to "ignore" or "allow"');} else 
                    if (extraProperties === 'allow') {
                        def = this._createPropertyDefinition(attr, 'any');} else 
                    if (extraProperties) {
                        throw new TypeError('Invalid value for extraProperties: "' + extraProperties + '"');}}



                isEqual = this._getCompareForType(def.type);
                dataType = this._dataTypes[def.type];

                // check type if we have one
                if (dataType && dataType.set) {
                    cast = dataType.set(newVal);
                    newVal = cast.val;
                    newType = cast.type;}


                // If we've defined a test, run it
                if (def.test) {
                    err = def.test.call(this, newVal, newType);
                    if (err) {
                        throw new TypeError('Property \'' + attr + '\' failed validation with error: ' + err);}}



                // If we are required but undefined, throw error.
                // If we are null and are not allowing null, throw error
                // If we have a defined type and the new type doesn't match, and we are not null, throw error.

                if (isUndefined(newVal) && def.required) {
                    throw new TypeError('Required property \'' + attr + '\' must be of type ' + def.type + '. Tried to set ' + newVal);}

                if (isNull(newVal) && def.required && !def.allowNull) {
                    throw new TypeError('Property \'' + attr + '\' must be of type ' + def.type + ' (cannot be null). Tried to set ' + newVal);}

                if (def.type && def.type !== 'any' && def.type !== newType && !isNull(newVal) && !isUndefined(newVal)) {
                    throw new TypeError('Property \'' + attr + '\' must be of type ' + def.type + '. Tried to set ' + newVal);}

                if (def.values && !includes(def.values, newVal)) {
                    throw new TypeError('Property \'' + attr + '\' must be one of values: ' + def.values.join(', ') + '. Tried to set ' + newVal);}


                hasChanged = !isEqual(currentVal, newVal, attr);

                // enforce `setOnce` for properties if set
                if (def.setOnce && currentVal !== undefined && hasChanged && !initial) {
                    throw new TypeError('Property \'' + attr + '\' can only be set once.');}


                // keep track of changed attributes
                // and push to changes array
                if (hasChanged) {
                    changes.push({ prev: currentVal, val: newVal, key: attr });
                    self._changed[attr] = newVal;} else 
                {
                    delete self._changed[attr];}}



            // actually update our values
            changes.forEach(function (change) {
                self._previousAttributes[change.key] = change.prev;
                if (unset) {
                    delete self._values[change.key];} else 
                {
                    self._values[change.key] = change.val;}});



            if (!silent && changes.length) {
                self._pending = true;}

            if (!silent) {
                changes.forEach(function (change) {
                    self.trigger('change:' + change.key, self, change.val, options);});}



            // You might be wondering why there's a `while` loop here. Changes can
            // be recursively nested within `"change"` events.
            if (changing) {
                return this;}

            if (!silent) {
                while (this._pending) {
                    this._pending = false;
                    this.trigger('change', this, options);}}


            this._pending = false;
            this._changing = false;
            return this;} }, { key: 'get', value: 


        function get(attr) {
            return this[attr];} }, { key: '_ensureValidType', value: 


































        function _ensureValidType(type) {
            return this.constructor._dataTypesKeys.indexOf(type) !== -1 ? type : undefined;} }, { key: '_getDefaultForType', value: 


        function _getDefaultForType(type) {
            var dataType = this.constructor._dataTypes[type];
            return dataType && dataType['default'];} }], [{ key: '_initialModelSetup', value: function _initialModelSetup(object) {// We only want to setup things once on the class
            // so each instance doesn't have to go through the setup again
            if (object.constructor.initted) {return;}var inheritedAttributes = { props: [], session: [], dataTypes: [] };var constructor = object.constructor;while (constructor.name) {Object.keys(inheritedAttributes).forEach(function (key) {if (constructor[key]) {inheritedAttributes[key].unshift(constructor[key]);}});constructor = Object.getPrototypeOf(constructor);}var dataTypes = Object.assign.apply(Object, [{}, _dataTypes2['default']].concat(_toConsumableArray(inheritedAttributes.dataTypes)));object.constructor._dataTypes = dataTypes;object.constructor._dataTypesKeys = Object.keys(dataTypes);State._createPropertyDefinitions(object, Object.assign.apply(Object, [{}].concat(_toConsumableArray(inheritedAttributes.props))), false);State._createPropertyDefinitions(object, Object.assign.apply(Object, [{}].concat(_toConsumableArray(inheritedAttributes.session))), true);object.constructor.initted = true;} }, { key: '_createPropertyDefinitions', value: 
        function _createPropertyDefinitions(object, props, isSession) {
            Object.keys(props).forEach(function (key) {
                State._createPropertyDefinition(object, key, props[key], isSession);});} }, { key: '_createPropertyDefinition', value: 



        function _createPropertyDefinition(object, name, desciption, isSession) {
            var definition = object._definition[name] = {};

            if (typeof desciption === 'string') {
                // grab our type if all we've got is a string
                var type = object._ensureValidType(desciption);
                if (type) {
                    definition.type = type;}} else 

            {
                var type = object._ensureValidType(desciption.type);
                if (type) {
                    definition.type = type;}


                if (desciption.required) {
                    definition.required = true;}


                if (desciption['default'] && typeof desciption['default'] === 'object') {
                    throw new TypeError('The default value for ' + name + ' cannot be an object/array, must be a value or a function which returns a value/object/array');}


                definition['default'] = desciption['default'];

                definition.allowNull = desciption.allowNull ? desciption.allowNull : false;
                if (desciption.setOnce) {
                    definition.setOnce = true;}

                if (definition.required && definition['default'] === undefined && !definition.setOnce) {
                    definition['default'] = object._getDefaultForType(type);}

                definition.test = desciption.test;
                definition.values = desciption.values;}

            if (isSession) {
                definition.session = true;}


            // define a getter/setter on the prototype
            // but they get/set on the instance
            Object.defineProperty(object, name, { 
                set: function set(val) {
                    this.set(name, val);}, 

                get: function get() {
                    var value = this._values[name];
                    var typeDef = this._dataTypes[definition.type];
                    if (typeof value !== 'undefined') {
                        if (typeDef && typeDef.get) {
                            value = typeDef.get(value);}

                        return value;}

                    value = (0, _lodashResult2['default'])(definition, 'default');
                    this._values[name] = value;
                    return value;} });



            return definition;} }]);return State;})();exports['default'] = State;module.exports = exports['default'];

},{"./data-types":2,"lodash.result":5,"lodash.uniqueid":11}],4:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var dateTag = '[object Date]';

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Date` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isDate(new Date);
 * // => true
 *
 * _.isDate('Mon April 23 2012');
 * // => false
 */
function isDate(value) {
  return isObjectLike(value) && objToString.call(value) == dateTag;
}

module.exports = isDate;

},{}],5:[function(require,module,exports){
/**
 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseGet = require('lodash._baseget'),
    baseSlice = require('lodash._baseslice'),
    toPath = require('lodash._topath'),
    isArray = require('lodash.isarray'),
    isFunction = require('lodash.isfunction');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  var type = typeof value;
  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
    return true;
  }
  if (isArray(value)) {
    return false;
  }
  var result = !reIsDeepProp.test(value);
  return result || (object != null && value in toObject(object));
}

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * This method is like `_.get` except that if the resolved value is a function
 * it is invoked with the `this` binding of its parent object and its result
 * is returned.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to resolve.
 * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
 *
 * _.result(object, 'a[0].b.c1');
 * // => 3
 *
 * _.result(object, 'a[0].b.c2');
 * // => 4
 *
 * _.result(object, 'a.b.c', 'default');
 * // => 'default'
 *
 * _.result(object, 'a.b.c', _.constant('default'));
 * // => 'default'
 */
function result(object, path, defaultValue) {
  var result = object == null ? undefined : object[path];
  if (result === undefined) {
    if (object != null && !isKey(path, object)) {
      path = toPath(path);
      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
      result = object == null ? undefined : object[last(path)];
    }
    result = result === undefined ? defaultValue : result;
  }
  return isFunction(result) ? result.call(object) : result;
}

module.exports = result;

},{"lodash._baseget":6,"lodash._baseslice":7,"lodash._topath":8,"lodash.isarray":9,"lodash.isfunction":10}],6:[function(require,module,exports){
/**
 * lodash 3.7.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `get` without support for string paths
 * and default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path of the property to get.
 * @param {string} [pathKey] The key representation of path.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path, pathKey) {
  if (object == null) {
    return;
  }
  if (pathKey !== undefined && pathKey in toObject(object)) {
    path = [pathKey];
  }
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[path[index++]];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = baseGet;

},{}],7:[function(require,module,exports){
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  start = start == null ? 0 : (+start || 0);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : (+end || 0);
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],8:[function(require,module,exports){
/**
 * lodash 3.8.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArray = require('lodash.isarray');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  return value == null ? '' : (value + '');
}

/**
 * Converts `value` to property path array if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Array} Returns the property path array.
 */
function toPath(value) {
  if (isArray(value)) {
    return value;
  }
  var result = [];
  baseToString(value).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
}

module.exports = toPath;

},{"lodash.isarray":9}],9:[function(require,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var arrayTag = '[object Array]',
    funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isArray;

},{}],10:[function(require,module,exports){
/**
 * lodash 3.0.6 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isFunction;

},{}],11:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseToString = require('lodash._basetostring');

/** Used to generate unique IDs. */
var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is provided the ID is appended to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {string} [prefix] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return baseToString(prefix) + id;
}

module.exports = uniqueId;

},{"lodash._basetostring":12}],12:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbnVvcmRlci9TaXRlcy9kb28vaW5kZXguanMiLCIvVXNlcnMvbnVvcmRlci9TaXRlcy9kb28vbGliL2RhdGEtdHlwZXMuanMiLCIvVXNlcnMvbnVvcmRlci9TaXRlcy9kb28vbGliL3N0YXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5pc2RhdGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLnJlc3VsdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gucmVzdWx0L25vZGVfbW9kdWxlcy9sb2Rhc2guX2Jhc2VnZXQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLnJlc3VsdC9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlc2xpY2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLnJlc3VsdC9ub2RlX21vZHVsZXMvbG9kYXNoLl90b3BhdGgvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLnJlc3VsdC9ub2RlX21vZHVsZXMvbG9kYXNoLmlzYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLnJlc3VsdC9ub2RlX21vZHVsZXMvbG9kYXNoLmlzZnVuY3Rpb24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLnVuaXF1ZWlkL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC51bmlxdWVpZC9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNldG9zdHJpbmcvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7a01DQWtCLGFBQWE7O0FBRWhCO0FBQ1gsU0FBSyx1QkFBTyxFQUNmOzs7c01DSmtCLGVBQWU7O0FBRW5CO0FBQ1gsVUFBTSxFQUFFO0FBQ0osaUJBQVMsRUFBRSxvQkFBWTtBQUNuQixtQkFBTyxFQUFFLENBQUMsQ0FDYixFQUNKOzs7QUFD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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgU3RhdGUgZnJvbSAnLi9saWIvc3RhdGUnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgU3RhdGU6IFN0YXRlXG59O1xuIiwiaW1wb3J0IGlzRGF0ZSBmcm9tICdsb2Rhc2guaXNkYXRlJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHN0cmluZzoge1xuICAgICAgICAnZGVmYXVsdCc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGF0ZToge1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWwpIHtcbiAgICAgICAgICAgIGxldCBuZXdUeXBlO1xuICAgICAgICAgICAgaWYgKG5ld1ZhbCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ld1R5cGUgPSB0eXBlb2YgbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWlzRGF0ZShuZXdWYWwpKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGVWYWwgPSBuZXcgRGF0ZShuZXdWYWwpLnZhbHVlT2YoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmFOKGRhdGVWYWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbmV3VmFsIGNhbnQgYmUgcGFyc2VkLCB0aGVuIHRyeSBwYXJzZUludCBmaXJzdFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZVZhbCA9IG5ldyBEYXRlKHBhcnNlSW50KG5ld1ZhbCwgMTApKS52YWx1ZU9mKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOYU4oZGF0ZVZhbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBUeXBlRXJyb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsID0gZGF0ZVZhbDtcbiAgICAgICAgICAgICAgICAgICAgbmV3VHlwZSA9ICdkYXRlJztcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1R5cGUgPSB0eXBlb2YgbmV3VmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3VHlwZSA9ICdkYXRlJztcbiAgICAgICAgICAgICAgICBuZXdWYWwgPSBuZXdWYWwudmFsdWVPZigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHZhbDogbmV3VmFsLFxuICAgICAgICAgICAgICAgIHR5cGU6IG5ld1R5cGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIGdldDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgaWYgKHZhbCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUodmFsKTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGFycmF5OiB7XG4gICAgICAgIHNldDogZnVuY3Rpb24gKG5ld1ZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB2YWw6IG5ld1ZhbCxcbiAgICAgICAgICAgICAgICB0eXBlOiBBcnJheS5pc0FycmF5KG5ld1ZhbCkgPyAnYXJyYXknIDogdHlwZW9mIG5ld1ZhbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvYmplY3Q6IHtcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3VmFsKSB7XG4gICAgICAgICAgICBsZXQgbmV3VHlwZSA9IHR5cGVvZiBuZXdWYWw7XG4gICAgICAgICAgICBpZiAobmV3VHlwZSAhPT0gJ29iamVjdCcgJiYgbmV3VmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBuZXdWYWwgPSBudWxsO1xuICAgICAgICAgICAgICAgIG5ld1R5cGUgPSAnb2JqZWN0JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdmFsOiBuZXdWYWwsXG4gICAgICAgICAgICAgICAgdHlwZTogbmV3VHlwZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG4gICAgfVxufTsiLCJpbXBvcnQgdW5pcXVlSWQgZnJvbSAnbG9kYXNoLnVuaXF1ZWlkJztcbmltcG9ydCByZXN1bHQgZnJvbSAnbG9kYXNoLnJlc3VsdCc7XG5pbXBvcnQgYmFzZURhdGFUeXBlcyBmcm9tICcuL2RhdGEtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0ZSB7XG5cbiAgICBfZGVmaW5pdGlvbiA9IHt9O1xuICAgIFxuICAgIF92YWx1ZXMgPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yIChhdHRycywgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIFN0YXRlLl9pbml0aWFsTW9kZWxTZXR1cCh0aGlzKTtcblxuICAgICAgICB0aGlzLmNpZCA9IHVuaXF1ZUlkKCdzdGF0ZScpO1xuICAgICAgICB0aGlzLnBhcmVudCA9IG9wdGlvbnMucGFyZW50O1xuICAgIH1cblxuICAgIHNldCAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBleHRyYVByb3BlcnRpZXMgPSB0aGlzLmV4dHJhUHJvcGVydGllcztcbiAgICAgICAgbGV0IGNoYW5naW5nLCBjaGFuZ2VzLCBuZXdUeXBlLCBuZXdWYWwsIGRlZiwgY2FzdCwgZXJyLCBhdHRyLFxuICAgICAgICAgICAgYXR0cnMsIGRhdGFUeXBlLCBzaWxlbnQsIHVuc2V0LCBjdXJyZW50VmFsLCBpbml0aWFsLCBoYXNDaGFuZ2VkLCBpc0VxdWFsO1xuXG4gICAgICAgIC8vIEhhbmRsZSBib3RoIGBcImtleVwiLCB2YWx1ZWAgYW5kIGB7a2V5OiB2YWx1ZX1gIC1zdHlsZSBhcmd1bWVudHMuXG4gICAgICAgIGlmIChpc09iamVjdChrZXkpIHx8IGtleSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgYXR0cnMgPSBrZXk7XG4gICAgICAgICAgICBvcHRpb25zID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRycyA9IHt9O1xuICAgICAgICAgICAgYXR0cnNba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgaWYgKCF0aGlzLl92YWxpZGF0ZShhdHRycywgb3B0aW9ucykpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAvLyBFeHRyYWN0IGF0dHJpYnV0ZXMgYW5kIG9wdGlvbnMuXG4gICAgICAgIHVuc2V0ID0gb3B0aW9ucy51bnNldDtcbiAgICAgICAgc2lsZW50ID0gb3B0aW9ucy5zaWxlbnQ7XG4gICAgICAgIGluaXRpYWwgPSBvcHRpb25zLmluaXRpYWw7XG5cbiAgICAgICAgY2hhbmdlcyA9IFtdO1xuICAgICAgICBjaGFuZ2luZyA9IHRoaXMuX2NoYW5naW5nO1xuICAgICAgICB0aGlzLl9jaGFuZ2luZyA9IHRydWU7XG5cbiAgICAgICAgLy8gaWYgbm90IGFscmVhZHkgY2hhbmdpbmcsIHN0b3JlIHByZXZpb3VzXG4gICAgICAgIGlmICghY2hhbmdpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzQXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcztcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZWQgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZvciBlYWNoIGBzZXRgIGF0dHJpYnV0ZS4uLlxuICAgICAgICBmb3IgKGF0dHIgaW4gYXR0cnMpIHtcbiAgICAgICAgICAgIG5ld1ZhbCA9IGF0dHJzW2F0dHJdO1xuICAgICAgICAgICAgbmV3VHlwZSA9IHR5cGVvZiBuZXdWYWw7XG4gICAgICAgICAgICBjdXJyZW50VmFsID0gdGhpcy5fdmFsdWVzW2F0dHJdO1xuICAgICAgICAgICAgZGVmID0gdGhpcy5fZGVmaW5pdGlvblthdHRyXTtcblxuICAgICAgICAgICAgaWYgKCFkZWYpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGlzIGlzIGEgY2hpbGQgbW9kZWwgb3IgY29sbGVjdGlvblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jaGlsZHJlblthdHRyXSB8fCB0aGlzLl9jb2xsZWN0aW9uc1thdHRyXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzW2F0dHJdLnNldChuZXdWYWwsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV4dHJhUHJvcGVydGllcyA9PT0gJ2lnbm9yZScpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChleHRyYVByb3BlcnRpZXMgPT09ICdyZWplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ05vIFwiJyArIGF0dHIgKyAnXCIgcHJvcGVydHkgZGVmaW5lZCBvbiAnICsgKHRoaXMudHlwZSB8fCAndGhpcycpICsgJyBtb2RlbCBhbmQgZXh0cmFQcm9wZXJ0aWVzIG5vdCBzZXQgdG8gXCJpZ25vcmVcIiBvciBcImFsbG93XCInKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV4dHJhUHJvcGVydGllcyA9PT0gJ2FsbG93Jykge1xuICAgICAgICAgICAgICAgICAgICBkZWYgPSB0aGlzLl9jcmVhdGVQcm9wZXJ0eURlZmluaXRpb24oYXR0ciwgJ2FueScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXh0cmFQcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgdmFsdWUgZm9yIGV4dHJhUHJvcGVydGllczogXCInICsgZXh0cmFQcm9wZXJ0aWVzICsgJ1wiJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpc0VxdWFsID0gdGhpcy5fZ2V0Q29tcGFyZUZvclR5cGUoZGVmLnR5cGUpO1xuICAgICAgICAgICAgZGF0YVR5cGUgPSB0aGlzLl9kYXRhVHlwZXNbZGVmLnR5cGVdO1xuXG4gICAgICAgICAgICAvLyBjaGVjayB0eXBlIGlmIHdlIGhhdmUgb25lXG4gICAgICAgICAgICBpZiAoZGF0YVR5cGUgJiYgZGF0YVR5cGUuc2V0KSB7XG4gICAgICAgICAgICAgICAgY2FzdCA9IGRhdGFUeXBlLnNldChuZXdWYWwpO1xuICAgICAgICAgICAgICAgIG5ld1ZhbCA9IGNhc3QudmFsO1xuICAgICAgICAgICAgICAgIG5ld1R5cGUgPSBjYXN0LnR5cGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIHdlJ3ZlIGRlZmluZWQgYSB0ZXN0LCBydW4gaXRcbiAgICAgICAgICAgIGlmIChkZWYudGVzdCkge1xuICAgICAgICAgICAgICAgIGVyciA9IGRlZi50ZXN0LmNhbGwodGhpcywgbmV3VmFsLCBuZXdUeXBlKTtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb3BlcnR5IFxcJycgKyBhdHRyICsgJ1xcJyBmYWlsZWQgdmFsaWRhdGlvbiB3aXRoIGVycm9yOiAnICsgZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIHdlIGFyZSByZXF1aXJlZCBidXQgdW5kZWZpbmVkLCB0aHJvdyBlcnJvci5cbiAgICAgICAgICAgIC8vIElmIHdlIGFyZSBudWxsIGFuZCBhcmUgbm90IGFsbG93aW5nIG51bGwsIHRocm93IGVycm9yXG4gICAgICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgZGVmaW5lZCB0eXBlIGFuZCB0aGUgbmV3IHR5cGUgZG9lc24ndCBtYXRjaCwgYW5kIHdlIGFyZSBub3QgbnVsbCwgdGhyb3cgZXJyb3IuXG5cbiAgICAgICAgICAgIGlmIChpc1VuZGVmaW5lZChuZXdWYWwpICYmIGRlZi5yZXF1aXJlZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlcXVpcmVkIHByb3BlcnR5IFxcJycgKyBhdHRyICsgJ1xcJyBtdXN0IGJlIG9mIHR5cGUgJyArIGRlZi50eXBlICsgJy4gVHJpZWQgdG8gc2V0ICcgKyBuZXdWYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzTnVsbChuZXdWYWwpICYmIGRlZi5yZXF1aXJlZCAmJiAhZGVmLmFsbG93TnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb3BlcnR5IFxcJycgKyBhdHRyICsgJ1xcJyBtdXN0IGJlIG9mIHR5cGUgJyArIGRlZi50eXBlICsgJyAoY2Fubm90IGJlIG51bGwpLiBUcmllZCB0byBzZXQgJyArIG5ld1ZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKGRlZi50eXBlICYmIGRlZi50eXBlICE9PSAnYW55JyAmJiBkZWYudHlwZSAhPT0gbmV3VHlwZSkgJiYgIWlzTnVsbChuZXdWYWwpICYmICFpc1VuZGVmaW5lZChuZXdWYWwpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvcGVydHkgXFwnJyArIGF0dHIgKyAnXFwnIG11c3QgYmUgb2YgdHlwZSAnICsgZGVmLnR5cGUgKyAnLiBUcmllZCB0byBzZXQgJyArIG5ld1ZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGVmLnZhbHVlcyAmJiAhaW5jbHVkZXMoZGVmLnZhbHVlcywgbmV3VmFsKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb3BlcnR5IFxcJycgKyBhdHRyICsgJ1xcJyBtdXN0IGJlIG9uZSBvZiB2YWx1ZXM6ICcgKyBkZWYudmFsdWVzLmpvaW4oJywgJykgKyAnLiBUcmllZCB0byBzZXQgJyArIG5ld1ZhbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGhhc0NoYW5nZWQgPSAhaXNFcXVhbChjdXJyZW50VmFsLCBuZXdWYWwsIGF0dHIpO1xuXG4gICAgICAgICAgICAvLyBlbmZvcmNlIGBzZXRPbmNlYCBmb3IgcHJvcGVydGllcyBpZiBzZXRcbiAgICAgICAgICAgIGlmIChkZWYuc2V0T25jZSAmJiBjdXJyZW50VmFsICE9PSB1bmRlZmluZWQgJiYgaGFzQ2hhbmdlZCAmJiAhaW5pdGlhbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb3BlcnR5IFxcJycgKyBhdHRyICsgJ1xcJyBjYW4gb25seSBiZSBzZXQgb25jZS4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8ga2VlcCB0cmFjayBvZiBjaGFuZ2VkIGF0dHJpYnV0ZXNcbiAgICAgICAgICAgIC8vIGFuZCBwdXNoIHRvIGNoYW5nZXMgYXJyYXlcbiAgICAgICAgICAgIGlmIChoYXNDaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgY2hhbmdlcy5wdXNoKHtwcmV2OiBjdXJyZW50VmFsLCB2YWw6IG5ld1ZhbCwga2V5OiBhdHRyfSk7XG4gICAgICAgICAgICAgICAgc2VsZi5fY2hhbmdlZFthdHRyXSA9IG5ld1ZhbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHNlbGYuX2NoYW5nZWRbYXR0cl07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhY3R1YWxseSB1cGRhdGUgb3VyIHZhbHVlc1xuICAgICAgICBjaGFuZ2VzLmZvckVhY2goZnVuY3Rpb24gKGNoYW5nZSkge1xuICAgICAgICAgICAgc2VsZi5fcHJldmlvdXNBdHRyaWJ1dGVzW2NoYW5nZS5rZXldID0gY2hhbmdlLnByZXY7XG4gICAgICAgICAgICBpZiAodW5zZXQpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgc2VsZi5fdmFsdWVzW2NoYW5nZS5rZXldO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLl92YWx1ZXNbY2hhbmdlLmtleV0gPSBjaGFuZ2UudmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXNpbGVudCAmJiBjaGFuZ2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgc2VsZi5fcGVuZGluZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzaWxlbnQpIHtcbiAgICAgICAgICAgIGNoYW5nZXMuZm9yRWFjaChmdW5jdGlvbiAoY2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi50cmlnZ2VyKCdjaGFuZ2U6JyArIGNoYW5nZS5rZXksIHNlbGYsIGNoYW5nZS52YWwsIG9wdGlvbnMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBZb3UgbWlnaHQgYmUgd29uZGVyaW5nIHdoeSB0aGVyZSdzIGEgYHdoaWxlYCBsb29wIGhlcmUuIENoYW5nZXMgY2FuXG4gICAgICAgIC8vIGJlIHJlY3Vyc2l2ZWx5IG5lc3RlZCB3aXRoaW4gYFwiY2hhbmdlXCJgIGV2ZW50cy5cbiAgICAgICAgaWYgKGNoYW5naW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNpbGVudCkge1xuICAgICAgICAgICAgd2hpbGUgKHRoaXMuX3BlbmRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdjaGFuZ2UnLCB0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wZW5kaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2NoYW5naW5nID0gZmFsc2U7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGdldCAoYXR0cikge1xuICAgICAgICByZXR1cm4gdGhpc1thdHRyXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2luaXRpYWxNb2RlbFNldHVwIChvYmplY3QpIHtcbiAgICAgICAgLy8gV2Ugb25seSB3YW50IHRvIHNldHVwIHRoaW5ncyBvbmNlIG9uIHRoZSBjbGFzc1xuICAgICAgICAvLyBzbyBlYWNoIGluc3RhbmNlIGRvZXNuJ3QgaGF2ZSB0byBnbyB0aHJvdWdoIHRoZSBzZXR1cCBhZ2FpblxuICAgICAgICBpZihvYmplY3QuY29uc3RydWN0b3IuaW5pdHRlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpbmhlcml0ZWRBdHRyaWJ1dGVzID0ge1xuICAgICAgICAgICAgcHJvcHM6IFtdLFxuICAgICAgICAgICAgc2Vzc2lvbjogW10sXG4gICAgICAgICAgICBkYXRhVHlwZXM6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGNvbnN0cnVjdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yO1xuICAgICAgICB3aGlsZShjb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhpbmhlcml0ZWRBdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIGlmKGNvbnN0cnVjdG9yW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgaW5oZXJpdGVkQXR0cmlidXRlc1trZXldLnVuc2hpZnQoY29uc3RydWN0b3Jba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0cnVjdG9yID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnN0cnVjdG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkYXRhVHlwZXMgPSBPYmplY3QuYXNzaWduKHt9LCBiYXNlRGF0YVR5cGVzLCAuLi5pbmhlcml0ZWRBdHRyaWJ1dGVzLmRhdGFUeXBlcyk7XG4gICAgICAgIG9iamVjdC5jb25zdHJ1Y3Rvci5fZGF0YVR5cGVzID0gZGF0YVR5cGVzO1xuICAgICAgICBvYmplY3QuY29uc3RydWN0b3IuX2RhdGFUeXBlc0tleXMgPSBPYmplY3Qua2V5cyhkYXRhVHlwZXMpO1xuICAgICAgICBTdGF0ZS5fY3JlYXRlUHJvcGVydHlEZWZpbml0aW9ucyhvYmplY3QsIE9iamVjdC5hc3NpZ24oe30sIC4uLmluaGVyaXRlZEF0dHJpYnV0ZXMucHJvcHMpLCBmYWxzZSk7XG4gICAgICAgIFN0YXRlLl9jcmVhdGVQcm9wZXJ0eURlZmluaXRpb25zKG9iamVjdCwgT2JqZWN0LmFzc2lnbih7fSwgLi4uaW5oZXJpdGVkQXR0cmlidXRlcy5zZXNzaW9uKSwgdHJ1ZSk7XG5cbiAgICAgICAgb2JqZWN0LmNvbnN0cnVjdG9yLmluaXR0ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIF9lbnN1cmVWYWxpZFR5cGUgKHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuX2RhdGFUeXBlc0tleXMuaW5kZXhPZih0eXBlKSAhPT0gLTEgPyB0eXBlIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIF9nZXREZWZhdWx0Rm9yVHlwZSAodHlwZSkge1xuICAgICAgICBsZXQgZGF0YVR5cGUgPSB0aGlzLmNvbnN0cnVjdG9yLl9kYXRhVHlwZXNbdHlwZV07XG4gICAgICAgIHJldHVybiBkYXRhVHlwZSAmJiBkYXRhVHlwZS5kZWZhdWx0O1xuICAgIH1cblxuICAgIHN0YXRpYyBfY3JlYXRlUHJvcGVydHlEZWZpbml0aW9ucyAob2JqZWN0LCBwcm9wcywgaXNTZXNzaW9uKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHByb3BzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgU3RhdGUuX2NyZWF0ZVByb3BlcnR5RGVmaW5pdGlvbihvYmplY3QsIGtleSwgcHJvcHNba2V5XSwgaXNTZXNzaW9uKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIF9jcmVhdGVQcm9wZXJ0eURlZmluaXRpb24gKG9iamVjdCwgbmFtZSwgZGVzY2lwdGlvbiwgaXNTZXNzaW9uKSB7XG4gICAgICAgIGxldCBkZWZpbml0aW9uID0gb2JqZWN0Ll9kZWZpbml0aW9uW25hbWVdID0ge307XG5cbiAgICAgICAgaWYgKHR5cGVvZiBkZXNjaXB0aW9uID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgLy8gZ3JhYiBvdXIgdHlwZSBpZiBhbGwgd2UndmUgZ290IGlzIGEgc3RyaW5nXG4gICAgICAgICAgICBsZXQgdHlwZSA9IG9iamVjdC5fZW5zdXJlVmFsaWRUeXBlKGRlc2NpcHRpb24pO1xuICAgICAgICAgICAgaWYgKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBkZWZpbml0aW9uLnR5cGUgPSB0eXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBvYmplY3QuX2Vuc3VyZVZhbGlkVHlwZShkZXNjaXB0aW9uLnR5cGUpO1xuICAgICAgICAgICAgaWYgKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBkZWZpbml0aW9uLnR5cGUgPSB0eXBlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGVzY2lwdGlvbi5yZXF1aXJlZCkge1xuICAgICAgICAgICAgICAgIGRlZmluaXRpb24ucmVxdWlyZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGVzY2lwdGlvbi5kZWZhdWx0ICYmIHR5cGVvZiBkZXNjaXB0aW9uLmRlZmF1bHQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGRlZmF1bHQgdmFsdWUgZm9yICcgKyBuYW1lICsgJyBjYW5ub3QgYmUgYW4gb2JqZWN0L2FycmF5LCBtdXN0IGJlIGEgdmFsdWUgb3IgYSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGEgdmFsdWUvb2JqZWN0L2FycmF5Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRlZmluaXRpb24uZGVmYXVsdCA9IGRlc2NpcHRpb24uZGVmYXVsdDtcblxuICAgICAgICAgICAgZGVmaW5pdGlvbi5hbGxvd051bGwgPSBkZXNjaXB0aW9uLmFsbG93TnVsbCA/IGRlc2NpcHRpb24uYWxsb3dOdWxsIDogZmFsc2U7XG4gICAgICAgICAgICBpZiAoZGVzY2lwdGlvbi5zZXRPbmNlKSB7XG4gICAgICAgICAgICAgICAgZGVmaW5pdGlvbi5zZXRPbmNlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkZWZpbml0aW9uLnJlcXVpcmVkICYmIGRlZmluaXRpb24uZGVmYXVsdCA9PT0gdW5kZWZpbmVkICYmICFkZWZpbml0aW9uLnNldE9uY2UpIHtcbiAgICAgICAgICAgICAgICBkZWZpbml0aW9uLmRlZmF1bHQgPSBvYmplY3QuX2dldERlZmF1bHRGb3JUeXBlKHR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmaW5pdGlvbi50ZXN0ID0gZGVzY2lwdGlvbi50ZXN0O1xuICAgICAgICAgICAgZGVmaW5pdGlvbi52YWx1ZXMgPSBkZXNjaXB0aW9uLnZhbHVlcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNTZXNzaW9uKSB7XG4gICAgICAgICAgICBkZWZpbml0aW9uLnNlc3Npb24gPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVmaW5lIGEgZ2V0dGVyL3NldHRlciBvbiB0aGUgcHJvdG90eXBlXG4gICAgICAgIC8vIGJ1dCB0aGV5IGdldC9zZXQgb24gdGhlIGluc3RhbmNlXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0KG5hbWUsIHZhbCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5fdmFsdWVzW25hbWVdO1xuICAgICAgICAgICAgICAgIGxldCB0eXBlRGVmID0gdGhpcy5fZGF0YVR5cGVzW2RlZmluaXRpb24udHlwZV07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVEZWYgJiYgdHlwZURlZi5nZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdHlwZURlZi5nZXQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFsdWUgPSByZXN1bHQoZGVmaW5pdGlvbiwgJ2RlZmF1bHQnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkZWZpbml0aW9uO1xuICAgIH1cbn0iLCIvKipcbiAqIGxvZGFzaCAzLjAuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBEYXRlYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNEYXRlKG5ldyBEYXRlKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRGF0ZSgnTW9uIEFwcmlsIDIzIDIwMTInKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRGF0ZSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBkYXRlVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRGF0ZTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMS4yIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgYmFzZUdldCA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZWdldCcpLFxuICAgIGJhc2VTbGljZSA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZXNsaWNlJyksXG4gICAgdG9QYXRoID0gcmVxdWlyZSgnbG9kYXNoLl90b3BhdGgnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnbG9kYXNoLmlzYXJyYXknKSxcbiAgICBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnbG9kYXNoLmlzZnVuY3Rpb24nKTtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggcHJvcGVydHkgbmFtZXMgd2l0aGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlSXNEZWVwUHJvcCA9IC9cXC58XFxbKD86W15bXFxdXSp8KFtcIiddKSg/Oig/IVxcMSlbXlxcblxcXFxdfFxcXFwuKSo/XFwxKVxcXS8sXG4gICAgcmVJc1BsYWluUHJvcCA9IC9eXFx3KiQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcHJvcGVydHkgbmFtZSBhbmQgbm90IGEgcHJvcGVydHkgcGF0aC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeSBrZXlzIG9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5KHZhbHVlLCBvYmplY3QpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGlmICgodHlwZSA9PSAnc3RyaW5nJyAmJiByZUlzUGxhaW5Qcm9wLnRlc3QodmFsdWUpKSB8fCB0eXBlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciByZXN1bHQgPSAhcmVJc0RlZXBQcm9wLnRlc3QodmFsdWUpO1xuICByZXR1cm4gcmVzdWx0IHx8IChvYmplY3QgIT0gbnVsbCAmJiB2YWx1ZSBpbiB0b09iamVjdChvYmplY3QpKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGFuIG9iamVjdCBpZiBpdCdzIG5vdCBvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdCh2YWx1ZSkgPyB2YWx1ZSA6IE9iamVjdCh2YWx1ZSk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbGFzdCBlbGVtZW50IG9mIGBhcnJheWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGxhc3QgZWxlbWVudCBvZiBgYXJyYXlgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmxhc3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IDNcbiAqL1xuZnVuY3Rpb24gbGFzdChhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICByZXR1cm4gbGVuZ3RoID8gYXJyYXlbbGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIFtsYW5ndWFnZSB0eXBlXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBBdm9pZCBhIFY4IEpJVCBidWcgaW4gQ2hyb21lIDE5LTIwLlxuICAvLyBTZWUgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTEgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5nZXRgIGV4Y2VwdCB0aGF0IGlmIHRoZSByZXNvbHZlZCB2YWx1ZSBpcyBhIGZ1bmN0aW9uXG4gKiBpdCBpcyBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGl0cyBwYXJlbnQgb2JqZWN0IGFuZCBpdHMgcmVzdWx0XG4gKiBpcyByZXR1cm5lZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIHJlc29sdmUuXG4gKiBAcGFyYW0geyp9IFtkZWZhdWx0VmFsdWVdIFRoZSB2YWx1ZSByZXR1cm5lZCBpZiB0aGUgcmVzb2x2ZWQgdmFsdWUgaXMgYHVuZGVmaW5lZGAuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogW3sgJ2InOiB7ICdjMSc6IDMsICdjMic6IF8uY29uc3RhbnQoNCkgfSB9XSB9O1xuICpcbiAqIF8ucmVzdWx0KG9iamVjdCwgJ2FbMF0uYi5jMScpO1xuICogLy8gPT4gM1xuICpcbiAqIF8ucmVzdWx0KG9iamVjdCwgJ2FbMF0uYi5jMicpO1xuICogLy8gPT4gNFxuICpcbiAqIF8ucmVzdWx0KG9iamVjdCwgJ2EuYi5jJywgJ2RlZmF1bHQnKTtcbiAqIC8vID0+ICdkZWZhdWx0J1xuICpcbiAqIF8ucmVzdWx0KG9iamVjdCwgJ2EuYi5jJywgXy5jb25zdGFudCgnZGVmYXVsdCcpKTtcbiAqIC8vID0+ICdkZWZhdWx0J1xuICovXG5mdW5jdGlvbiByZXN1bHQob2JqZWN0LCBwYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgdmFyIHJlc3VsdCA9IG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W3BhdGhdO1xuICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICBpZiAob2JqZWN0ICE9IG51bGwgJiYgIWlzS2V5KHBhdGgsIG9iamVjdCkpIHtcbiAgICAgIHBhdGggPSB0b1BhdGgocGF0aCk7XG4gICAgICBvYmplY3QgPSBwYXRoLmxlbmd0aCA9PSAxID8gb2JqZWN0IDogYmFzZUdldChvYmplY3QsIGJhc2VTbGljZShwYXRoLCAwLCAtMSkpO1xuICAgICAgcmVzdWx0ID0gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3RbbGFzdChwYXRoKV07XG4gICAgfVxuICAgIHJlc3VsdCA9IHJlc3VsdCA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdFZhbHVlIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBpc0Z1bmN0aW9uKHJlc3VsdCkgPyByZXN1bHQuY2FsbChvYmplY3QpIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlc3VsdDtcbiIsIi8qKlxuICogbG9kYXNoIDMuNy4yIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldGAgd2l0aG91dCBzdXBwb3J0IGZvciBzdHJpbmcgcGF0aHNcbiAqIGFuZCBkZWZhdWx0IHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheX0gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHBhcmFtIHtzdHJpbmd9IFtwYXRoS2V5XSBUaGUga2V5IHJlcHJlc2VudGF0aW9uIG9mIHBhdGguXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXQob2JqZWN0LCBwYXRoLCBwYXRoS2V5KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAocGF0aEtleSAhPT0gdW5kZWZpbmVkICYmIHBhdGhLZXkgaW4gdG9PYmplY3Qob2JqZWN0KSkge1xuICAgIHBhdGggPSBbcGF0aEtleV07XG4gIH1cbiAgdmFyIGluZGV4ID0gMCxcbiAgICAgIGxlbmd0aCA9IHBhdGgubGVuZ3RoO1xuXG4gIHdoaWxlIChvYmplY3QgIT0gbnVsbCAmJiBpbmRleCA8IGxlbmd0aCkge1xuICAgIG9iamVjdCA9IG9iamVjdFtwYXRoW2luZGV4KytdXTtcbiAgfVxuICByZXR1cm4gKGluZGV4ICYmIGluZGV4ID09IGxlbmd0aCkgPyBvYmplY3QgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhbiBvYmplY3QgaWYgaXQncyBub3Qgb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgb2JqZWN0LlxuICovXG5mdW5jdGlvbiB0b09iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3QodmFsdWUpID8gdmFsdWUgOiBPYmplY3QodmFsdWUpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXQ7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMyAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnNsaWNlYCB3aXRob3V0IGFuIGl0ZXJhdGVlIGNhbGwgZ3VhcmQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzbGljZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHN0YXJ0IHBvc2l0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IFtlbmQ9YXJyYXkubGVuZ3RoXSBUaGUgZW5kIHBvc2l0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBzbGljZSBvZiBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBiYXNlU2xpY2UoYXJyYXksIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgc3RhcnQgPSBzdGFydCA9PSBudWxsID8gMCA6ICgrc3RhcnQgfHwgMCk7XG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IC1zdGFydCA+IGxlbmd0aCA/IDAgOiAobGVuZ3RoICsgc3RhcnQpO1xuICB9XG4gIGVuZCA9IChlbmQgPT09IHVuZGVmaW5lZCB8fCBlbmQgPiBsZW5ndGgpID8gbGVuZ3RoIDogKCtlbmQgfHwgMCk7XG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlbmd0aDtcbiAgfVxuICBsZW5ndGggPSBzdGFydCA+IGVuZCA/IDAgOiAoKGVuZCAtIHN0YXJ0KSA+Pj4gMCk7XG4gIHN0YXJ0ID4+Pj0gMDtcblxuICB2YXIgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gYXJyYXlbaW5kZXggKyBzdGFydF07XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlU2xpY2U7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjguMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCdsb2Rhc2guaXNhcnJheScpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVQcm9wTmFtZSA9IC9bXi5bXFxdXSt8XFxbKD86KC0/XFxkKyg/OlxcLlxcZCspPyl8KFtcIiddKSgoPzooPyFcXDIpW15cXG5cXFxcXXxcXFxcLikqPylcXDIpXFxdL2c7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGJhY2tzbGFzaGVzIGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlRXNjYXBlQ2hhciA9IC9cXFxcKFxcXFwpPy9nO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgaWYgaXQncyBub3Qgb25lLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWRcbiAqIGZvciBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6ICh2YWx1ZSArICcnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIHByb3BlcnR5IHBhdGggYXJyYXkgaWYgaXQncyBub3Qgb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG5mdW5jdGlvbiB0b1BhdGgodmFsdWUpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgYmFzZVRvU3RyaW5nKHZhbHVlKS5yZXBsYWNlKHJlUHJvcE5hbWUsIGZ1bmN0aW9uKG1hdGNoLCBudW1iZXIsIHF1b3RlLCBzdHJpbmcpIHtcbiAgICByZXN1bHQucHVzaChxdW90ZSA/IHN0cmluZy5yZXBsYWNlKHJlRXNjYXBlQ2hhciwgJyQxJykgOiAobnVtYmVyIHx8IG1hdGNoKSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvUGF0aDtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC40IChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpID4gNSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZuVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmblRvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UoL1tcXFxcXiQuKis/KClbXFxde318XS9nLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUlzQXJyYXkgPSBnZXROYXRpdmUoQXJyYXksICdpc0FycmF5Jyk7XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIHJldHVybiBpc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYXJyYXlUYWc7XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaSB3aGljaCByZXR1cm4gJ2Z1bmN0aW9uJyBmb3IgcmVnZXhlc1xuICAvLyBhbmQgU2FmYXJpIDggZXF1aXZhbGVudHMgd2hpY2ggcmV0dXJuICdvYmplY3QnIGZvciB0eXBlZCBhcnJheSBjb25zdHJ1Y3RvcnMuXG4gIHJldHVybiBpc09iamVjdCh2YWx1ZSkgJiYgb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gZnVuY1RhZztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc05hdGl2ZShBcnJheS5wcm90b3R5cGUucHVzaCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc05hdGl2ZShfKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHJldHVybiByZUlzTmF0aXZlLnRlc3QoZm5Ub1N0cmluZy5jYWxsKHZhbHVlKSk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgcmVJc0hvc3RDdG9yLnRlc3QodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuNiAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaSB3aGljaCByZXR1cm4gJ2Z1bmN0aW9uJyBmb3IgcmVnZXhlc1xuICAvLyBhbmQgU2FmYXJpIDggZXF1aXZhbGVudHMgd2hpY2ggcmV0dXJuICdvYmplY3QnIGZvciB0eXBlZCBhcnJheSBjb25zdHJ1Y3RvcnMuXG4gIHJldHVybiBpc09iamVjdCh2YWx1ZSkgJiYgb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gZnVuY1RhZztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjcuMCA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBiYXNlVG9TdHJpbmcgPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2V0b3N0cmluZycpO1xuXG4vKiogVXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSURzLiAqL1xudmFyIGlkQ291bnRlciA9IDA7XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgdW5pcXVlIElELiBJZiBgcHJlZml4YCBpcyBwcm92aWRlZCB0aGUgSUQgaXMgYXBwZW5kZWQgdG8gaXQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsaXR5XG4gKiBAcGFyYW0ge3N0cmluZ30gW3ByZWZpeF0gVGhlIHZhbHVlIHRvIHByZWZpeCB0aGUgSUQgd2l0aC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHVuaXF1ZSBJRC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy51bmlxdWVJZCgnY29udGFjdF8nKTtcbiAqIC8vID0+ICdjb250YWN0XzEwNCdcbiAqXG4gKiBfLnVuaXF1ZUlkKCk7XG4gKiAvLyA9PiAnMTA1J1xuICovXG5mdW5jdGlvbiB1bmlxdWVJZChwcmVmaXgpIHtcbiAgdmFyIGlkID0gKytpZENvdW50ZXI7XG4gIHJldHVybiBiYXNlVG9TdHJpbmcocHJlZml4KSArIGlkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHVuaXF1ZUlkO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjEgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIGlmIGl0J3Mgbm90IG9uZS4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkXG4gKiBmb3IgYG51bGxgIG9yIGB1bmRlZmluZWRgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiAodmFsdWUgKyAnJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRvU3RyaW5nO1xuIl19
