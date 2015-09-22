import uniqueId from 'lodash.uniqueid';
import result from 'lodash.result';
import baseDataTypes from './data-types';

export default class State {

    _definition = {};
    
    _values = {};

    constructor (attrs, options = {}) {
        State._initialModelSetup(this);

        this.cid = uniqueId('state');
        this.parent = options.parent;
    }

    set (key, value, options) {
        let self = this;
        let extraProperties = this.extraProperties;
        let changing, changes, newType, newVal, def, cast, err, attr,
            attrs, dataType, silent, unset, currentVal, initial, hasChanged, isEqual;

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (isObject(key) || key === null) {
            attrs = key;
            options = value;
        } else {
            attrs = {};
            attrs[key] = value;
        }

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
            this._changed = {};
        }

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
                    continue;
                } else if (extraProperties === 'ignore') {
                    continue;
                } else if (extraProperties === 'reject') {
                    throw new TypeError('No "' + attr + '" property defined on ' + (this.type || 'this') + ' model and extraProperties not set to "ignore" or "allow"');
                } else if (extraProperties === 'allow') {
                    def = this._createPropertyDefinition(attr, 'any');
                } else if (extraProperties) {
                    throw new TypeError('Invalid value for extraProperties: "' + extraProperties + '"');
                }
            }

            isEqual = this._getCompareForType(def.type);
            dataType = this._dataTypes[def.type];

            // check type if we have one
            if (dataType && dataType.set) {
                cast = dataType.set(newVal);
                newVal = cast.val;
                newType = cast.type;
            }

            // If we've defined a test, run it
            if (def.test) {
                err = def.test.call(this, newVal, newType);
                if (err) {
                    throw new TypeError('Property \'' + attr + '\' failed validation with error: ' + err);
                }
            }

            // If we are required but undefined, throw error.
            // If we are null and are not allowing null, throw error
            // If we have a defined type and the new type doesn't match, and we are not null, throw error.

            if (isUndefined(newVal) && def.required) {
                throw new TypeError('Required property \'' + attr + '\' must be of type ' + def.type + '. Tried to set ' + newVal);
            }
            if (isNull(newVal) && def.required && !def.allowNull) {
                throw new TypeError('Property \'' + attr + '\' must be of type ' + def.type + ' (cannot be null). Tried to set ' + newVal);
            }
            if ((def.type && def.type !== 'any' && def.type !== newType) && !isNull(newVal) && !isUndefined(newVal)) {
                throw new TypeError('Property \'' + attr + '\' must be of type ' + def.type + '. Tried to set ' + newVal);
            }
            if (def.values && !includes(def.values, newVal)) {
                throw new TypeError('Property \'' + attr + '\' must be one of values: ' + def.values.join(', ') + '. Tried to set ' + newVal);
            }

            hasChanged = !isEqual(currentVal, newVal, attr);

            // enforce `setOnce` for properties if set
            if (def.setOnce && currentVal !== undefined && hasChanged && !initial) {
                throw new TypeError('Property \'' + attr + '\' can only be set once.');
            }

            // keep track of changed attributes
            // and push to changes array
            if (hasChanged) {
                changes.push({prev: currentVal, val: newVal, key: attr});
                self._changed[attr] = newVal;
            } else {
                delete self._changed[attr];
            }
        }

        // actually update our values
        changes.forEach(function (change) {
            self._previousAttributes[change.key] = change.prev;
            if (unset) {
                delete self._values[change.key];
            } else {
                self._values[change.key] = change.val;
            }
        });

        if (!silent && changes.length) {
            self._pending = true;
        }
        if (!silent) {
            changes.forEach(function (change) {
                self.trigger('change:' + change.key, self, change.val, options);
            });
        }

        // You might be wondering why there's a `while` loop here. Changes can
        // be recursively nested within `"change"` events.
        if (changing) {
            return this;
        }
        if (!silent) {
            while (this._pending) {
                this._pending = false;
                this.trigger('change', this, options);
            }
        }
        this._pending = false;
        this._changing = false;
        return this;
    }

    get (attr) {
        return this[attr];
    }

    static _initialModelSetup (object) {
        // We only want to setup things once on the class
        // so each instance doesn't have to go through the setup again
        if(object.constructor.initted) {
            return;
        }
        let inheritedAttributes = {
            props: [],
            session: [],
            dataTypes: []
        };

        let constructor = object.constructor;
        while(constructor.name) {
            Object.keys(inheritedAttributes).forEach(function(key) {
                if(constructor[key]) {
                    inheritedAttributes[key].unshift(constructor[key]);
                }
            });

            constructor = Object.getPrototypeOf(constructor);
        }

        let dataTypes = Object.assign({}, baseDataTypes, ...inheritedAttributes.dataTypes);
        object.constructor._dataTypes = dataTypes;
        object.constructor._dataTypesKeys = Object.keys(dataTypes);
        State._createPropertyDefinitions(object, Object.assign({}, ...inheritedAttributes.props), false);
        State._createPropertyDefinitions(object, Object.assign({}, ...inheritedAttributes.session), true);

        object.constructor.initted = true;
    }

    _ensureValidType (type) {
        return this.constructor._dataTypesKeys.indexOf(type) !== -1 ? type : undefined;
    }

    _getDefaultForType (type) {
        let dataType = this.constructor._dataTypes[type];
        return dataType && dataType.default;
    }

    static _createPropertyDefinitions (object, props, isSession) {
        Object.keys(props).forEach(function(key) {
            State._createPropertyDefinition(object, key, props[key], isSession);
        });
    }

    static _createPropertyDefinition (object, name, desciption, isSession) {
        let definition = object._definition[name] = {};

        if (typeof desciption === 'string') {
            // grab our type if all we've got is a string
            let type = object._ensureValidType(desciption);
            if (type) {
                definition.type = type;
            }
        } else {
            let type = object._ensureValidType(desciption.type);
            if (type) {
                definition.type = type;
            }

            if (desciption.required) {
                definition.required = true;
            }

            if (desciption.default && typeof desciption.default === 'object') {
                throw new TypeError('The default value for ' + name + ' cannot be an object/array, must be a value or a function which returns a value/object/array');
            }

            definition.default = desciption.default;

            definition.allowNull = desciption.allowNull ? desciption.allowNull : false;
            if (desciption.setOnce) {
                definition.setOnce = true;
            }
            if (definition.required && definition.default === undefined && !definition.setOnce) {
                definition.default = object._getDefaultForType(type);
            }
            definition.test = desciption.test;
            definition.values = desciption.values;
        }
        if (isSession) {
            definition.session = true;
        }

        // define a getter/setter on the prototype
        // but they get/set on the instance
        Object.defineProperty(object, name, {
            set: function (val) {
                this.set(name, val);
            },
            get: function () {
                let value = this._values[name];
                let typeDef = this._dataTypes[definition.type];
                if (typeof value !== 'undefined') {
                    if (typeDef && typeDef.get) {
                        value = typeDef.get(value);
                    }
                    return value;
                }
                value = result(definition, 'default');
                this._values[name] = value;
                return value;
            }
        });

        return definition;
    }
}