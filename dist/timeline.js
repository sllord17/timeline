var Timeline = (function (exports) {
  SVGElement.prototype.getX = function () {
    return +this.getAttribute('x');
  };

  SVGElement.prototype.getY = function () {
    return +this.getAttribute('y');
  };

  SVGElement.prototype.getWidth = function () {
    return +this.getAttribute('width');
  };

  SVGElement.prototype.getHeight = function () {
    return +this.getAttribute('height');
  };

  SVGElement.prototype.getEndX = function () {
    return this.getX() + this.getWidth();
  };

  SVGElement.prototype.applyStyle = function (style) {
    var _this = this;

    Object.keys(style).forEach(function (k) {
      return _this.style[k] = style[k];
    });
  };

  Element.prototype.setAttributes = function (attrs) {
    var _this2 = this;

    Object.keys(attrs).forEach(function (k) {
      return _this2.setAttribute(k, attrs[k]);
    });
  };
  /*
   * classList.js: Cross-browser full element.classList implementation.
   * 1.2.20171210
   *
   * By Eli Grey, http://eligrey.com
   * License: Dedicated to the public domain.
   *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
   */

  /*global self, document, DOMException */

  /*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */


  if ('document' in self) {
    // Full polyfill for browsers with no classList support
    // Including IE < Edge missing SVGElement.classList
    if (!('classList' in document.createElement('_')) || document.createElementNS && !('classList' in document.createElementNS('http://www.w3.org/2000/svg', 'g'))) {

      (function (view) {

        if (!('Element' in view)) return;

        var classListProp = 'classList',
            protoProp = 'prototype',
            elemCtrProto = view.Element[protoProp],
            objCtr = Object,
            strTrim = String[protoProp].trim || function () {
          return this.replace(/^\s+|\s+$/g, '');
        },
            arrIndexOf = Array[protoProp].indexOf || function (item) {
          var i = 0,
              len = this.length;

          for (; i < len; i++) {
            if (i in this && this[i] === item) {
              return i;
            }
          }

          return -1;
        },
            // Vendors: please allow content code to instantiate DOMExceptions
        DOMEx = function DOMEx(type, message) {
          this.name = type;
          this.code = DOMException[type];
          this.message = message;
        },
            checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
          if (token === '') {
            throw new DOMEx('SYNTAX_ERR', 'The token must not be empty.');
          }

          if (/\s/.test(token)) {
            throw new DOMEx('INVALID_CHARACTER_ERR', 'The token must not contain space characters.');
          }

          return arrIndexOf.call(classList, token);
        },
            ClassList = function ClassList(elem) {
          var trimmedClasses = strTrim.call(elem.getAttribute('class') || ''),
              classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
              i = 0,
              len = classes.length;

          for (; i < len; i++) {
            this.push(classes[i]);
          }

          this._updateClassName = function () {
            elem.setAttribute('class', this.toString());
          };
        },
            classListProto = ClassList[protoProp] = [],
            classListGetter = function classListGetter() {
          return new ClassList(this);
        }; // Most DOMException implementations don't allow calling DOMException's toString()
        // on non-DOMExceptions. Error's toString() is sufficient here.


        DOMEx[protoProp] = Error[protoProp];

        classListProto.item = function (i) {
          return this[i] || null;
        };

        classListProto.contains = function (token) {
          return ~checkTokenAndGetIndex(this, token + '');
        };

        classListProto.add = function () {
          var tokens = arguments,
              i = 0,
              l = tokens.length,
              token,
              updated = false;

          do {
            token = tokens[i] + '';

            if (!~checkTokenAndGetIndex(this, token)) {
              this.push(token);
              updated = true;
            }
          } while (++i < l);

          if (updated) {
            this._updateClassName();
          }
        };

        classListProto.remove = function () {
          var tokens = arguments,
              i = 0,
              l = tokens.length,
              token,
              updated = false,
              index;

          do {
            token = tokens[i] + '';
            index = checkTokenAndGetIndex(this, token);

            while (~index) {
              this.splice(index, 1);
              updated = true;
              index = checkTokenAndGetIndex(this, token);
            }
          } while (++i < l);

          if (updated) {
            this._updateClassName();
          }
        };

        classListProto.toggle = function (token, force) {
          var result = this.contains(token),
              method = result ? force !== true && 'remove' : force !== false && 'add';

          if (method) {
            this[method](token);
          }

          if (force === true || force === false) {
            return force;
          } else {
            return !result;
          }
        };

        classListProto.replace = function (token, replacement_token) {
          var index = checkTokenAndGetIndex(token + '');

          if (~index) {
            this.splice(index, 1, replacement_token);

            this._updateClassName();
          }
        };

        classListProto.toString = function () {
          return this.join(' ');
        };

        if (objCtr.defineProperty) {
          var classListPropDesc = {
            get: classListGetter,
            enumerable: true,
            configurable: true
          };

          try {
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
          } catch (ex) {
            // IE 8 doesn't support enumerable:true
            // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
            // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
            if (ex.number === undefined || ex.number === -0x7ff5ec54) {
              classListPropDesc.enumerable = false;
              objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
            }
          }
        } else if (objCtr[protoProp].__defineGetter__) {
          elemCtrProto.__defineGetter__(classListProp, classListGetter);
        }
      })(self);
    } // There is full or partial native classList support, so just check if we need

    (function () {

      var testElement = document.createElement('_');
      testElement.classList.add('c1', 'c2'); // Polyfill for IE 10/11 and Firefox <26, where classList.add and
      // classList.remove exist but support only one argument at a time.

      if (!testElement.classList.contains('c2')) {
        var createMethod = function createMethod(method) {
          var original = DOMTokenList.prototype[method];

          DOMTokenList.prototype[method] = function (token) {
            var i,
                len = arguments.length;

            for (i = 0; i < len; i++) {
              token = arguments[i];
              original.call(this, token);
            }
          };
        };

        createMethod('add');
        createMethod('remove');
      }

      testElement.classList.toggle('c3', false); // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
      // support the second argument.

      if (testElement.classList.contains('c3')) {
        var _toggle = DOMTokenList.prototype.toggle;

        DOMTokenList.prototype.toggle = function (token, force) {
          if (1 in arguments && !this.contains(token) === !force) {
            return force;
          } else {
            return _toggle.call(this, token);
          }
        };
      } // replace() polyfill


      if (!('replace' in document.createElement('_').classList)) {
        DOMTokenList.prototype.replace = function (token, replacement_token) {
          var tokens = this.toString().split(' '),
              index = tokens.indexOf(token + '');

          if (~index) {
            tokens = tokens.slice(index);
            this.remove.apply(this, tokens);
            this.add(replacement_token);
            this.add.apply(this, tokens.slice(1));
          }
        };
      }

      testElement = null;
    })();
  } // Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md

  (function (arr) {
    arr.forEach(function (item) {
      if (item.hasOwnProperty('prepend')) {
        return;
      }

      Object.defineProperty(item, 'prepend', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function prepend() {
          var argArr = Array.prototype.slice.call(arguments),
              docFrag = document.createDocumentFragment();
          argArr.forEach(function (argItem) {
            var isNode = argItem instanceof Node;
            docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
          });
          this.insertBefore(docFrag, this.firstChild);
        }
      });
    });
  })([Element.prototype, Document.prototype, DocumentFragment.prototype]);

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
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

  function _isNativeReflectConstruct() {
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

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function () {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o) {
    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var it,
        normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var EVENT;

  (function (EVENT) {
    EVENT["SHOW_POPUP"] = "SHOW_POPUP";
    EVENT["HIDE_POPUP"] = "HIDE_POPUP";
    EVENT["TOGGLE_POPUP"] = "TOGGLE_POPUP";
    EVENT["AFTER_RENDER"] = "AFTER_RENDER";
    EVENT["AFTER_LAYOUT"] = "AFTER_LAYOUT";
  })(EVENT || (EVENT = {}));

  var Prop = /*#__PURE__*/function () {
    function Prop() {
      var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Prop);

      _defineProperty(this, "_properties", {});

      this.properties = o;
    }

    _createClass(Prop, [{
      key: "set",
      value: function set(key, value) {
        this._properties[key] = value;
        return this;
      }
    }, {
      key: "get",
      value: function get(key) {
        return this._properties[key];
      }
    }, {
      key: "unset",
      value: function unset(key) {
        delete this._properties[key];
      }
    }, {
      key: "type",
      get: function get() {
        return this.get('type');
      }
    }, {
      key: "properties",
      get: function get() {
        return _objectSpread2({}, this._properties);
      },
      set: function set(o) {
        this._properties = _objectSpread2(_objectSpread2({}, this._properties), o);
      }
    }]);

    return Prop;
  }();

  var svg = function svg(tag, attrs) {
    var elem = document.createElementNS('http://www.w3.org/2000/svg', tag);

    for (var attr in attrs) {
      if (attr === 'append_to') {
        var parent = attrs.append_to;
        parent.appendChild(elem);
      } else if (attr === 'prepend_to') {
        var _parent = attrs.prepend_to;

        _parent.prepend(elem);
      } else if (attr === 'innerHTML') {
        elem.innerHTML = attrs.innerHTML;
      } else {
        elem.setAttribute(attr, attrs[attr]);
      }
    }

    return elem;
  };
  var toTextFragment = function toTextFragment(text) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = text;

    while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
    }

    return frag;
  };
  var toDom = function toDom(html) {
    var frag = document.createRange().createContextualFragment(html);
    return frag.firstChild;
  };
  var delegate = function delegate(element, event, selector, listener) {
    element.addEventListener(event, function (e) {
      var delegatedTarget = e.target.closest(selector);

      if (delegatedTarget) {
        var delegateEvent = _objectSpread2(_objectSpread2({}, e), {}, {
          target: delegatedTarget
        });

        listener.call(this, delegateEvent);
      }
    });
  };
  var debounce = function debounce(fn, time) {
    var timeout;
    return function () {
      var _this = this;

      var functionCall = function functionCall() {
        return fn.apply(_this, _this.arguments);
      };

      clearTimeout(timeout);
      timeout = setTimeout(functionCall, time);
    };
  };

  var Popup = /*#__PURE__*/function (_Prop) {
    _inherits(Popup, _Prop);

    var _super = _createSuper(Popup);

    function Popup(options, parent) {
      var _this;

      _classCallCheck(this, Popup);

      _this = _super.call(this, {
        parent: parent,
        title: toDom('<div class="title"></div>'),
        subtitle: toDom('<div class="subtitle"></div>'),
        pointer: toDom('<div class="pointer"></div>')
      });

      _defineProperty(_assertThisInitialized(_this), "options", void 0);

      _this.options = options;
      parent.appendChild(_this.get('title'));
      parent.appendChild(_this.get('subtitle'));
      parent.appendChild(_this.get('pointer'));
      return _this;
    }

    _createClass(Popup, [{
      key: "show",
      value: function show(config) {
        if (!config.positionTarget) throw new Error('target is required to show popup');
        var parent = this.get('parent');
        parent.style.display = 'block';

        if (!config.position) {
          config.position = 'left';
        }

        if (this.options.popupProducer) {
          var pointer = this.get('pointer');
          parent.innerHTML = this.options.popupProducer(config.eventTarget);
          parent.appendChild(pointer);
        } else {
          this.get('title').innerHTML = config.title;
          this.get('subtitle').innerHTML = config.subtitle;
          parent.style.width = parent.clientWidth + 'px';
        }

        var pos = config.positionTarget.getBoundingClientRect();

        if (config.position == 'left') {
          parent.style.left = pos.x + (pos.width + 10) + 'px';
          parent.style.top = pos.y + 'px';
          this.get('pointer').style.transform = 'rotateZ(90deg)';
          this.get('pointer').style.left = '-7px';
          this.get('pointer').style.top = '2px';
        }
      }
    }, {
      key: "hide",
      value: function hide() {
        this.get('parent').style.display = 'none';
      }
    }, {
      key: "isVisible",
      value: function isVisible() {
        return this.get('parent').style.display == 'none';
      }
    }]);

    return Popup;
  }(Prop);

  (function (VIEW_MODE) {
    VIEW_MODE[VIEW_MODE["FIT"] = -1] = "FIT";
    VIEW_MODE[VIEW_MODE["QUARTER_DAY"] = 0.25] = "QUARTER_DAY";
    VIEW_MODE[VIEW_MODE["HALF_DAY"] = 0.5] = "HALF_DAY";
    VIEW_MODE[VIEW_MODE["DAY"] = 1] = "DAY";
    VIEW_MODE[VIEW_MODE["WEEK"] = 7] = "WEEK";
    VIEW_MODE[VIEW_MODE["MONTH"] = 30] = "MONTH";
    VIEW_MODE[VIEW_MODE["YEAR"] = 365] = "YEAR";
  })(exports.VIEW_MODE || (exports.VIEW_MODE = {}));

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var dayjs_min = createCommonjsModule(function (module, exports) {
  !function(t,e){module.exports=e();}(commonjsGlobal,function(){var t="millisecond",e="second",n="minute",r="hour",i="day",s="week",u="month",o="quarter",a="year",h=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,f=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,c=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},d={s:c,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+c(r,2,"0")+":"+c(i,2,"0")},m:function(t,e){var n=12*(e.year()-t.year())+(e.month()-t.month()),r=t.clone().add(n,u),i=e-r<0,s=t.clone().add(n+(i?-1:1),u);return Number(-(n+(e-r)/(i?r-s:s-r))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return {M:u,y:a,w:s,d:i,D:"date",h:r,m:n,s:e,ms:t,Q:o}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},$={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},l="en",m={};m[l]=$;var y=function(t){return t instanceof v},M=function(t,e,n){var r;if(!t)return l;if("string"==typeof t)m[t]&&(r=t),e&&(m[t]=e,r=t);else {var i=t.name;m[i]=t,r=i;}return !n&&r&&(l=r),r||!n&&l},g=function(t,e){if(y(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new v(n)},D=d;D.l=M,D.i=y,D.w=function(t,e){return g(t,{locale:e.$L,utc:e.$u,$offset:e.$offset})};var v=function(){function c(t){this.$L=this.$L||M(t.locale,null,!0),this.parse(t);}var d=c.prototype;return d.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(D.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(h);if(r)return n?new Date(Date.UTC(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)):new Date(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)}return new Date(e)}(t),this.init();},d.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},d.$utils=function(){return D},d.isValid=function(){return !("Invalid Date"===this.$d.toString())},d.isSame=function(t,e){var n=g(t);return this.startOf(e)<=n&&n<=this.endOf(e)},d.isAfter=function(t,e){return g(t)<this.startOf(e)},d.isBefore=function(t,e){return this.endOf(e)<g(t)},d.$g=function(t,e,n){return D.u(t)?this[e]:this.set(n,t)},d.year=function(t){return this.$g(t,"$y",a)},d.month=function(t){return this.$g(t,"$M",u)},d.day=function(t){return this.$g(t,"$W",i)},d.date=function(t){return this.$g(t,"$D","date")},d.hour=function(t){return this.$g(t,"$H",r)},d.minute=function(t){return this.$g(t,"$m",n)},d.second=function(t){return this.$g(t,"$s",e)},d.millisecond=function(e){return this.$g(e,"$ms",t)},d.unix=function(){return Math.floor(this.valueOf()/1e3)},d.valueOf=function(){return this.$d.getTime()},d.startOf=function(t,o){var h=this,f=!!D.u(o)||o,c=D.p(t),d=function(t,e){var n=D.w(h.$u?Date.UTC(h.$y,e,t):new Date(h.$y,e,t),h);return f?n:n.endOf(i)},$=function(t,e){return D.w(h.toDate()[t].apply(h.toDate("s"),(f?[0,0,0,0]:[23,59,59,999]).slice(e)),h)},l=this.$W,m=this.$M,y=this.$D,M="set"+(this.$u?"UTC":"");switch(c){case a:return f?d(1,0):d(31,11);case u:return f?d(1,m):d(0,m+1);case s:var g=this.$locale().weekStart||0,v=(l<g?l+7:l)-g;return d(f?y-v:y+(6-v),m);case i:case"date":return $(M+"Hours",0);case r:return $(M+"Minutes",1);case n:return $(M+"Seconds",2);case e:return $(M+"Milliseconds",3);default:return this.clone()}},d.endOf=function(t){return this.startOf(t,!1)},d.$set=function(s,o){var h,f=D.p(s),c="set"+(this.$u?"UTC":""),d=(h={},h[i]=c+"Date",h.date=c+"Date",h[u]=c+"Month",h[a]=c+"FullYear",h[r]=c+"Hours",h[n]=c+"Minutes",h[e]=c+"Seconds",h[t]=c+"Milliseconds",h)[f],$=f===i?this.$D+(o-this.$W):o;if(f===u||f===a){var l=this.clone().set("date",1);l.$d[d]($),l.init(),this.$d=l.set("date",Math.min(this.$D,l.daysInMonth())).toDate();}else d&&this.$d[d]($);return this.init(),this},d.set=function(t,e){return this.clone().$set(t,e)},d.get=function(t){return this[D.p(t)]()},d.add=function(t,o){var h,f=this;t=Number(t);var c=D.p(o),d=function(e){var n=g(f);return D.w(n.date(n.date()+Math.round(e*t)),f)};if(c===u)return this.set(u,this.$M+t);if(c===a)return this.set(a,this.$y+t);if(c===i)return d(1);if(c===s)return d(7);var $=(h={},h[n]=6e4,h[r]=36e5,h[e]=1e3,h)[c]||1,l=this.$d.getTime()+t*$;return D.w(l,this)},d.subtract=function(t,e){return this.add(-1*t,e)},d.format=function(t){var e=this;if(!this.isValid())return "Invalid Date";var n=t||"YYYY-MM-DDTHH:mm:ssZ",r=D.z(this),i=this.$locale(),s=this.$H,u=this.$m,o=this.$M,a=i.weekdays,h=i.months,c=function(t,r,i,s){return t&&(t[r]||t(e,n))||i[r].substr(0,s)},d=function(t){return D.s(s%12||12,t,"0")},$=i.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:o+1,MM:D.s(o+1,2,"0"),MMM:c(i.monthsShort,o,h,3),MMMM:c(h,o),D:this.$D,DD:D.s(this.$D,2,"0"),d:String(this.$W),dd:c(i.weekdaysMin,this.$W,a,2),ddd:c(i.weekdaysShort,this.$W,a,3),dddd:a[this.$W],H:String(s),HH:D.s(s,2,"0"),h:d(1),hh:d(2),a:$(s,u,!0),A:$(s,u,!1),m:String(u),mm:D.s(u,2,"0"),s:String(this.$s),ss:D.s(this.$s,2,"0"),SSS:D.s(this.$ms,3,"0"),Z:r};return n.replace(f,function(t,e){return e||l[t]||r.replace(":","")})},d.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},d.diff=function(t,h,f){var c,d=D.p(h),$=g(t),l=6e4*($.utcOffset()-this.utcOffset()),m=this-$,y=D.m(this,$);return y=(c={},c[a]=y/12,c[u]=y,c[o]=y/3,c[s]=(m-l)/6048e5,c[i]=(m-l)/864e5,c[r]=m/36e5,c[n]=m/6e4,c[e]=m/1e3,c)[d]||m,f?y:D.a(y)},d.daysInMonth=function(){return this.endOf(u).$D},d.$locale=function(){return m[this.$L]},d.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=M(t,e,!0);return r&&(n.$L=r),n},d.clone=function(){return D.w(this.$d,this)},d.toDate=function(){return new Date(this.valueOf())},d.toJSON=function(){return this.isValid()?this.toISOString():null},d.toISOString=function(){return this.$d.toISOString()},d.toString=function(){return this.$d.toUTCString()},c}();return g.prototype=v.prototype,g.extend=function(t,e){return t(e,v,g),g},g.locale=M,g.isDayjs=y,g.unix=function(t){return g(1e3*t)},g.en=m[l],g.Ls=m,g});
  });

  var Background = /*#__PURE__*/function (_Prop) {
    _inherits(Background, _Prop);

    var _super = _createSuper(Background);

    function Background(options) {
      var _this;

      _classCallCheck(this, Background);

      _this = _super.call(this, {
        width: 0,
        height: 0
      });

      _defineProperty(_assertThisInitialized(_this), "options", void 0);

      _this.options = options;
      return _this;
    }

    _createClass(Background, [{
      key: "render",
      value: function render(dates, tasks) {
        var dom = this.options.parent.querySelector('.timeline-right-bottom > svg');
        var layer = svg('g', {
          "class": 'grid',
          prepend_to: dom
        });
        this.drawBackground(layer);
        this.drawRows(layer, tasks);
        this.drawTicks(layer, dates);
      }
    }, {
      key: "drawBackground",
      value: function drawBackground(layer) {
        svg('rect', {
          x: 0,
          y: 0,
          width: this.get('width'),
          height: this.get('height'),
          "class": 'grid-background',
          append_to: layer
        });
      }
    }, {
      key: "drawRows",
      value: function drawRows(layer, tasks) {
        var _this2 = this;

        var rowsLayer = svg('g', {
          append_to: layer
        });
        var linesLayer = svg('g', {
          append_to: layer
        });
        var rowWidth = this.get('width');
        var y = 0;
        tasks.forEach(function (task) {
          var rowHeight = task.get('height') + _this2.options.padding;

          svg('rect', {
            x: 0,
            y: y,
            width: rowWidth,
            height: rowHeight,
            "class": 'grid-row',
            append_to: rowsLayer
          });
          svg('line', {
            x1: 0,
            y1: y + rowHeight,
            x2: rowWidth,
            y2: y + rowHeight,
            "class": 'row-line',
            append_to: linesLayer
          });
          y += rowHeight;
        });
      }
    }, {
      key: "drawTicks",
      value: function drawTicks(layer, dates) {
        var x = 0;

        var _iterator = _createForOfIteratorHelper(dates),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var date = _step.value;
            var clazz = 'tick';

            if (exports.VIEW_MODE.DAY == this.options.viewMode && date.date() == 1 || exports.VIEW_MODE.WEEK == this.options.viewMode && date.date() >= 1 && date.date() < 8 || exports.VIEW_MODE.MONTH == this.options.viewMode && (date.month() + 1) % 3 === 0) {
              clazz += ' thick';
            }

            svg('path', {
              d: "M ".concat(x, " 0 v ").concat(this.get('height')),
              "class": clazz,
              append_to: layer
            });

            if (exports.VIEW_MODE.MONTH == this.options.viewMode) {
              x += date.daysInMonth() * this.options.columnWidth / 30;
            } else {
              x += this.options.columnWidth;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }, {
      key: "highlightCurrentDay",
      value: function highlightCurrentDay(layer, offset) {
        if (exports.VIEW_MODE.DAY == this.options.viewMode) {
          var x = dayjs_min().diff(this.get('start'), 'hour') / this.options.step * this.options.columnWidth;
          svg('rect', {
            x: x + offset.x,
            y: 0,
            width: this.options.columnWidth,
            height: this.get('height'),
            "class": 'today-highlight',
            append_to: layer
          });
        }
      }
    }]);

    return Background;
  }(Prop);

  var Column = /*#__PURE__*/function (_Prop) {
    _inherits(Column, _Prop);

    var _super = _createSuper(Column);

    function Column(options, config, tasks) {
      var _this;

      _classCallCheck(this, Column);

      _this = _super.call(this, _objectSpread2(_objectSpread2({}, config), {}, {
        tasks: tasks
      }));

      _defineProperty(_assertThisInitialized(_this), "options", void 0);

      _this.options = options;
      options.subscribe(EVENT.AFTER_RENDER, _assertThisInitialized(_this));
      return _this;
    }

    _createClass(Column, [{
      key: "eventHandler",
      value: function eventHandler(event) {
        if (event == EVENT.AFTER_RENDER) {
          this.get('dom').querySelectorAll('.column-background').forEach(function (r) {
            r.setAttribute('width', r.columnRow.getBBox().width + '');
          });
        }
      }
    }, {
      key: "render",
      value: function render(header, body, offset) {
        var _this2 = this;

        offset.y = this.options.headerHeight;
        var title = svg('text', {
          append_to: header,
          "class": 'column-header',
          x: offset.x,
          y: offset.y
        });
        this.set('title', title);
        var text = toTextFragment(this.get('text'));
        title.appendChild(text);
        this.set('dom', svg('g', {
          append_to: body,
          "class": 'column-wrapper',
          transform: "translate(".concat(offset.x, ", 0)")
        }));
        offset.y = this.options.padding / 2;
        this.get('tasks').forEach(function (t) {
          var column = svg('text', {
            append_to: _this2.get('dom'),
            "class": 'column-' + _this2.get('field'),
            height: t.get('height'),
            transform: "translate(0, ".concat(offset.y, ")")
          });
          var bg = svg('g', {
            prepend_to: _this2.get('dom'),
            "class": 'column-background-' + _this2.get('field'),
            height: t.get('height'),
            transform: "translate(0, ".concat(offset.y, ")")
          });

          _this2.renderRow(column, bg, t);

          offset.y += t.get('height') + _this2.options.padding;
        });
      }
    }, {
      key: "getWidth",
      value: function getWidth() {
        return this.get('dom').getBBox().width;
      }
    }, {
      key: "renderRow",
      value: function renderRow(layer, backgroundLayer, task) {
        var _this3 = this;

        var value = task.get(this.get('field'));
        if (!value) return;

        if (typeof value == 'string' || typeof value == 'number') {
          return this.renderTspan(layer, null, task, {
            label: value
          });
        }

        console.assert(Array.isArray(value), "Column value isn't a string or array");
        var offset = {
          x: 0,
          y: 0
        };
        value.forEach(function (v, idx) {
          _this3.renderTspan(layer, backgroundLayer, task, v, offset, idx);

          offset.y += task.getRowHeight(idx);
        });
      }
    }, {
      key: "renderTspan",
      value: function renderTspan(textLayer, backgroundLayer, task, obj) {
        var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
          x: 0,
          y: 0
        };
        var idx = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        var label = svg('tspan', {
          append_to: textLayer,
          "class": 'column-text',
          dy: offset.y,
          'dominant-baseline': 'hanging',
          x: 0
        });

        if (obj.labelStyle) {
          label.applyStyle(obj.labelStyle);
        }

        var text = toTextFragment(obj.label);
        label.appendChild(text);

        if (obj.backgroundStyle) {
          var background;

          if (obj.backgroundShape && obj.backgroundShape == 'circle') {
            background = svg('circle', {
              cx: task.getRowHeight(idx) / 2,
              cy: offset.y + task.getRowHeight(idx) / 2,
              height: task.getRowHeight(idx),
              r: task.getRowHeight(idx) / 2,
              prepend_to: backgroundLayer,
              "class": 'column-background',
              id: obj.label
            });
          } else if (obj.backgroundShape && obj.backgroundShape == 'img') {
            background = svg('image', {
              x: 0,
              y: offset.y,
              height: task.getRowHeight(idx),
              width: task.getRowHeight(idx),
              prepend_to: backgroundLayer,
              href: obj.href,
              id: obj.label
            });
          } else {
            background = svg('rect', {
              x: 0,
              dy: offset.y,
              height: task.getRowHeight(idx),
              prepend_to: backgroundLayer,
              "class": 'column-background',
              id: obj.label
            });
          }

          background.columnRow = label;
          background.applyStyle(obj.backgroundStyle);
        }
      }
    }]);

    return Column;
  }(Prop);

  var Columns = /*#__PURE__*/function (_prop) {
    _inherits(Columns, _prop);

    var _super = _createSuper(Columns);

    function Columns(options, tasks) {
      var _this;

      _classCallCheck(this, Columns);

      _this = _super.call(this, {
        tasks: tasks,
        columns: options.columns.map(function (c) {
          return new Column(options, c, tasks);
        })
      });

      _defineProperty(_assertThisInitialized(_this), "options", void 0);

      _this.options = options;

      _this.options.subscribe(EVENT.AFTER_RENDER, _assertThisInitialized(_this));

      _this.set('parent', options.parent.querySelector('.timeline-left'));

      _this.set('body', options.parent.querySelector('.timeline-left-bottom > svg'));

      _this.set('header', options.parent.querySelector('.timeline-left-top > svg'));

      return _this;
    }

    _createClass(Columns, [{
      key: "eventHandler",
      value: function eventHandler(event) {
        var _this2 = this;

        if (event == EVENT.AFTER_RENDER) {
          var offset = {
            x: 0,
            y: 0
          };
          this.get('columns').forEach(function (c, idx) {
            c.get('title').setAttribute('x', offset.x + _this2.options.padding / 2);
            c.get('dom').setAttribute('transform', "translate(".concat(offset.x + _this2.options.padding / 2, ", 0)"));
            offset.x += c.getWidth() + _this2.options.padding;
          });
          this.get('body').setAttribute('width', offset.x);
          this.get('header').setAttribute('width', offset.x);
          this.get('parent').setAttribute('width', offset.x);
          this.options.dispatch(EVENT.AFTER_LAYOUT);
        }
      }
    }, {
      key: "render",
      value: function render() {
        var dom = this.get('body');
        dom.setAttribute('height', this.get('height'));
        var header = this.get('header');
        var offset = {
          x: this.options.padding,
          y: 0
        };
        this.get('columns').forEach(function (col) {
          col.render(header, dom, offset);
        });
      }
    }]);

    return Columns;
  }(Prop);

  var Header = /*#__PURE__*/function (_Prop) {
    _inherits(Header, _Prop);

    var _super = _createSuper(Header);

    function Header(options) {
      var _this;

      _classCallCheck(this, Header);

      _this = _super.call(this, {
        width: 0,
        height: 0
      });

      _defineProperty(_assertThisInitialized(_this), "options", void 0);

      _this.options = options;
      return _this;
    }

    _createClass(Header, [{
      key: "render",
      value: function render(dates) {
        var dom = this.options.parent.querySelector('.timeline-right-top > svg');
        dom.innerHTML = '';
        dom.setAttribute('width', this.get('width') + '');
        dom.setAttribute('height', this.getHeight() + '');
        this.drawBackground(dom);
        this.drawDates(dom, dates);
        dom.setAttribute('viewBox', "0 0 ".concat(this.get('width'), " ").concat(this.getHeight()));
      }
    }, {
      key: "getHeight",
      value: function getHeight() {
        return this.options.headerHeight + 10;
      }
    }, {
      key: "drawBackground",
      value: function drawBackground(layer) {// svg('rect', {
        //   x: 0,
        //   y: 0,
        //   width: this.get('width'),
        //   height: this.getHeight(),
        //   class: 'grid-header',
        //   append_to: layer
        // })
      }
    }, {
      key: "drawDates",
      value: function drawDates(layer, dates) {
        var lastDate = null;
        var i = 0;

        var _iterator = _createForOfIteratorHelper(dates),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var d = _step.value;
            var date = this.getDateInfo(d, lastDate, i++);
            lastDate = d;
            var lowerText = svg('text', {
              x: date.lower_x,
              y: date.lower_y,
              "class": 'lower-text',
              append_to: layer
            });
            lowerText.appendChild(toTextFragment(date.lower_text));

            if (date.upper_text) {
              var upperText = svg('text', {
                x: date.upper_x,
                y: date.upper_y,
                "class": 'upper-text',
                append_to: layer
              });
              upperText.appendChild(toTextFragment(date.upper_text)); // remove out-of-bound dates
              // if ($upper_text.getBBox().x2 > this.getLayer('grid').getBBox().width) {
              //   $upper_text.remove()
              // }
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }, {
      key: "getDateInfo",
      value: function getDateInfo(date, last_date, i) {
        if (!last_date) {
          last_date = date.add(1, 'year').add(1, 'month');
        }

        var lowerDate = null,
            upperDate = null,
            lowerX = 0,
            upperX = 0;
        var base_pos = {
          x: i * this.options.columnWidth,
          lower_y: this.options.headerHeight,
          upper_y: this.options.headerHeight - 25
        };
        var mode = this.options.step / 24;

        if (mode < exports.VIEW_MODE.DAY) {
          lowerX = this.options.columnWidth * 1 / mode / 2;
          lowerDate = date.format('HH');
          upperDate = date.date() !== last_date.date() ? date.month() !== last_date.month() ? date.format('D MMM') : date.format('D') : '';
        } else if (mode < exports.VIEW_MODE.WEEK) {
          upperX = this.options.columnWidth * exports.VIEW_MODE.MONTH / mode / 2;
          lowerX = this.options.columnWidth / 2;
          lowerDate = date.format('D');
          upperDate = date.month() !== last_date.month() ? date.format('MMMM') : '';
        } else if (mode < exports.VIEW_MODE.MONTH) {
          upperX = this.options.columnWidth * (28 / mode) / 2;
          lowerDate = date.month() !== last_date.month() ? date.format('D MMM') : date.format('D');
          upperDate = date.month() !== last_date.month() ? date.format('MMMM') : '';
        } else if (mode < exports.VIEW_MODE.YEAR) {
          upperX = this.options.columnWidth * (12 * (mode / exports.VIEW_MODE.YEAR)) / 2;
          lowerX = this.options.columnWidth / 2;
          lowerDate = date.format('MMMM');
          upperDate = date.year() !== last_date.year() ? date.format('YYYY') : '';
        } else {
          upperX = this.options.columnWidth * 30 / 2;
          lowerX = this.options.columnWidth / 2;
          lowerDate = date.format('YYYY');
          upperDate = date.year() !== last_date.year() ? date.format('YYYY') : '';
        }

        var x_pos = {
          'Quarter Day_lower': this.options.columnWidth * 4 / 2,
          'Quarter Day_upper': 0,
          'Half Day_lower': this.options.columnWidth * 2 / 2,
          'Half Day_upper': 0,
          Day_lower: this.options.columnWidth / 2,
          Day_upper: this.options.columnWidth * 30 / 2,
          Week_lower: 0,
          Week_upper: this.options.columnWidth * 4 / 2,
          Month_lower: this.options.columnWidth / 2,
          Month_upper: this.options.columnWidth * 12 / 2,
          Year_lower: this.options.columnWidth / 2,
          Year_upper: this.options.columnWidth * 30 / 2
        };
        return {
          upper_text: upperDate,
          lower_text: lowerDate,
          upper_x: base_pos.x + upperX,
          upper_y: base_pos.upper_y,
          lower_x: base_pos.x + lowerX,
          lower_y: base_pos.lower_y
        };
      }
    }]);

    return Header;
  }(Prop);

  var defaultPlanOptions = {
    cornerRadius: 0,
    progress: 100,
    y: 0,
    start: '1900-01-01',
    end: '1900-01-01',
    label: ''
  };

  var Plan = /*#__PURE__*/function (_Prop) {
    _inherits(Plan, _Prop);

    var _super = _createSuper(Plan);

    function Plan(options, config, task) {
      var _this;

      _classCallCheck(this, Plan);

      _this = _super.call(this, _objectSpread2(_objectSpread2(_objectSpread2({}, defaultPlanOptions), config), {}, {
        type: 'Plan'
      }));

      _defineProperty(_assertThisInitialized(_this), "options", void 0);

      _defineProperty(_assertThisInitialized(_this), "task", void 0);

      _this.options = options;
      _this.task = task;

      _this.set('height', config.height || options.barHeight);

      console.assert(!!config.start, 'Plan must have a start date');
      console.assert(!!config.end, 'Plan must have an end date');

      _this.set('start', dayjs_min(config.start));

      _this.set('end', dayjs_min(config.end)); // if hours is not set, assume the last day is full day
      // e.g: 2018-09-09 becomes 2018-09-09 23:59:59


      if (_this.get('end').isSame(_this.get('end').startOf('day'))) {
        _this.set('end', _this.get('end').add(24, 'hour'));
      }

      _this.set('duration', _this.get('end').diff(_this.get('start'), 'hour'));

      return _this;
    }

    _createClass(Plan, [{
      key: "getDuration",
      value: function getDuration() {
        return this.get('duration') / this.options.step;
      }
    }, {
      key: "getWidth",
      value: function getWidth() {
        return this.getDuration() * this.options.columnWidth;
      }
    }, {
      key: "computeX",
      value: function computeX(startDate) {
        if (exports.VIEW_MODE.MONTH == this.options.viewMode) {
          return this.get('start').diff(startDate, 'day') * this.options.columnWidth / 30;
        }

        return this.get('start').diff(startDate, 'hour') / this.options.step * this.options.columnWidth;
      }
    }, {
      key: "render",
      value: function render(layer, startDate, offset) {
        this.set('x', this.computeX(startDate) + offset.x);
        this.set('dom', svg('g', {
          "class": 'bar-wrapper',
          'data-id': this.task.get('id'),
          append_to: layer
        }));
        var barGroup = svg('g', {
          "class": 'bar-group',
          append_to: this.get('dom')
        });

        if (this.options.popup) {
          barGroup.addEventListener('click', this, false);
        }

        this.drawBar(barGroup, offset);
        this.drawProgressBar(barGroup, offset);
        this.drawLabel(barGroup, offset);
      }
    }, {
      key: "drawBar",
      value: function drawBar(layer, offset) {
        this.set('bar', svg('rect', {
          x: this.get('x'),
          y: this.get('y') + offset.y,
          width: this.getWidth(),
          height: this.get('height'),
          rx: this.get('cornerRadius'),
          ry: this.get('cornerRadius'),
          "class": 'bar',
          append_to: layer
        }));

        if (this.get('backgroundStyle')) {
          var style = this.get('backgroundStyle');
          this.get('rect').applyStyle(style);
        }
      }
    }, {
      key: "drawProgressBar",
      value: function drawProgressBar(layer, offset) {
        var rect = svg('rect', {
          x: this.get('x'),
          y: this.get('y') + offset.y,
          width: this.getWidth() * (this.get('progress') / 100) || 0,
          height: this.get('height'),
          rx: this.get('cornerRadius'),
          ry: this.get('cornerRadius'),
          "class": 'bar-progress',
          append_to: layer
        });

        if (this.get('progressStyle')) {
          var style = this.get('progressStyle');
          rect.applyStyle(style);
        }
      }
    }, {
      key: "drawLabel",
      value: function drawLabel(layer, offset) {
        var _this2 = this;

        if (!this.get('label')) return;
        this.set('text', svg('text', {
          x: this.get('x') + this.getWidth() / 2,
          y: this.get('y') + offset.y + this.get('height') / 2,
          "class": 'bar-label',
          append_to: layer
        }));

        if (this.get('labelStyle')) {
          var style = this.get('labelStyle');
          this.get('text').applyStyle(style);
        }

        this.get('text').appendChild(toTextFragment(this.get('label')));
        requestAnimationFrame(function () {
          return _this2.updateLabelPosition();
        });
      }
    }, {
      key: "updateLabelPosition",
      value: function updateLabelPosition() {
        if (this.get('text').getBBox().width > this.get('bar').getWidth()) {
          this.get('text').classList.add('big');
          this.get('text').setAttribute('x', this.get('bar').getX() + this.get('bar').getWidth() + 5 + '');
        } else {
          this.get('text').classList.remove('big');
          this.get('text').setAttribute('x', this.get('bar').getX() + this.get('bar').getWidth() / 2 + '');
        }
      } // TODO: Support events better

    }, {
      key: "handleEvent",
      value: function handleEvent(evt) {
        var key = evt.type;

        if (key == 'click' && this.options.popup) {
          this.options.dispatch(EVENT.SHOW_POPUP, {
            eventTarget: this,
            positionTarget: this.get('dom'),
            title: this.get('name'),
            subtitle: this.get('tooltip'),
            position: 'left'
          });
          return;
        }
      }
    }]);

    return Plan;
  }(Prop);

  var defaultMilestoneOptions = Object.freeze({
    height: 16,
    width: 16,
    date: null,
    href: '',
    y: 0
  });

  var Milestone = /*#__PURE__*/function (_Prop) {
    _inherits(Milestone, _Prop);

    var _super = _createSuper(Milestone);

    function Milestone(options, config, task) {
      var _this;

      _classCallCheck(this, Milestone);

      _this = _super.call(this, _objectSpread2(_objectSpread2(_objectSpread2({}, defaultMilestoneOptions), config), {}, {
        type: 'Milestone'
      }));

      _defineProperty(_assertThisInitialized(_this), "options", void 0);

      _defineProperty(_assertThisInitialized(_this), "task", void 0);

      _defineProperty(_assertThisInitialized(_this), "dom", void 0);

      _this.options = options;
      _this.task = task;

      _this.set('date', dayjs_min(config.date));

      return _this;
    } // TODO: Support events better


    _createClass(Milestone, [{
      key: "handleEvent",
      value: function handleEvent(evt) {
        var key = evt.type;

        if (key == 'click' && this.options.popup) {
          this.options.dispatch(EVENT.SHOW_POPUP, {
            eventTarget: this,
            positionTarget: this.dom,
            title: this.get('name'),
            subtitle: this.get('tooltip')
          });
          return;
        }
      }
    }, {
      key: "computeX",
      value: function computeX(startDate) {
        if (exports.VIEW_MODE.MONTH == this.options.viewMode) {
          return this.get('date').diff(startDate, 'day') * this.options.columnWidth / 30;
        }

        return this.get('date').diff(startDate, 'hour') / this.options.step * this.options.columnWidth;
      }
    }, {
      key: "render",
      value: function render(layer, startDate, offset) {
        this.dom = svg('image', {
          x: this.computeX(startDate) + offset.x,
          y: this.get('y') + offset.y,
          width: this.get('width'),
          height: this.get('height'),
          href: this.get('href'),
          append_to: layer
        });

        if (this.options.popup) {
          this.dom.addEventListener('click', this, false);
        }
      }
    }]);

    return Milestone;
  }(Prop);

  function generate_id(task) {
    return 'task_' + Math.random().toString(36).slice(2, 12);
  }

  function isSingle(options) {
    return 'plan' in options;
  }

  var Task = /*#__PURE__*/function (_Prop) {
    _inherits(Task, _Prop);

    var _super = _createSuper(Task);

    function Task(options, config) {
      var _this;

      _classCallCheck(this, Task);

      _this = _super.call(this);

      _defineProperty(_assertThisInitialized(_this), "options", void 0);

      _defineProperty(_assertThisInitialized(_this), "_plans", []);

      _defineProperty(_assertThisInitialized(_this), "_milestones", []);

      _this.options = options;
      _this.properties = _objectSpread2(_objectSpread2({}, config), {}, {
        height: 0,
        id: generate_id(_assertThisInitialized(_this)),
        type: 'Task'
      });

      if (isSingle(config)) {
        _this._plans = [[new Plan(options, config.plan, _assertThisInitialized(_this))]];
        _this._milestones = [config.milestones.map(function (m) {
          return new Milestone(options, m, _assertThisInitialized(_this));
        })];
      } else {
        var rowOffsets = [];
        _this._plans = config.plans.map(function (bo, idx) {
          var arr = bo.map(function (b) {
            if (idx > 0) b.y = rowOffsets[idx - 1];
            return new Plan(options, b, _assertThisInitialized(_this));
          });
          var max = Math.max.apply(Math, _toConsumableArray(arr.map(function (b) {
            return b.get('height');
          })));
          rowOffsets.push((idx > 0 ? rowOffsets[idx - 1] : 0) + max);
          return arr;
        });
        _this._milestones = config.milestones.map(function (m, idx) {
          return m.map(function (m2) {
            if (idx > 0 && rowOffsets[idx - 1]) m2.y = rowOffsets[idx - 1];
            return new Milestone(options, m2, _assertThisInitialized(_this));
          });
        });
      }

      _this.computeHeight();

      _this.computeBoundingDates();

      return _this;
    }

    _createClass(Task, [{
      key: "computeHeight",
      value: function computeHeight() {
        var _this2 = this;

        this.set('height', this._plans.map(function (a, idx) {
          return _this2.getRowHeight(idx);
        }).reduce(function (a, b) {
          return a + b;
        }, 0));
      }
    }, {
      key: "computeBoundingDates",
      value: function computeBoundingDates() {
        var _this3 = this;

        if (!this.get('start')) {
          this.set('start', this._plans[0][0].get('start').clone());
        }

        if (!this.get('end')) {
          this.set('end', this._plans[0][0].get('end').clone());
        }

        this._plans.forEach(function (a) {
          return a.forEach(function (p) {
            if (!_this3.get('start') || p.get('start').isBefore(_this3.get('start'))) {
              _this3.set('start', p.get('start').clone());
            }

            if (!_this3.get('end') || p.get('end').isAfter(_this3.get('end'))) {
              _this3.set('end', p.get('end').clone());
            }
          });
        });

        this._milestones.forEach(function (a) {
          return a.forEach(function (p) {
            if (!_this3.get('start') || p.get('date').isBefore(_this3.get('start'))) {
              _this3.set('start', p.get('date').clone());
            }

            if (!_this3.get('end') || p.get('date').isAfter(_this3.get('end'))) {
              _this3.set('end', p.get('date').clone());
            }
          });
        });
      }
    }, {
      key: "getRowHeight",
      value: function getRowHeight(idx) {
        console.assert(idx < this._plans.length, 'Row index outside of number of plan rows');
        var row = this._plans[idx];
        return Math.max.apply(Math, _toConsumableArray(row.map(function (p) {
          return p.get('height');
        })));
      }
    }, {
      key: "render",
      value: function render(layer, startDate, offset) {
        var barGroup = svg('g', {
          "class": 'bar',
          append_to: layer
        });
        var milestoneGroup = svg('g', {
          "class": "milestone-wrapper",
          'data-id': this.get('id'),
          append_to: layer
        });

        this._plans.forEach(function (row) {
          return row.forEach(function (p) {
            return p.render(barGroup, startDate, offset);
          });
        });

        this._milestones.forEach(function (row) {
          return row.forEach(function (m) {
            return m.render(milestoneGroup, startDate, offset);
          });
        });
      }
    }]);

    return Task;
  }(Prop);

  var Grid = /*#__PURE__*/function (_Prop) {
    _inherits(Grid, _Prop);

    var _super = _createSuper(Grid);

    function Grid(options, taskOptions) {
      var _this;

      _classCallCheck(this, Grid);

      _this = _super.call(this, {
        background: new Background(options),
        header: new Header(options),
        tasks: taskOptions.map(function (o) {
          return new Task(options, o);
        })
      });

      _defineProperty(_assertThisInitialized(_this), "options", void 0);

      _defineProperty(_assertThisInitialized(_this), "isPointerDown", false);

      _defineProperty(_assertThisInitialized(_this), "pointerOrigin", {
        x: 0,
        y: 0
      });

      _defineProperty(_assertThisInitialized(_this), "viewBox", {
        x: 0,
        y: 0
      });

      _this.options = options;

      _this.options.subscribe(EVENT.AFTER_LAYOUT, _assertThisInitialized(_this));

      _this.set('columns', new Columns(options, _this.get('tasks')));

      var body = _this.options.parent.querySelector('.timeline-right-bottom');

      var columns = _this.options.parent.querySelector('.timeline-left-bottom');

      body.addEventListener('scroll', function (e) {
        columns.scrollTop = e.target.scrollTop;
      }.bind(_assertThisInitialized(_this)));

      _this.set('body', body);

      if (options.draggable) {
        _this.set('bodyDom', _this.options.parent.querySelector('.timeline-right-bottom > svg'));

        _this.set('headerDom', _this.options.parent.querySelector('.timeline-right-top > svg'));

        _this.attachEvents(_this.get('bodyDom'));
      }

      return _this;
    }

    _createClass(Grid, [{
      key: "eventHandler",
      value: function eventHandler(event) {
        if (event == EVENT.AFTER_LAYOUT) {
          this.setupDates();
          this.drawBody();
        }
      }
    }, {
      key: "setupDates",
      value: function setupDates() {
        this.setBoundingDates();
        this.updateScale();
        this.convertDates();
        this.fillDates();
      }
    }, {
      key: "fillDates",
      value: function fillDates() {
        var dates = [],
            body = this.get('body'),
            width = body.getBoundingClientRect().width;
        var d = null,
            c = 0;
        console.log(this.options.viewMode);

        do {
          if (!d) {
            d = dayjs_min(this.get('start'));
          } else if (exports.VIEW_MODE.YEAR == this.options.viewMode) {
            d = d.add(1, 'year');
          } else if (exports.VIEW_MODE.MONTH == this.options.viewMode) {
            d = d.add(1, 'month');
          } else {
            d = d.add(this.options.step, 'hour');
          }

          dates.push(d);
          c++;
          if (d.isBefore(this.get('end'))) this.set('lastIdx', c);
        } while (d.isBefore(this.get('end')) || c * this.options.columnWidth < width);

        this.set('dates', dates);
      }
    }, {
      key: "convertDates",
      value: function convertDates() {
        this.set('start', this.get('start').startOf('day'));
        this.set('end', this.get('end').startOf('day')); // if ([VIEW_MODE.QUARTER_DAY, VIEW_MODE.HALF_DAY].some((k) => k == this.options.viewMode)) {
        //   this.set('start', this.get('start').subtract(7, 'day'))
        //   this.set('end', this.get('end').add(7, 'day'))
        // } else if (VIEW_MODE.MONTH == this.options.viewMode) {
        //   this.set('start', this.get('start').subtract(1, 'year'))
        //   this.set('end', this.get('end').add(1, 'year'))
        // } else if (VIEW_MODE.YEAR == this.options.viewMode) {
        //   this.set('start', this.get('start').subtract(2, 'year'))
        //   this.set('end', this.get('end').add(2, 'year'))
        // } else {
        //   this.set('start', this.get('start').subtract(1, 'month'))
        //   this.set('end', this.get('end').add(1, 'month'))
        // }
      }
    }, {
      key: "setBoundingDates",
      value: function setBoundingDates() {
        var _this2 = this;

        this.set('start', null).set('end', null);
        this.get('tasks').forEach(function (task) {
          if (!_this2.get('start') || task.get('start').isBefore(_this2.get('start'))) {
            _this2.set('start', task.get('start').clone());
          }

          if (!_this2.get('end') || task.get('end').isAfter(_this2.get('end'))) {
            _this2.set('end', task.get('end').clone());
          }
        });
      }
    }, {
      key: "getWidth",
      value: function getWidth() {
        return this.get('dates').length * this.options.columnWidth + this.options.padding;
      }
    }, {
      key: "getHeight",
      value: function getHeight() {
        var _this3 = this;

        return this.get('tasks').map(function (t) {
          return t.get('height');
        }).reduce(function (a, b) {
          return a + b + _this3.options.padding;
        }) + this.options.padding + 6;
      }
    }, {
      key: "render",
      value: function render() {
        this.drawColumns();
      }
    }, {
      key: "attachEvents",
      value: function attachEvents(dom) {
        if (window.PointerEvent) {
          dom.addEventListener('pointerdown', this.onPointerDown.bind(this)); // Pointer is pressed

          dom.addEventListener('pointerup', this.onPointerUp.bind(this)); // Releasing the pointer

          dom.addEventListener('pointerleave', this.onPointerUp.bind(this)); // Pointer gets out of the dom area

          dom.addEventListener('pointermove', this.onPointerMove.bind(this)); // Pointer is moving
        } else {
          // Add all mouse events listeners fallback
          dom.addEventListener('mousedown', this.onPointerDown.bind(this)); // Pressing the mouse

          dom.addEventListener('mouseup', this.onPointerUp.bind(this)); // Releasing the mouse

          dom.addEventListener('mouseleave', this.onPointerUp.bind(this)); // Mouse gets out of the dom area

          dom.addEventListener('mousemove', this.onPointerMove.bind(this)); // Mouse is moving
          // Add all touch events listeners fallback

          dom.addEventListener('touchstart', this.onPointerDown.bind(this)); // Finger is touching the screen

          dom.addEventListener('touchend', this.onPointerUp.bind(this)); // Finger is no longer touching the screen

          dom.addEventListener('touchmove', this.onPointerMove.bind(this)); // Finger is moving
        }
      }
    }, {
      key: "drawBody",
      value: function drawBody() {
        var _this4 = this;

        var dom = this.options.parent.querySelector('.timeline-right-bottom > svg');
        dom.innerHTML = '';
        dom.setAttributes({
          viewBox: "0 0 ".concat(this.getWidth(), " ").concat(this.getHeight()),
          width: this.getWidth(),
          height: this.getHeight()
        }); // this.attachEvents(dom)

        var bars = svg('g', {
          "class": 'bar',
          prepend_to: dom
        });
        var offset = {
          x: 0,
          y: 0
        };
        this.get('header').set('width', this.getWidth());
        this.get('background').set('width', this.getWidth()).set('height', this.getHeight());
        this.get('header').render(this.get('dates'));
        this.get('background').render(this.get('dates'), this.get('tasks'));
        offset.y = this.options.padding / 2;
        this.get('tasks').forEach(function (t) {
          t.render(bars, _this4.get('start'), offset);
          offset.y += t.get('height') + _this4.options.padding;
        });
      }
    }, {
      key: "drawColumns",
      value: function drawColumns() {
        this.get('columns').set('height', this.getHeight()).set('headerHeight', this.get('header').getHeight());
        this.get('columns').render();
      }
    }, {
      key: "getPointFromEvent",
      value: function getPointFromEvent(event) {
        var point = {
          x: 0,
          y: 0
        }; // If even is triggered by a touch event, we get the position of the first finger

        if (event.targetTouches) {
          point.x = event.targetTouches[0].clientX;
          point.y = event.targetTouches[0].clientY;
        } else {
          point.x = event.clientX;
          point.y = event.clientY;
        }

        return point;
      }
    }, {
      key: "onPointerDown",
      value: function onPointerDown(event) {
        this.isPointerDown = true; // We set the pointer as down
        // We get the pointer position on click/touchdown so we can get the value once the user starts to drag

        var pointerPosition = this.getPointFromEvent(event);
        this.pointerOrigin.x = pointerPosition.x;
        this.pointerOrigin.y = pointerPosition.y;
      } // We save the original values from the viewBox
      // Function called by the event listeners when user start moving/dragging

    }, {
      key: "onPointerMove",
      value: function onPointerMove(event) {
        // Only run this function if the pointer is down
        if (!this.isPointerDown) {
          return;
        } // This prevent user to do a selection on the page


        event.preventDefault();
        var dom = this.get('bodyDom');
        var header = this.get('headerDom');
        var viewBox = dom.viewBox.baseVal; // Get the pointer position as an dom Point

        var pointerPosition = this.getPointFromEvent(event);
        this.viewBox.x = viewBox.x - (pointerPosition.x - this.pointerOrigin.x);
        if (this.viewBox.x < 0) this.viewBox.x = 0;
        var width = this.get('body').clientWidth;
        if (viewBox.width < width) return;

        if (viewBox.width - this.viewBox.x < width) {
          this.viewBox.x = viewBox.width - width;
        }

        var last = this.get('lastIdx') * this.options.columnWidth;

        if (this.viewBox.x + width > last) {
          return;
        }

        this.viewBox.y = viewBox.y;
        this.pointerOrigin = pointerPosition;
        var viewBoxString = "".concat(this.viewBox.x, " ").concat(this.viewBox.y, " ").concat(viewBox.width, " ").concat(viewBox.height); // We apply the new viewBox values onto the SVG

        dom.setAttribute('viewBox', viewBoxString);
        var headerViewBox = header.viewBox.baseVal;
        viewBoxString = "".concat(this.viewBox.x, " 0 ").concat(headerViewBox.width, " ").concat(headerViewBox.height);
        header.setAttribute('viewBox', viewBoxString);
      }
    }, {
      key: "onPointerUp",
      value: function onPointerUp() {
        // The pointer is no longer considered as down
        this.isPointerDown = false;
      }
    }, {
      key: "updateScale",
      value: function updateScale() {
        var mode = this.options.viewMode;
        this.options.step = 24 * mode;

        if (mode <= 0) {
          var start = this.get('start'),
              end = this.get('end'),
              body = this.get('body');
          var hours = end.diff(start, 'hour');
          var width = body.clientWidth;
          this.options.step = 24;
          this.options.columnWidth = width / (hours / 24);
        } else if (mode < exports.VIEW_MODE.WEEK) {
          this.options.columnWidth = 38;
        } else if (mode < exports.VIEW_MODE.MONTH) {
          this.options.columnWidth = 140;
        } else {
          this.options.columnWidth = 120;
        }
      }
    }]);

    return Grid;
  }(Prop);

  var View = /*#__PURE__*/function (_Prop) {
    _inherits(View, _Prop);

    var _super = _createSuper(View);

    _createClass(View, null, [{
      key: "initResizeListener",
      value: function initResizeListener() {
        window.addEventListener('resize', debounce(function (e) {
          var _iterator = _createForOfIteratorHelper(View.VIEWS),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var view = _step.value;

              if (view.options.parent) {
                view.changeView(view.options.viewMode);
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }, 250));
        return [];
      }
    }]);

    function View(selector, tasks, options) {
      var _this;

      _classCallCheck(this, View);

      _this = _super.call(this, {
        type: 'View'
      });

      _defineProperty(_assertThisInitialized(_this), "options", {
        headerHeight: 50,
        columnWidth: 30,
        step: 24,
        barHeight: 20,
        padding: 18,
        viewMode: exports.VIEW_MODE.DAY,
        dateFormat: 'YYYY-MM-DD',
        popup: true,
        popupProducer: null,
        columns: [],
        draggable: true,
        parent: null
      });

      _defineProperty(_assertThisInitialized(_this), "consumers", {});

      options.parent = document.querySelector(selector);
      _this.options = _objectSpread2(_objectSpread2({}, _this.options), options);
      _this.options.dispatch = _this.dispatch.bind(_assertThisInitialized(_this));
      _this.options.subscribe = _this.subscribe.bind(_assertThisInitialized(_this));
      _this.options.unsubscribe = _this.unsubscribe.bind(_assertThisInitialized(_this));
      var popupContainer = document.createElement('div');
      popupContainer.classList.add('popup-wrapper');
      options.parent.appendChild(popupContainer);
      options.parent.style.display = 'flex';
      options.parent.style.flexDirection = 'row';
      options.parent.style.flex = '1';
      options.parent.style.pointerEvents = 'auto';
      options.parent.classList.add('timeline-container');
      options.parent.addEventListener('wheel', function (event) {
        if (!event.shiftKey) return;
        var views = Object.values(exports.VIEW_MODE).filter(function (v) {
          return typeof v == 'number';
        });
        var direction = event.deltaY > 0 ? 1 : -1;
        var idx = views.indexOf(_this.options.viewMode);
        var newIdx = Math.max(0, Math.min(idx + direction, views.length - 1));
        console.log(newIdx);

        _this.changeView(views[newIdx]);
      });

      _this.set('popup', new Popup(_this.options, popupContainer));

      _this.get('popup').hide();

      _this.setupView();

      _this.set('grid', new Grid(_this.options, tasks));

      _this.render();

      View.VIEWS.push(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(View, [{
      key: "setupView",
      value: function setupView() {
        var _this2 = this;

        var headerHeight = this.options.headerHeight + 10;
        var left = toDom("<div class=\"timeline-left\" style=\"flex-direction: column; display: flex; overflow: hidden\">\n      <div class=\"timeline-left-top\" style=\"overflow: hidden\" height=\"".concat(headerHeight, "\"><svg x=\"0\" y=\"0\" height=\"").concat(headerHeight, "\"></svg></div>\n      <div class=\"timeline-left-bottom\" style=\"overflow: hidden; flex: 1\"><svg x=\"0\" y=\"0\"></svg></div>\n      </div>"));
        var right = toDom("<div class=\"timeline-right\" style=\"flex: 1; flex-direction: column; display: flex; overflow: hidden\">\n    <div class=\"timeline-right-top\" style=\"overflow: hidden\" height=\"".concat(headerHeight, "\"><svg class=\"timeline\" x=\"0\" y=\"0\" height=\"").concat(headerHeight, "\"></svg></div>\n    <div class=\"timeline-right-bottom\" style=\"overflow: hidden; flex: 1\"><svg class=\"timeline\" x=\"0\" y=\"0\"></svg></div>\n    </div>"));
        this.options.parent.append(left, right);
        this.options.parent;
        delegate(this.options.parent, 'click', '.timeline-left, .timeline-right-top, .tick, .grid', function () {
          return _this2.get('popup').hide();
        });
      }
    }, {
      key: "changeView",
      value: function changeView(mode) {
        var _this3 = this;

        this.get('popup').hide();
        var d = this.options.parent.querySelector('.timeline-right-bottom');
        this.options.viewMode = mode;
        this.get('grid').setupDates();
        this.get('grid').drawBody();
        requestAnimationFrame(function () {
          return _this3.dispatch(EVENT.AFTER_RENDER);
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this4 = this;

        this.get('grid').render();
        requestAnimationFrame(function () {
          return _this4.dispatch(EVENT.AFTER_RENDER);
        });
      }
    }, {
      key: "subscribe",
      value: function subscribe(key, clazz) {
        if (!this.consumers[key]) {
          this.consumers[key] = [];
        }

        this.consumers[key].push(clazz);
      }
    }, {
      key: "unsubscribe",
      value: function unsubscribe(key, clazz) {
        var idx = this.consumers[key].indexOf(clazz);

        if (idx > -1) {
          this.consumers[key].splice(idx, 1);
        }
      }
    }, {
      key: "dispatch",
      value: function dispatch(key, payload) {
        switch (key) {
          case EVENT.SHOW_POPUP:
            this.get('popup').show(payload);
            return;

          case EVENT.HIDE_POPUP:
            this.get('popup').hide();
            return;
        }

        var events = this.consumers[key];

        if (!events || events.length == 0) {
          return;
        }

        events.forEach(function (c) {
          return c.eventHandler(key);
        });
      }
    }]);

    return View;
  }(Prop);

  _defineProperty(View, "VIEWS", View.initResizeListener());

  exports.View = View;
  exports.debounce = debounce;
  exports.delegate = delegate;
  exports.svg = svg;
  exports.toDom = toDom;
  exports.toTextFragment = toTextFragment;

  return exports;

}({}));
