var Timeline = (function () {
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

  /** @module timeline/types */

  /** @enum {string} */
  var VIEW_MODE = {
    QUARTER_DAY: 'Quarter Day',
    HALF_DAY: 'Half Day',
    DAY: 'Day',
    WEEK: 'Week',
    MONTH: 'Month',
    YEAR: 'Year'
  };
  /**
   * @typedef {object} MilestoneOptions
   * @property  {string} href
   * @property  {number} height
   * @property  {number} width
   * @property {string} date
   */

  var MilestoneOptions = Object.freeze({});
  /**
   * @typedef {object} TaskOptions
   * @property  {Array<MilestoneOptions>} milestones
   * @property  {string} start
   * @property  {string} end
   * @property  {string} id
   * @property  {number} progress
   * @property  {number=} height
   * @property  {string} customClass
   * @property  {string} name
   */

  var TaskOptions = Object.freeze({});
  /**
   * @typedef {object} PopupOptions
   * @property {(HTMLElement|SVGElement|SVGGraphicsElement)} target
   * @property {string=} title
   * @property {string=} subtitle
   * @property {string=} position
   * @property {import("./task").default} task
   */

  var PopupOptions = Object.freeze({});
  /**
   * @typedef {object} TimelineOptions
   */

  var TimelineOptions = Object.freeze({
    /** @property {number} headerHeight */
    headerHeight: 50,
    columnWidth: 30,
    step: 24,
    viewModes: Object.keys(VIEW_MODE).map(function (k) {
      return VIEW_MODE[k];
    }),
    barHeight: 20,
    barCornerRadius: 3,
    padding: 18,
    viewMode: 'Day',
    dateFormat: 'YYYY-MM-DD',
    popupTrigger: 'click',

    /** @type {HtmlProducer} */
    producer: null,

    /** @type {function(?): ?} */
    on_click: null
  });
  /**
   * @typedef {object} SVGElementX
   * @property {function(): number=} getX
   * @property {function(): number=} getY
   * @property {function(): number=} getWidth
   * @property {function(): number=} getHeight
   * @property {function(): number=} getEndX
   * @property {function(): DOMRect=} getBBox
   * @property {function(): DOMMatrix=} getCTM
   * @property {function(): DOMMatrix=} getScreenCTM
   * @property {SVGAnimatedTransformList} transform
   */

  /**
   * @typedef {SVGElementX & SVGElement} SVGElement2
   */

  var SVGElement2 = Object.freeze({});
  /**
   * @typedef {SVGElement2 & SVGGraphicsElement} SVGElement3
   */

  var SVGElement3 = Object.freeze({});

  /** @module timeline/util */
  /**
   * Create an SVG element with provided attributes
   *
   * @param {string} tag SVG tag to create
   * @param {any} attrs Attributes to set on the SVG element
   * @returns {types.SVGElement3}
   */

  var svg = function svg(tag, attrs) {
    /** @type {types.SVGElement2} */
    var elem = document.createElementNS('http://www.w3.org/2000/svg', tag);

    for (var attr in attrs) {
      if (attr === 'append_to') {
        var parent = attrs.append_to;
        parent.appendChild(elem);
      } else if (attr === 'innerHTML') {
        elem.innerHTML = attrs.innerHTML;
      } else {
        elem.setAttribute(attr, attrs[attr]);
      }
    }

    elem.getX = function () {
      return +this.getAttribute('x');
    };

    elem.getY = function () {
      return +this.getAttribute('y');
    };

    elem.getWidth = function () {
      return +this.getAttribute('width');
    };

    elem.getHeight = function () {
      return +this.getAttribute('height');
    };

    elem.getEndX = function () {
      return this.getX() + this.getWidth();
    };

    return elem;
  };
  /**
   * @param {Element} element
   * @param {string} event
   * @param {function(?): ?} listener
   * @param {string=} selector
   */

  var on = function on(element, event, listener, selector) {
    if (!selector) {
      bind(element, event, listener);
    } else {
      delegate(element, event, selector, listener);
    }
  };
  /**
   * @param {Element} element
   * @param {string} event
   * @param {function(?): ?} listener
   */

  var bind = function bind(element, event, listener) {
    event.split(/\s+/).forEach(function (e) {
      element.addEventListener(e, listener);
    });
  };
  /**
   * @param {Element} element
   * @param {string} event
   * @param {string} selector
   * @param {function(?): ?} listener
   */
  // tsc-off

  var delegate = function delegate(element, event, selector, listener) {
    element.addEventListener(event,
    /** @param {events.SVGMouseEvent} e */
    function (e) {
      var delegatedTarget = e.target.closest(selector);

      if (delegatedTarget) {
        e.delegatedTarget = delegatedTarget;
        listener.call(this, e, delegatedTarget);
      }
    });
  };
  /**
   * @param {Element} element
   * @param {any} attr
   */

  var attrs = function attrs(element, attr) {
    for (var _i = 0, _Object$keys = Object.keys(attr); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];
      element.setAttribute(key, attr[key]);
    }
  };

  /** @module timeline/internal */
  var Internal = /*#__PURE__*/function () {
    /**
     *
     * @param {import("./index.js").default} timeline
     */
    function Internal(timeline) {
      _classCallCheck(this, Internal);

      /**
       * @protected
       */
      this.timeline = timeline;
      /**
       * @protected
       */

      this.options = this.timeline.options;
    }
    /**
     * @param {string} key
     */


    _createClass(Internal, [{
      key: "getLayer",
      value: function getLayer(key) {
        return this.timeline.layers[key];
      }
    }, {
      key: "getTasks",
      value: function getTasks() {
        return this.timeline.tasks;
      }
      /**
       *
       * @param {number} index
       */

    }, {
      key: "getTaskIdx",
      value: function getTaskIdx(index) {
        var tasks = this.getTasks().entries();
        return index < tasks.length ? tasks[index] : null;
      }
    }]);

    return Internal;
  }();

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var dayjs_min = createCommonjsModule(function (module, exports) {
  !function(t,e){module.exports=e();}(commonjsGlobal,function(){var t="millisecond",e="second",n="minute",r="hour",i="day",s="week",u="month",o="quarter",a="year",h=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,f=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,c=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},d={s:c,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+c(r,2,"0")+":"+c(i,2,"0")},m:function(t,e){var n=12*(e.year()-t.year())+(e.month()-t.month()),r=t.clone().add(n,u),i=e-r<0,s=t.clone().add(n+(i?-1:1),u);return Number(-(n+(e-r)/(i?r-s:s-r))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return {M:u,y:a,w:s,d:i,D:"date",h:r,m:n,s:e,ms:t,Q:o}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},$={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},l="en",m={};m[l]=$;var y=function(t){return t instanceof v},M=function(t,e,n){var r;if(!t)return l;if("string"==typeof t)m[t]&&(r=t),e&&(m[t]=e,r=t);else {var i=t.name;m[i]=t,r=i;}return !n&&r&&(l=r),r||!n&&l},g=function(t,e){if(y(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new v(n)},D=d;D.l=M,D.i=y,D.w=function(t,e){return g(t,{locale:e.$L,utc:e.$u,$offset:e.$offset})};var v=function(){function c(t){this.$L=this.$L||M(t.locale,null,!0),this.parse(t);}var d=c.prototype;return d.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(D.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(h);if(r)return n?new Date(Date.UTC(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)):new Date(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)}return new Date(e)}(t),this.init();},d.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},d.$utils=function(){return D},d.isValid=function(){return !("Invalid Date"===this.$d.toString())},d.isSame=function(t,e){var n=g(t);return this.startOf(e)<=n&&n<=this.endOf(e)},d.isAfter=function(t,e){return g(t)<this.startOf(e)},d.isBefore=function(t,e){return this.endOf(e)<g(t)},d.$g=function(t,e,n){return D.u(t)?this[e]:this.set(n,t)},d.year=function(t){return this.$g(t,"$y",a)},d.month=function(t){return this.$g(t,"$M",u)},d.day=function(t){return this.$g(t,"$W",i)},d.date=function(t){return this.$g(t,"$D","date")},d.hour=function(t){return this.$g(t,"$H",r)},d.minute=function(t){return this.$g(t,"$m",n)},d.second=function(t){return this.$g(t,"$s",e)},d.millisecond=function(e){return this.$g(e,"$ms",t)},d.unix=function(){return Math.floor(this.valueOf()/1e3)},d.valueOf=function(){return this.$d.getTime()},d.startOf=function(t,o){var h=this,f=!!D.u(o)||o,c=D.p(t),d=function(t,e){var n=D.w(h.$u?Date.UTC(h.$y,e,t):new Date(h.$y,e,t),h);return f?n:n.endOf(i)},$=function(t,e){return D.w(h.toDate()[t].apply(h.toDate("s"),(f?[0,0,0,0]:[23,59,59,999]).slice(e)),h)},l=this.$W,m=this.$M,y=this.$D,M="set"+(this.$u?"UTC":"");switch(c){case a:return f?d(1,0):d(31,11);case u:return f?d(1,m):d(0,m+1);case s:var g=this.$locale().weekStart||0,v=(l<g?l+7:l)-g;return d(f?y-v:y+(6-v),m);case i:case"date":return $(M+"Hours",0);case r:return $(M+"Minutes",1);case n:return $(M+"Seconds",2);case e:return $(M+"Milliseconds",3);default:return this.clone()}},d.endOf=function(t){return this.startOf(t,!1)},d.$set=function(s,o){var h,f=D.p(s),c="set"+(this.$u?"UTC":""),d=(h={},h[i]=c+"Date",h.date=c+"Date",h[u]=c+"Month",h[a]=c+"FullYear",h[r]=c+"Hours",h[n]=c+"Minutes",h[e]=c+"Seconds",h[t]=c+"Milliseconds",h)[f],$=f===i?this.$D+(o-this.$W):o;if(f===u||f===a){var l=this.clone().set("date",1);l.$d[d]($),l.init(),this.$d=l.set("date",Math.min(this.$D,l.daysInMonth())).toDate();}else d&&this.$d[d]($);return this.init(),this},d.set=function(t,e){return this.clone().$set(t,e)},d.get=function(t){return this[D.p(t)]()},d.add=function(t,o){var h,f=this;t=Number(t);var c=D.p(o),d=function(e){var n=g(f);return D.w(n.date(n.date()+Math.round(e*t)),f)};if(c===u)return this.set(u,this.$M+t);if(c===a)return this.set(a,this.$y+t);if(c===i)return d(1);if(c===s)return d(7);var $=(h={},h[n]=6e4,h[r]=36e5,h[e]=1e3,h)[c]||1,l=this.$d.getTime()+t*$;return D.w(l,this)},d.subtract=function(t,e){return this.add(-1*t,e)},d.format=function(t){var e=this;if(!this.isValid())return "Invalid Date";var n=t||"YYYY-MM-DDTHH:mm:ssZ",r=D.z(this),i=this.$locale(),s=this.$H,u=this.$m,o=this.$M,a=i.weekdays,h=i.months,c=function(t,r,i,s){return t&&(t[r]||t(e,n))||i[r].substr(0,s)},d=function(t){return D.s(s%12||12,t,"0")},$=i.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:o+1,MM:D.s(o+1,2,"0"),MMM:c(i.monthsShort,o,h,3),MMMM:c(h,o),D:this.$D,DD:D.s(this.$D,2,"0"),d:String(this.$W),dd:c(i.weekdaysMin,this.$W,a,2),ddd:c(i.weekdaysShort,this.$W,a,3),dddd:a[this.$W],H:String(s),HH:D.s(s,2,"0"),h:d(1),hh:d(2),a:$(s,u,!0),A:$(s,u,!1),m:String(u),mm:D.s(u,2,"0"),s:String(this.$s),ss:D.s(this.$s,2,"0"),SSS:D.s(this.$ms,3,"0"),Z:r};return n.replace(f,function(t,e){return e||l[t]||r.replace(":","")})},d.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},d.diff=function(t,h,f){var c,d=D.p(h),$=g(t),l=6e4*($.utcOffset()-this.utcOffset()),m=this-$,y=D.m(this,$);return y=(c={},c[a]=y/12,c[u]=y,c[o]=y/3,c[s]=(m-l)/6048e5,c[i]=(m-l)/864e5,c[r]=m/36e5,c[n]=m/6e4,c[e]=m/1e3,c)[d]||m,f?y:D.a(y)},d.daysInMonth=function(){return this.endOf(u).$D},d.$locale=function(){return m[this.$L]},d.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=M(t,e,!0);return r&&(n.$L=r),n},d.clone=function(){return D.w(this.$d,this)},d.toDate=function(){return new Date(this.valueOf())},d.toJSON=function(){return this.isValid()?this.toISOString():null},d.toISOString=function(){return this.$d.toISOString()},d.toString=function(){return this.$d.toUTCString()},c}();return g.prototype=v.prototype,g.extend=function(t,e){return t(e,v,g),g},g.locale=M,g.isDayjs=y,g.unix=function(t){return g(1e3*t)},g.en=m[l],g.Ls=m,g});
  });

  function createFragment(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;

    while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
    }

    return frag;
  }

  var Grid = /*#__PURE__*/function (_Internal) {
    _inherits(Grid, _Internal);

    var _super = _createSuper(Grid);

    /** @param {import('./index').default} timeline */
    function Grid(timeline) {
      var _this;

      _classCallCheck(this, Grid);

      _this = _super.call(this, timeline);
      /**
       * @type {dayjs.Dayjs}
       */

      _this.start = null;
      /**
       * @type {dayjs.Dayjs}
       */

      _this.end = null;
      /**
       * @type {Array<dayjs.Dayjs>}
       */

      _this.dates = [];
      return _this;
    }

    _createClass(Grid, [{
      key: "render",
      value: function render() {
        this.make_grid_background();
        this.make_grid_rows();
        this.make_grid_header();
        this.make_grid_ticks();
        this.make_grid_highlights();
        this.make_dates();
      }
      /** @param {VIEW_MODE|VIEW_MODE[]} modes */

    }, {
      key: "view_is",
      value: function view_is(modes) {
        var _this2 = this;

        if (typeof modes === 'string') {
          return this.options.viewMode === modes;
        }

        if (Array.isArray(modes)) {
          return modes.some(function (mode) {
            return _this2.options.viewMode === mode;
          });
        }

        return false;
      }
    }, {
      key: "setup_dates",
      value: function setup_dates() {
        this.setup_gantt_dates();
        this.setup_date_values();
      }
    }, {
      key: "setup_gantt_dates",
      value: function setup_gantt_dates() {
        var _this$getTasks$getBou = this.getTasks().getBoundingDates(),
            gantt_start = _this$getTasks$getBou.gantt_start,
            gantt_end = _this$getTasks$getBou.gantt_end;

        this.start = dayjs_min(gantt_start).startOf('day');
        this.end = dayjs_min(gantt_end).startOf('day'); // add date padding on both sides

        if (this.view_is([VIEW_MODE.QUARTER_DAY, VIEW_MODE.HALF_DAY])) {
          this.start = this.start.subtract(7, 'day');
          this.end = this.end.add(7, 'day');
        } else if (this.view_is(VIEW_MODE.MONTH)) {
          this.start = this.start.subtract(1, 'year');
          this.end = this.end.add(1, 'year');
        } else if (this.view_is(VIEW_MODE.YEAR)) {
          this.start = this.start.subtract(2, 'year');
          this.end = this.end.add(2, 'year');
        } else {
          this.start = this.start.subtract(1, 'month');
          this.end = this.end.add(1, 'month');
        }
      }
    }, {
      key: "setup_date_values",
      value: function setup_date_values() {
        this.dates = [];
        var cur_date = null;

        do {
          if (!cur_date) {
            cur_date = dayjs_min(this.start);
          } else if (this.view_is(VIEW_MODE.YEAR)) {
            cur_date = cur_date.add(1, 'year');
          } else if (this.view_is(VIEW_MODE.MONTH)) {
            cur_date = cur_date.add(1, 'month');
          } else {
            cur_date = cur_date.add(this.options.step, 'hour');
          }

          this.dates.push(cur_date);
        } while (cur_date.isBefore(this.end));
      }
    }, {
      key: "make_grid_background",
      value: function make_grid_background() {
        var grid_width = this.dates.length * this.options.columnWidth;
        var tasksHeight = this.getTasks().getHeight();
        var grid_height = this.options.headerHeight + this.options.padding + tasksHeight;
        svg('rect', {
          x: 0,
          y: 0,
          width: grid_width,
          height: grid_height,
          "class": 'grid-background',
          append_to: this.getLayer('grid')
        });
        attrs(this.timeline.$svg, {
          height: grid_height,
          width: '100%'
        });
      }
    }, {
      key: "make_grid_rows",
      value: function make_grid_rows() {
        var rows_layer = svg('g', {
          append_to: this.getLayer('grid')
        });
        var lines_layer = svg('g', {
          append_to: this.getLayer('grid')
        });
        var row_width = this.dates.length * this.options.columnWidth;
        var row_y = this.options.headerHeight + this.options.padding / 2;

        var _iterator = _createForOfIteratorHelper(this.getTasks().entries()),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var task = _step.value;
            var row_height = (task.height || this.options.barHeight) + this.options.padding;
            svg('rect', {
              x: 0,
              y: row_y,
              width: row_width,
              height: row_height,
              "class": 'grid-row',
              append_to: rows_layer
            });
            svg('line', {
              x1: 0,
              y1: row_y + row_height,
              x2: row_width,
              y2: row_y + row_height,
              "class": 'row-line',
              append_to: lines_layer
            });
            row_y += row_height;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }, {
      key: "make_grid_header",
      value: function make_grid_header() {
        var header_width = this.dates.length * this.options.columnWidth;
        var header_height = this.options.headerHeight + 10;
        svg('rect', {
          x: 0,
          y: 0,
          width: header_width,
          height: header_height,
          "class": 'grid-header',
          append_to: this.getLayer('grid')
        });
      }
    }, {
      key: "make_grid_ticks",
      value: function make_grid_ticks() {
        var tick_x = 0;
        var tick_y = this.options.headerHeight + this.options.padding / 2;
        var tick_height = this.getTasks().getHeight();

        var _iterator2 = _createForOfIteratorHelper(this.dates),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var date = _step2.value;
            var tick_class = 'tick'; // thick tick for monday

            if (this.view_is(VIEW_MODE.DAY) && date.date() === 1) {
              tick_class += ' thick';
            } // thick tick for first week


            if (this.view_is(VIEW_MODE.WEEK) && date.date() >= 1 && date.date() < 8) {
              tick_class += ' thick';
            } // thick ticks for quarters


            if (this.view_is(VIEW_MODE.MONTH) && (date.month() + 1) % 3 === 0) {
              tick_class += ' thick';
            }

            svg('path', {
              d: "M ".concat(tick_x, " ").concat(tick_y, " v ").concat(tick_height),
              "class": tick_class,
              append_to: this.getLayer('grid')
            });

            if (this.view_is(VIEW_MODE.MONTH)) {
              tick_x += date.daysInMonth() * this.options.columnWidth / 30;
            } else {
              tick_x += this.options.columnWidth;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    }, {
      key: "make_grid_highlights",
      value: function make_grid_highlights() {
        console.log(VIEW_MODE.DAY); // highlight today's date

        if (this.view_is(VIEW_MODE.DAY)) {
          var x = dayjs_min().diff(this.start, 'hour') / this.options.step * this.options.columnWidth;
          var y = 0;
          var width = this.options.columnWidth;
          var tasksHeight = this.getTasks().getHeight();
          var grid_height = this.options.headerHeight + this.options.padding / 2 + tasksHeight;
          svg('rect', {
            x: x,
            y: y,
            width: width,
            height: grid_height,
            "class": 'today-highlight',
            append_to: this.getLayer('grid')
          });
        }
      }
    }, {
      key: "make_dates",
      value: function make_dates() {
        var _iterator3 = _createForOfIteratorHelper(this.get_dates_to_draw()),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var date = _step3.value;
            var z = svg('text', {
              x: date.lower_x,
              y: date.lower_y,
              "class": 'lower-text',
              append_to: this.getLayer('date')
            });
            z.appendChild(createFragment(date.lower_text));

            if (date.upper_text) {
              var $upper_text = svg('text', {
                x: date.upper_x,
                y: date.upper_y,
                "class": 'upper-text',
                append_to: this.getLayer('date')
              });
              $upper_text.appendChild(createFragment(date.upper_text)); // remove out-of-bound dates

              if ($upper_text.getBBox().x2 > this.getLayer('grid').getBBox().width) {
                $upper_text.remove();
              }
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    }, {
      key: "get_dates_to_draw",
      value: function get_dates_to_draw() {
        var _this3 = this;

        /** @type {dayjs.Dayjs} */
        var last_date = null;
        var dates = this.dates.map(function (date, i) {
          var d = _this3.get_date_info(date, last_date, i);

          last_date = date;
          return d;
        });
        return dates;
      }
      /**
       *
       * @param {dayjs.Dayjs} date
       * @param {dayjs.Dayjs} last_date
       * @param {number} i
       */

    }, {
      key: "get_date_info",
      value: function get_date_info(date, last_date, i) {
        if (!last_date) {
          last_date = date.add(1, 'year');
        }

        var date_text = {
          'Quarter Day_lower': date.format('HH'),
          'Half Day_lower': date.format('HH'),
          Day_lower: date.date() !== last_date.date() ? date.format('D') : '',
          Week_lower: date.month() !== last_date.month() ? date.format('D MMM') : date.format('D'),
          Month_lower: date.format('MMMM'),
          Year_lower: date.format('YYYY'),
          'Quarter Day_upper': date.date() !== last_date.date() ? date.format('D MMM') : '',
          'Half Day_upper': // eslint-disable-next-line no-nested-ternary
          date.date() !== last_date.date() ? date.month() !== last_date.month() ? date.format('D MMM') : date.format('D') : '',
          Day_upper: date.month() !== last_date.month() ? date.format('MMMM') : '',
          Week_upper: date.month() !== last_date.month() ? date.format('MMMM') : '',
          Month_upper: date.year() !== last_date.year() ? date.format('YYYY') : '',
          Year_upper: date.year() !== last_date.year() ? date.format('YYYY') : ''
        };
        var base_pos = {
          x: i * this.options.columnWidth,
          lower_y: this.options.headerHeight,
          upper_y: this.options.headerHeight - 25
        };
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
          upper_text: date_text["".concat(this.options.viewMode, "_upper")],
          lower_text: date_text["".concat(this.options.viewMode, "_lower")],
          upper_x: base_pos.x + x_pos["".concat(this.options.viewMode, "_upper")],
          upper_y: base_pos.upper_y,
          lower_x: base_pos.x + x_pos["".concat(this.options.viewMode, "_lower")],
          lower_y: base_pos.lower_y
        };
      }
    }]);

    return Grid;
  }(Internal);

  var Popup = /*#__PURE__*/function () {
    /**
     * @param {HTMLElement|SVGElement|SVGGraphicsElement} parent
     * @param {types.HtmlProducer} producer
     */
    function Popup(parent, producer) {
      _classCallCheck(this, Popup);

      this.parent = parent;
      this.producer = producer;
      this.make();
    }

    _createClass(Popup, [{
      key: "make",
      value: function make() {
        this.parent.innerHTML = "\n            <div class=\"title\"></div>\n            <div class=\"subtitle\"></div>\n            <div class=\"pointer\"></div>\n        ";
        this.hide();
        /** @type {HTMLElement|SVGGraphicsElement} */

        this.title = this.parent.querySelector('.title');
        /** @type {HTMLElement|SVGGraphicsElement} */

        this.subtitle = this.parent.querySelector('.subtitle');
        /** @type {HTMLElement|SVGGraphicsElement} */

        this.pointer = this.parent.querySelector('.pointer');
      }
      /**
       * @param {types.PopupOptions} options
       */

    }, {
      key: "show",
      value: function show(options) {
        if (!options.target) {
          throw new Error('target is required to show popup');
        }

        if (!options.position) {
          options.position = 'left';
        }

        var target = options.target;

        if (this.producer) {
          var html = this.producer(options.task);
          html += '<div class="pointer"></div>';
          this.parent.innerHTML = html;
          this.pointer = this.parent.querySelector('.pointer');
        } else {
          // set data
          this.title.innerHTML = options.title;
          this.subtitle.innerHTML = options.subtitle;
          this.parent.style.width = this.parent.clientWidth + 'px';
        } // set position


        var position_meta;

        if (target instanceof HTMLElement) {
          position_meta = target.getBoundingClientRect();
        } else if (target instanceof SVGGraphicsElement) {
          position_meta =
          /** @type {SVGGraphicsElement} */
          options.target.getBBox();
        }

        if (options.position === 'left') {
          this.parent.style.left = position_meta.x + (position_meta.width + 10) + 'px';
          this.parent.style.top = position_meta.y + 'px';
          this.pointer.style.transform = 'rotateZ(90deg)';
          this.pointer.style.left = '-7px';
          this.pointer.style.top = '2px';
        } // show


        this.parent.style.opacity = '1';
      }
    }, {
      key: "hide",
      value: function hide() {
        this.parent.style.opacity = '0';
      }
    }]);

    return Popup;
  }();

  function createFragment$1(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;

    while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
    }

    return frag;
  }

  var Bar = /*#__PURE__*/function (_Internal) {
    _inherits(Bar, _Internal);

    var _super = _createSuper(Bar);

    /**
     *
     * @param {import("./index").default} timeline
     * @param {import("./task").default} task
     */
    function Bar(timeline, task) {
      var _this;

      _classCallCheck(this, Bar);

      _this = _super.call(this, timeline);
      _this.action_completed = false;
      _this.task = task;
      _this.invalid = _this.task.invalid;
      _this.height = _this.task.height || _this.options.barHeight;
      _this.x = _this.compute_x();
      _this.y = _this.compute_y();
      _this.corner_radius = _this.options.barCornerRadius;
      _this.duration = _this.task.end.diff(_this.task.start, 'hour') / _this.options.step;
      _this.width = _this.options.columnWidth * _this.duration;
      _this.progress_width = _this.options.columnWidth * _this.duration * (_this.task.progress / 100) || 0;
      _this.group = svg('g', {
        "class": "bar-wrapper ".concat(_this.task.customClass || ''),
        'data-id': _this.task.id
      });
      _this.bar_group = svg('g', {
        "class": 'bar-group',
        append_to: _this.group
      });

      _this.draw();

      _this.bind();

      return _this;
    }

    _createClass(Bar, [{
      key: "draw",
      value: function draw() {
        this.draw_bar();
        this.draw_progress_bar();
        this.draw_label();
      }
    }, {
      key: "draw_bar",
      value: function draw_bar() {
        this.$bar = svg('rect', {
          x: this.x,
          y: this.y,
          width: this.width,
          height: this.height,
          rx: this.corner_radius,
          ry: this.corner_radius,
          "class": 'bar',
          append_to: this.bar_group
        }); //animateSVG(this.$bar, 'width', 0, this.width)

        if (this.invalid) {
          this.$bar.classList.add('bar-invalid');
        }
      }
    }, {
      key: "draw_progress_bar",
      value: function draw_progress_bar() {
        if (this.invalid) return;
        this.$bar_progress = svg('rect', {
          x: this.x,
          y: this.y,
          width: this.progress_width,
          height: this.height,
          rx: this.corner_radius,
          ry: this.corner_radius,
          "class": 'bar-progress',
          append_to: this.bar_group
        }); // animateSVG(this.$bar_progress, 'width', 0, this.progress_width)
      }
    }, {
      key: "draw_label",
      value: function draw_label() {
        var _this2 = this;

        var z = svg('text', {
          x: this.x + this.width / 2,
          y: this.y + this.height / 2,
          "class": 'bar-label',
          append_to: this.bar_group
        });
        z.appendChild(createFragment$1(this.task.name)); // labels get BBox in the next tick

        requestAnimationFrame(function () {
          return _this2.update_label_position();
        });
      }
    }, {
      key: "get_progress_polygon_points",
      value: function get_progress_polygon_points() {
        var bar_progress = this.$bar_progress;
        return [bar_progress.getEndX() - 5, bar_progress.getY() + bar_progress.getHeight(), bar_progress.getEndX() + 5, bar_progress.getY() + bar_progress.getHeight(), bar_progress.getEndX(), bar_progress.getY() + bar_progress.getHeight() - 8.66];
      }
    }, {
      key: "bind",
      value: function bind() {
        if (this.invalid) return;
        this.setup_click_event();
      }
    }, {
      key: "setup_click_event",
      value: function setup_click_event() {
        var _this3 = this;

        on(this.group, "focus ".concat(this.options.popupTrigger), function (e) {
          if (_this3.action_completed) {
            // just finished a move action, wait for a few seconds
            return;
          }

          if (e.type === 'click') {
            _this3.timeline.trigger_event('click', [_this3.task]);
          }

          _this3.timeline.unselect_all();

          _this3.group.classList.toggle('active');

          _this3.show_popup();
        });
      }
    }, {
      key: "show_popup",
      value: function show_popup() {
        var start_date = this.task.start.format('MMM D');
        var end_date = this.task.end.add(1, 'second').format('MMM D');
        var subtitle = "".concat(start_date, " - ").concat(end_date);
        this.timeline.show_popup({
          target: this.$bar,
          title: this.task.name,
          subtitle: subtitle,
          task: this.task
        });
      }
    }, {
      key: "set_action_completed",
      value: function set_action_completed() {
        var _this4 = this;

        this.action_completed = true;
        setTimeout(function () {
          _this4.action_completed = false;
        }, 1000);
      }
    }, {
      key: "compute_progress",
      value: function compute_progress() {
        var progress = this.$bar_progress.getWidth() / this.$bar.getWidth() * 100;
        return Math.floor(progress);
      }
    }, {
      key: "compute_x",
      value: function compute_x() {
        var step = this.options.step,
            column_width = this.options.columnWidth;
        var task_start = this.task.start;
        var gantt_start = this.timeline.grid.start;
        var diff = task_start.diff(gantt_start, 'hour');
        var x = diff / step * column_width;

        if (this.timeline.grid.view_is('Month')) {
          var d = task_start.diff(gantt_start, 'day');
          x = d * column_width / 30;
        }

        return x;
      }
    }, {
      key: "compute_y",
      value: function compute_y() {
        var sum = 0,
            idx = this.getTasks().entries().indexOf(this.task);

        for (var i = 0; i < idx; i++) {
          sum += this.getTaskIdx(i).height + this.options.padding;
        }

        return this.options.headerHeight + this.options.padding + sum;
      }
    }, {
      key: "update_label_position",
      value: function update_label_position() {
        var bar = this.$bar;
        /** @type {SVGGraphicsElement} */

        var label = this.group.querySelector('.bar-label');

        if (label.getBBox().width > bar.getWidth()) {
          label.classList.add('big');
          label.setAttribute('x', bar.getX() + bar.getWidth() + 5 + '');
        } else {
          label.classList.remove('big');
          label.setAttribute('x', bar.getX() + bar.getWidth() / 2 + '');
        }
      }
    }]);

    return Bar;
  }(Internal);

  var Milestone = /*#__PURE__*/function (_Internal) {
    _inherits(Milestone, _Internal);

    var _super = _createSuper(Milestone);

    /**
     *
     * @param {import("./index").default} timeline
     * @param {import("./task").default}  task
     * @param {types.MilestoneOptions} opts
     */
    function Milestone(timeline, task, opts) {
      var _this;

      _classCallCheck(this, Milestone);

      _this = _super.call(this, timeline);
      /** @type {dayjs.Dayjs} */

      _this.date = dayjs_min(opts.date);
      /** @type {import("./task").default} */

      _this.task = task;
      /** @type {string} */

      _this.href = opts.href;
      /** @type {number} */

      _this.height = opts.height || _this.options.barHeight;
      /** @type {number} */

      _this.x = _this.computeX();
      /** @type {number} */

      _this.y = _this.computeY();
      /** @type {number} */

      _this.width = 16;
      /** @type {SVGElement} */

      _this.group = _this.task.milestone_group;
      /** @type {SVGElement} */

      _this.$element = null;

      _this.draw();

      return _this;
    }

    _createClass(Milestone, [{
      key: "draw",
      value: function draw() {
        this.$element = svg('image', {
          x: this.x,
          y: this.y,
          width: this.width,
          height: this.width,
          href: this.href,
          append_to: this.group
        });
      }
      /** @returns {number} */

    }, {
      key: "computeX",
      value: function computeX() {
        var step = this.options.step,
            column_width = this.options.columnWidth;
        var task_start = this.date;
        var gantt_start = this.timeline.grid.start;
        var diff = task_start.diff(gantt_start, 'hour');
        var x = diff / step * column_width;

        if (this.timeline.grid.view_is('Month')) {
          var d = task_start.diff(gantt_start, 'day');
          x = d * column_width / 30;
        }

        return x;
      }
      /** @returns {number} */

    }, {
      key: "computeY",
      value: function computeY() {
        var idx = this.getTasks().entries().indexOf(this.task);
        return this.options.headerHeight + this.options.padding + idx * (this.height + this.options.padding);
      }
    }]);

    return Milestone;
  }(Internal);

  /**
   *
   * @param {Task} task
   */

  function generate_id(task) {
    return task.name + '_' + Math.random().toString(36).slice(2, 12);
  }

  var Task = /*#__PURE__*/function (_Internal) {
    _inherits(Task, _Internal);

    var _super = _createSuper(Task);

    /**
     * @param {import("./index").default} timeline
     * @param {types.TaskOptions} opts
     */
    function Task(timeline, opts) {
      var _this;

      _classCallCheck(this, Task);

      _this = _super.call(this, timeline);
      /** @type {dayjs.Dayjs} */

      _this.start = dayjs_min(opts.start);
      /** @type {dayjs.Dayjs} */

      _this.end = dayjs_min(opts.end);
      /** @type {number} */

      _this.progress = opts.progress;
      /** @type {string} */

      _this.name = opts.name;
      /** @type {number} */

      _this.height = opts.height || _this.options.barHeight;
      /** @type {Array<types.MilestoneOptions>} */

      _this.milestones = opts.milestones || [];
      /** @type {string} */

      _this.customClass = opts.customClass;
      /** @type {string} */

      _this.id = opts.id;
      /**
       * @private
       * @type {Array<Milestone>}
       */

      _this.$milestones = null;
      /**
       * @private
       * @type {Bar}
       */

      _this.$bar = null; // make task invalid if duration too large

      if (_this.end.diff(_this.start, 'year') > 10) {
        _this.end = null;
      } // invalid dates


      if (!_this.start && !_this.end) {
        _this.start = dayjs_min().startOf('day');
        _this.end = _this.start.add(2, 'day');
      }

      if (!_this.start && _this.end) {
        _this.start = _this.end.subtract(2, 'day');
      }

      if (_this.start && !_this.end) {
        _this.end = _this.start.add(2, 'day');
      } // if hours is not set, assume the last day is full day
      // e.g: 2018-09-09 becomes 2018-09-09 23:59:59


      if (_this.end.isSame(_this.end.startOf('day'))) {
        _this.end = _this.end.add(24, 'hour');
      } // invalid flag


      if (!_this.start || !_this.end) {
        _this.invalid = true;
      }

      if (!_this.id) {
        _this.id = generate_id(_assertThisInitialized(_this));
      }

      return _this;
    }

    _createClass(Task, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        this.milestone_group = svg('g', {
          "class": "milestone-wrapper ".concat(this.customClass || ''),
          'data-id': this.id
        });
        this.$bar = new Bar(this.timeline, this);
        var layer = this.getLayer('bar');
        layer.appendChild(this.$bar.group);
        layer.appendChild(this.milestone_group);
        this.$milestones = this.milestones.map(function (m) {
          return new Milestone(_this2.timeline, _this2, m);
        });
      }
    }]);

    return Task;
  }(Internal);

  var Tasks = /*#__PURE__*/function (_Internal) {
    _inherits(Tasks, _Internal);

    var _super = _createSuper(Tasks);

    /**
     *
     * @param {import("./index.js").timeline} timeline Timeline}
     * @param {Array<types.TaskOptions>} tasks Array of task configurations
     */
    function Tasks(timeline, tasks) {
      var _this;

      _classCallCheck(this, Tasks);

      _this = _super.call(this, timeline);
      /**
       * @private
       * @type {Array<Task>}
       */

      _this.tasks = tasks.map(function (t) {
        return new Task(timeline, t);
      });
      return _this;
    }
    /**
     * @returns {{ gantt_start: dayjs.Dayjs, gantt_end: dayjs.Dayjs }}
     */


    _createClass(Tasks, [{
      key: "getBoundingDates",
      value: function getBoundingDates() {
        /** @type {dayjs.Dayjs} */
        var gantt_start = null;
        /** @type {dayjs.Dayjs} */

        var gantt_end = null;

        var _iterator = _createForOfIteratorHelper(this.tasks),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var task = _step.value;

            // set global start and end date
            if (!gantt_start || task.start < gantt_start) {
              gantt_start = task.start;
            }

            if (!gantt_end || task.end > gantt_end) {
              gantt_end = task.end;
            }

            if (task.milestones) {
              var _iterator2 = _createForOfIteratorHelper(task.milestones),
                  _step2;

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var milestone = _step2.value;
                  var d = dayjs_min(milestone.date);

                  if (d.isBefore(gantt_start)) {
                    gantt_start = d;
                  }

                  if (d.isAfter(gantt_end)) {
                    gantt_end = d;
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return {
          gantt_start: gantt_start,
          gantt_end: gantt_end
        };
      }
    }, {
      key: "render",
      value: function render() {
        this.tasks.forEach(function (t) {
          return t.render();
        });
      }
      /** @returns {number} */

    }, {
      key: "getHeight",
      value: function getHeight() {
        var sum = this.options.padding * this.tasks.length;

        var _iterator3 = _createForOfIteratorHelper(this.tasks),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var task = _step3.value;
            sum += task.height;
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        return sum;
      }
    }, {
      key: "entries",
      value: function entries() {
        return this.tasks;
      }
    }]);

    return Tasks;
  }(Internal);

  /**
   * @typedef {Timeline} timeline
   */

  var Timeline = /*#__PURE__*/function () {
    /**
     *
     * @param {string|HTMLElement|SVGElement} wrapper
     * @param {*} tasks
     * @param {types.TimelineOptions} options
     */
    function Timeline(wrapper, tasks, options) {
      _classCallCheck(this, Timeline);

      this.options = _objectSpread2(_objectSpread2({}, TimelineOptions), options);
      /** @type {SVGElement} */

      this.$svg;
      /** @type {HTMLDivElement} */

      this.$container;
      /** @type {HTMLDivElement} */

      this.popup_wrapper;
      this.setup_wrapper(wrapper);
      this.grid = new Grid(this);
      this.tasks = new Tasks(this, tasks);
      this.change_view_mode();
      this.bind_events();
    }
    /** @param {string|HTMLElement|SVGElement} element */


    _createClass(Timeline, [{
      key: "setup_wrapper",
      value: function setup_wrapper(element) {
        /** @type {SVGElement} */
        var svg_element;
        /** @type {Element|string} */

        var wrapper_element = element; // CSS Selector is passed

        if (typeof wrapper_element === 'string') {
          wrapper_element = document.querySelector(wrapper_element);
        } // get the SVGElement


        if (wrapper_element instanceof HTMLElement) {
          svg_element = wrapper_element.querySelector('svg');
        } else if (wrapper_element instanceof SVGElement) {
          svg_element = wrapper_element;
        } else {
          throw new TypeError('Frappé Gantt only supports usage of a string CSS selector,' + " HTML DOM element or SVG DOM element for the 'element' parameter");
        } // svg element


        if (!svg_element) {
          // create it
          this.$svg = svg('svg', {
            append_to: wrapper_element,
            "class": 'gantt'
          });
        } else {
          this.$svg = svg_element;
          console.log(this.$svg);
          this.$svg.classList.add('gantt');
        } // wrapper element


        this.$container = document.createElement('div');
        this.$container.classList.add('gantt-container');
        var parent_element = this.$svg.parentNode;
        parent_element.appendChild(this.$container);
        this.$container.appendChild(this.$svg); // popup wrapper

        this.popup_wrapper = document.createElement('div');
        this.popup_wrapper.classList.add('popup-wrapper');
        this.$container.appendChild(this.popup_wrapper);
      }
      /** @param {types.TaskOptions[]} tasks*/

    }, {
      key: "refresh",
      value: function refresh(tasks) {
        this.tasks = new Tasks(this, tasks);
        this.change_view_mode();
      }
    }, {
      key: "change_view_mode",
      value: function change_view_mode() {
        var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.options.viewMode;
        this.update_view_scale(mode);
        this.grid.setup_dates();
        this.render(); // fire viewmode_change event

        this.trigger_event('view_change', [mode]);
      }
      /** @param {VIEW_MODE} viewMode */

    }, {
      key: "update_view_scale",
      value: function update_view_scale(viewMode) {
        this.options.viewMode = viewMode;

        if (viewMode === VIEW_MODE.DAY) {
          this.options.step = 24;
          this.options.columnWidth = 38;
        } else if (viewMode === VIEW_MODE.HALF_DAY) {
          this.options.step = 24 / 2;
          this.options.columnWidth = 38;
        } else if (viewMode === VIEW_MODE.QUARTER_DAY) {
          this.options.step = 24 / 4;
          this.options.columnWidth = 38;
        } else if (viewMode === VIEW_MODE.WEEK) {
          this.options.step = 24 * 7;
          this.options.columnWidth = 140;
        } else if (viewMode === VIEW_MODE.MONTH) {
          this.options.step = 24 * 30;
          this.options.columnWidth = 120;
        } else if (viewMode === VIEW_MODE.YEAR) {
          this.options.step = 24 * 365;
          this.options.columnWidth = 120;
        }
      }
    }, {
      key: "bind_events",
      value: function bind_events() {
        this.bind_grid_click();
      }
    }, {
      key: "render",
      value: function render() {
        this.clear();
        this.setup_layers();
        this.grid.render();
        this.tasks.render();
        this.set_width();
        this.set_scroll_position();
      }
    }, {
      key: "setup_layers",
      value: function setup_layers() {
        this.layers = {};
        var layers = ['grid', 'date', 'progress', 'bar', 'details']; // make group layers

        for (var _i = 0, _layers = layers; _i < _layers.length; _i++) {
          var layer = _layers[_i];
          this.layers[layer] = svg('g', {
            "class": layer,
            append_to: this.$svg
          });
        }
      }
    }, {
      key: "set_width",
      value: function set_width() {
        var cur_width = this.$svg.getBoundingClientRect().width;
        var actual_width = this.$svg.querySelector('.grid .grid-row').getAttribute('width');

        if (cur_width < actual_width) {
          this.$svg.setAttribute('width', actual_width);
        }
      }
    }, {
      key: "set_scroll_position",
      value: function set_scroll_position() {
        var parent_element = this.$svg.parentElement;
        if (!parent_element) return;
        var hours_before_first_task = this.get_oldest_starting_date().diff(this.grid.start, 'hour');
        var scroll_pos = hours_before_first_task / this.options.step * this.options.columnWidth - this.options.columnWidth;
        parent_element.scrollLeft = scroll_pos;
      }
    }, {
      key: "bind_grid_click",
      value: function bind_grid_click() {
        var _this = this;

        on(this.$svg, this.options.popupTrigger, function () {
          _this.unselect_all();

          _this.hide_popup();
        }, '.grid-row, .grid-header');
      }
    }, {
      key: "unselect_all",
      value: function unselect_all() {

        _toConsumableArray(this.$svg.querySelectorAll('.bar-wrapper')).forEach(function (el) {
          el.classList.remove('active');
        });
      }
      /** @param {types.PopupOptions} options */

    }, {
      key: "show_popup",
      value: function show_popup(options) {
        if (!this.popup) {
          this.popup = new Popup(this.popup_wrapper, this.options.producer);
        }

        this.popup.show(options);
      }
    }, {
      key: "hide_popup",
      value: function hide_popup() {
        return this.popup && this.popup.hide();
      }
    }, {
      key: "trigger_event",
      value: function trigger_event(event, args) {
        if (this.options['on_' + event]) {
          this.options['on_' + event].apply(null, args);
        }
      }
    }, {
      key: "get_oldest_starting_date",
      value: function get_oldest_starting_date() {
        return this.tasks.tasks.map(function (task) {
          return task.start;
        }).reduce(function (prev_date, cur_date) {
          return cur_date <= prev_date ? cur_date : prev_date;
        });
      }
    }, {
      key: "clear",
      value: function clear() {
        this.$svg.innerHTML = '';
      }
    }]);

    return Timeline;
  }();

  return Timeline;

}());
