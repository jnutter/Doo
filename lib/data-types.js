import isDate from 'lodash.isdate';

export default {
    string: {
        'default': function () {
            return '';
        }
    },
    date: {
        set: function (newVal) {
            let newType;
            if (newVal === null) {
                newType = typeof null;
            } else if (!isDate(newVal)) {
                try {
                    let dateVal = new Date(newVal).valueOf();
                    if (isNaN(dateVal)) {
                        // If the newVal cant be parsed, then try parseInt first
                        dateVal = new Date(parseInt(newVal, 10)).valueOf();
                        if (isNaN(dateVal)) {
                            throw TypeError;
                        }
                    }
                    newVal = dateVal;
                    newType = 'date';
                } catch (e) {
                    newType = typeof newVal;
                }
            } else {
                newType = 'date';
                newVal = newVal.valueOf();
            }

            return {
                val: newVal,
                type: newType
            };
        },
        get: function (val) {
            if (val === null) {
                return val;
            }
            return new Date(val);
        },
        default: function () {
            return new Date();
        }
    },
    array: {
        set: function (newVal) {
            return {
                val: newVal,
                type: Array.isArray(newVal) ? 'array' : typeof newVal
            };
        },
        default: function () {
            return [];
        }
    },
    object: {
        set: function (newVal) {
            let newType = typeof newVal;
            if (newType !== 'object' && newVal === undefined) {
                newVal = null;
                newType = 'object';
            }
            return {
                val: newVal,
                type: newType
            };
        },
        default: function () {
            return {};
        }
    }
};