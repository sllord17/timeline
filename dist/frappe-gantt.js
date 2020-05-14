var Gantt = (function () {
'use strict';

function _typeof(obj) {
  "@babel/helpers - typeof";

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

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
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

var YEAR = 'year';
var MONTH = 'month';
var DAY = 'day';
var HOUR = 'hour';
var MINUTE = 'minute';
var SECOND = 'second';
var MILLISECOND = 'millisecond';
var month_names = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  ptBr: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  zh: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
};
var date_utils = {
  parse: function parse(date) {
    var date_separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '-';
    var time_separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : /[.:]/;

    if (date instanceof Date) {
      return date;
    }

    if (typeof date === 'string') {
      var date_parts, time_parts;
      var parts = date.split(' ');
      date_parts = parts[0].split(date_separator).map(function (val) {
        return parseInt(val, 10);
      });
      time_parts = parts[1] && parts[1].split(time_separator); // month is 0 indexed

      date_parts[1] = date_parts[1] - 1;
      var vals = date_parts;

      if (time_parts && time_parts.length) {
        if (time_parts.length == 4) {
          time_parts[3] = '0.' + time_parts[3];
          time_parts[3] = parseFloat(time_parts[3]) * 1000;
        }

        vals = vals.concat(time_parts);
      }

      return _construct(Date, _toConsumableArray(vals));
    }
  },
  to_string: function to_string(date) {
    var with_time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (!(date instanceof Date)) {
      throw new TypeError('Invalid argument type');
    }

    var vals = this.get_date_values(date).map(function (val, i) {
      if (i === 1) {
        // add 1 for month
        val = val + 1;
      }

      if (i === 6) {
        return padStart(val + '', 3, '0');
      }

      return padStart(val + '', 2, '0');
    });
    var date_string = "".concat(vals[0], "-").concat(vals[1], "-").concat(vals[2]);
    var time_string = "".concat(vals[3], ":").concat(vals[4], ":").concat(vals[5], ".").concat(vals[6]);
    return date_string + (with_time ? ' ' + time_string : '');
  },
  format: function format(date) {
    var format_string = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'YYYY-MM-DD HH:mm:ss.SSS';
    var lang = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'en';
    var values = this.get_date_values(date).map(function (d) {
      return padStart(d, 2, 0);
    });
    var format_map = {
      YYYY: values[0],
      MM: padStart(+values[1] + 1, 2, 0),
      DD: values[2],
      HH: values[3],
      mm: values[4],
      ss: values[5],
      SSS: values[6],
      D: values[2],
      MMMM: month_names[lang][+values[1]],
      MMM: month_names[lang][+values[1]]
    };
    var str = format_string;
    var formatted_values = [];
    Object.keys(format_map).sort(function (a, b) {
      return b.length - a.length;
    }) // big string first
    .forEach(function (key) {
      if (str.includes(key)) {
        str = str.replace(key, "$".concat(formatted_values.length));
        formatted_values.push(format_map[key]);
      }
    });
    formatted_values.forEach(function (value, i) {
      str = str.replace("$".concat(i), value);
    });
    return str;
  },
  diff: function diff(date_a, date_b) {
    var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DAY;
    var milliseconds, seconds, hours, minutes, days, months, years;
    milliseconds = date_a - date_b;
    seconds = milliseconds / 1000;
    minutes = seconds / 60;
    hours = minutes / 60;
    days = hours / 24;
    months = days / 30;
    years = months / 12;

    if (!scale.endsWith('s')) {
      scale += 's';
    }

    return Math.floor({
      milliseconds: milliseconds,
      seconds: seconds,
      minutes: minutes,
      hours: hours,
      days: days,
      months: months,
      years: years
    }[scale]);
  },
  today: function today() {
    var vals = this.get_date_values(new Date()).slice(0, 3);
    return _construct(Date, _toConsumableArray(vals));
  },
  now: function now() {
    return new Date();
  },
  add: function add(date, qty, scale) {
    qty = parseInt(qty, 10);
    var vals = [date.getFullYear() + (scale === YEAR ? qty : 0), date.getMonth() + (scale === MONTH ? qty : 0), date.getDate() + (scale === DAY ? qty : 0), date.getHours() + (scale === HOUR ? qty : 0), date.getMinutes() + (scale === MINUTE ? qty : 0), date.getSeconds() + (scale === SECOND ? qty : 0), date.getMilliseconds() + (scale === MILLISECOND ? qty : 0)];
    return _construct(Date, vals);
  },
  start_of: function start_of(date, scale) {
    var _scores;

    var scores = (_scores = {}, _defineProperty(_scores, YEAR, 6), _defineProperty(_scores, MONTH, 5), _defineProperty(_scores, DAY, 4), _defineProperty(_scores, HOUR, 3), _defineProperty(_scores, MINUTE, 2), _defineProperty(_scores, SECOND, 1), _defineProperty(_scores, MILLISECOND, 0), _scores);

    function should_reset(_scale) {
      var max_score = scores[scale];
      return scores[_scale] <= max_score;
    }

    var vals = [date.getFullYear(), should_reset(YEAR) ? 0 : date.getMonth(), should_reset(MONTH) ? 1 : date.getDate(), should_reset(DAY) ? 0 : date.getHours(), should_reset(HOUR) ? 0 : date.getMinutes(), should_reset(MINUTE) ? 0 : date.getSeconds(), should_reset(SECOND) ? 0 : date.getMilliseconds()];
    return _construct(Date, vals);
  },
  clone: function clone(date) {
    return _construct(Date, _toConsumableArray(this.get_date_values(date)));
  },
  get_date_values: function get_date_values(date) {
    return [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()];
  },
  get_days_in_month: function get_days_in_month(date) {
    var no_of_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var month = date.getMonth();

    if (month !== 1) {
      return no_of_days[month];
    } // Feb


    var year = date.getFullYear();

    if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
      return 29;
    }

    return 28;
  }
}; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart

function padStart(str, targetLength, padString) {
  str = str + '';
  targetLength = targetLength >> 0;
  padString = String(typeof padString !== 'undefined' ? padString : ' ');

  if (str.length > targetLength) {
    return String(str);
  } else {
    targetLength = targetLength - str.length;

    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length);
    }

    return padString.slice(0, targetLength) + String(str);
  }
}

function $(expr, con) {
  return typeof expr === 'string' ? (con || document).querySelector(expr) : expr || null;
}
function createSVG(tag, attrs) {
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

  return elem;
}
function animateSVG(svgElement, attr, from, to) {
  var animatedSvgElement = getAnimationElement(svgElement, attr, from, to);

  if (animatedSvgElement === svgElement) {
    // triggered 2nd time programmatically
    // trigger artificial click event
    var event = document.createEvent('HTMLEvents');
    event.initEvent('click', true, true);
    event.eventName = 'click';
    animatedSvgElement.dispatchEvent(event);
  }
}

function getAnimationElement(svgElement, attr, from, to) {
  var dur = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '0.4s';
  var begin = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '0.1s';
  var animEl = svgElement.querySelector('animate');

  if (animEl) {
    $.attr(animEl, {
      attributeName: attr,
      from: from,
      to: to,
      dur: dur,
      begin: 'click + ' + begin // artificial click

    });
    return svgElement;
  }

  var animateElement = createSVG('animate', {
    attributeName: attr,
    from: from,
    to: to,
    dur: dur,
    begin: begin,
    calcMode: 'spline',
    values: from + ';' + to,
    keyTimes: '0; 1',
    keySplines: cubic_bezier('ease-out')
  });
  svgElement.appendChild(animateElement);
  return svgElement;
}

function cubic_bezier(name) {
  return {
    ease: '.25 .1 .25 1',
    linear: '0 0 1 1',
    'ease-in': '.42 0 1 1',
    'ease-out': '0 0 .58 1',
    'ease-in-out': '.42 0 .58 1'
  }[name];
}

$.on = function (element, event, selector, callback) {
  if (!callback) {
    callback = selector;
    $.bind(element, event, callback);
  } else {
    $.delegate(element, event, selector, callback);
  }
};

$.off = function (element, event, handler) {
  element.removeEventListener(event, handler);
};

$.bind = function (element, event, callback) {
  event.split(/\s+/).forEach(function (event) {
    element.addEventListener(event, callback);
  });
};

$.delegate = function (element, event, selector, callback) {
  element.addEventListener(event, function (e) {
    var delegatedTarget = e.target.closest(selector);

    if (delegatedTarget) {
      e.delegatedTarget = delegatedTarget;
      callback.call(this, e, delegatedTarget);
    }
  });
};

$.closest = function (selector, element) {
  if (!element) return null;

  if (element.matches(selector)) {
    return element;
  }

  return $.closest(selector, element.parentNode);
};

$.attr = function (element, attr, value) {
  if (!value && typeof attr === 'string') {
    return element.getAttribute(attr);
  }

  if (_typeof(attr) === 'object') {
    for (var key in attr) {
      $.attr(element, key, attr[key]);
    }

    return;
  }

  element.setAttribute(attr, value);
};

var Milestone = /*#__PURE__*/function () {
  function Milestone(gantt, task, bar, opts) {
    _classCallCheck(this, Milestone);

    this.set_defaults(gantt, task, bar, opts);
    this.prepare();
    this.bind();
  }

  _createClass(Milestone, [{
    key: "set_defaults",
    value: function set_defaults(gantt, task, bar, opts) {
      this.action_completed = false;
      this.gantt = gantt;
      this.bar = bar;
      this.task = task;
      this.href = opts.href;
      this.date = opts.date;
    }
  }, {
    key: "prepare",
    value: function prepare() {
      this.prepare_values();
      this.prepare_helpers();
    }
  }, {
    key: "prepare_values",
    value: function prepare_values() {
      this.invalid = this.task.invalid;
      this.height = this.gantt.options.bar_height;
      this.x = this.compute_x();
      this.y = this.compute_y();
      this.href = this.href;
      this.width = 16;
      this.group = this.bar.milestone_group;
    }
  }, {
    key: "prepare_helpers",
    value: function prepare_helpers() {
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
    }
  }, {
    key: "draw",
    value: function draw() {
      this.draw_image();
    }
  }, {
    key: "draw_image",
    value: function draw_image() {
      this.$image = createSVG('image', {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.width,
        href: this.href,
        append_to: this.group
      });
    }
  }, {
    key: "bind",
    value: function bind() {
      if (this.invalid) return;
    }
  }, {
    key: "compute_x",
    value: function compute_x() {
      var _this$gantt$options = this.gantt.options,
          step = _this$gantt$options.step,
          column_width = _this$gantt$options.column_width;
      var task_start = this.date;
      var gantt_start = this.gantt.gantt_start;
      var diff = date_utils.diff(task_start, gantt_start, 'hour');
      var x = diff / step * column_width;

      if (this.gantt.view_is('Month')) {
        var _diff = date_utils.diff(task_start, gantt_start, 'day');

        x = _diff * column_width / 30;
      }

      return x;
    }
  }, {
    key: "compute_y",
    value: function compute_y() {
      return this.gantt.options.header_height + this.gantt.options.padding + this.task._index * (this.height + this.gantt.options.padding);
    }
  }]);

  return Milestone;
}();

var Bar = /*#__PURE__*/function () {
  function Bar(gantt, task) {
    _classCallCheck(this, Bar);

    this.set_defaults(gantt, task);
    this.prepare();
    this.draw();
    this.bind();
  }

  _createClass(Bar, [{
    key: "set_defaults",
    value: function set_defaults(gantt, task) {
      this.action_completed = false;
      this.gantt = gantt;
      this.task = task;
      this.milestones = [];
    }
  }, {
    key: "make_milestones",
    value: function make_milestones() {
      if (this.task.milestones) this.milestones = this.task.milestones.map(function (obj) {
        return new Milestone(this.gantt, this.task, this, obj);
      }.bind(this));
    }
  }, {
    key: "prepare",
    value: function prepare() {
      this.prepare_values();
      this.prepare_helpers();
      this.make_milestones();
    }
  }, {
    key: "prepare_values",
    value: function prepare_values() {
      this.invalid = this.task.invalid;
      this.height = this.task.height || this.gantt.options.bar_height;
      this.x = this.compute_x();
      this.y = this.compute_y();
      this.corner_radius = this.gantt.options.bar_corner_radius;
      this.duration = date_utils.diff(this.task._end, this.task._start, 'hour') / this.gantt.options.step;
      this.width = this.gantt.options.column_width * this.duration;
      this.progress_width = this.gantt.options.column_width * this.duration * (this.task.progress / 100) || 0;
      this.group = createSVG('g', {
        "class": "bar-wrapper ".concat(this.task.custom_class || ''),
        'data-id': this.task.id
      });
      this.bar_group = createSVG('g', {
        "class": 'bar-group',
        append_to: this.group
      });
      this.handle_group = createSVG('g', {
        "class": 'handle-group',
        append_to: this.group
      });
      this.milestone_group = createSVG('g', {
        "class": "milestone-wrapper ".concat(this.task.custom_class || ''),
        'data-id': this.task.id
      });
    }
  }, {
    key: "prepare_helpers",
    value: function prepare_helpers() {
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
    }
  }, {
    key: "draw",
    value: function draw() {
      this.draw_bar();
      this.draw_progress_bar();
      this.draw_label();
      this.draw_milestones();
    }
  }, {
    key: "draw_milestones",
    value: function draw_milestones() {
      this.milestones.forEach(function (m) {
        return m.draw();
      });
    }
  }, {
    key: "draw_bar",
    value: function draw_bar() {
      this.$bar = createSVG('rect', {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        rx: this.corner_radius,
        ry: this.corner_radius,
        "class": 'bar',
        append_to: this.bar_group
      });
      animateSVG(this.$bar, 'width', 0, this.width);

      if (this.invalid) {
        this.$bar.classList.add('bar-invalid');
      }
    }
  }, {
    key: "draw_progress_bar",
    value: function draw_progress_bar() {
      if (this.invalid) return;
      this.$bar_progress = createSVG('rect', {
        x: this.x,
        y: this.y,
        width: this.progress_width,
        height: this.height,
        rx: this.corner_radius,
        ry: this.corner_radius,
        "class": 'bar-progress',
        append_to: this.bar_group
      });
      animateSVG(this.$bar_progress, 'width', 0, this.progress_width);
    }
  }, {
    key: "draw_label",
    value: function draw_label() {
      var _this = this;

      createSVG('text', {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        innerHTML: this.task.name,
        "class": 'bar-label',
        append_to: this.bar_group
      }); // labels get BBox in the next tick

      requestAnimationFrame(function () {
        return _this.update_label_position();
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
      var _this2 = this;

      $.on(this.group, "focus ".concat(this.gantt.options.popup_trigger), function (e) {
        if (_this2.action_completed) {
          // just finished a move action, wait for a few seconds
          return;
        }

        if (e.type === 'click') {
          _this2.gantt.trigger_event('click', [_this2.task]);
        }

        _this2.gantt.unselect_all();

        _this2.group.classList.toggle('active');

        _this2.show_popup();
      });
    }
  }, {
    key: "show_popup",
    value: function show_popup() {
      if (this.gantt.bar_being_dragged) return;
      var start_date = date_utils.format(this.task._start, 'MMM D', this.gantt.options.language);
      var end_date = date_utils.format(date_utils.add(this.task._end, -1, 'second'), 'MMM D', this.gantt.options.language);
      var subtitle = "".concat(start_date, " - ").concat(end_date);
      this.gantt.show_popup({
        target_element: this.$bar,
        title: this.task.name,
        subtitle: subtitle,
        task: this.task
      });
    }
  }, {
    key: "set_action_completed",
    value: function set_action_completed() {
      var _this3 = this;

      this.action_completed = true;
      setTimeout(function () {
        return _this3.action_completed = false;
      }, 1000);
    }
  }, {
    key: "compute_progress",
    value: function compute_progress() {
      var progress = this.$bar_progress.getWidth() / this.$bar.getWidth() * 100;
      return parseInt(progress, 10);
    }
  }, {
    key: "compute_x",
    value: function compute_x() {
      var _this$gantt$options = this.gantt.options,
          step = _this$gantt$options.step,
          column_width = _this$gantt$options.column_width;
      var task_start = this.task._start;
      var gantt_start = this.gantt.gantt_start;
      var diff = date_utils.diff(task_start, gantt_start, 'hour');
      var x = diff / step * column_width;

      if (this.gantt.view_is('Month')) {
        var _diff = date_utils.diff(task_start, gantt_start, 'day');

        x = _diff * column_width / 30;
      }

      return x;
    }
  }, {
    key: "compute_y",
    value: function compute_y() {
      var sum = 0;

      for (var i = 0; i < this.task._index; i++) {
        sum += this.gantt.tasks[i].height || this.gantt.options.bar_height;
      }

      sum += this.task._index * this.gantt.options.padding;
      return this.gantt.options.header_height + this.gantt.options.padding + sum;
    }
  }, {
    key: "update_label_position",
    value: function update_label_position() {
      var bar = this.$bar;
      var label = this.group.querySelector('.bar-label');

      if (label.getBBox().width > bar.getWidth()) {
        label.classList.add('big');
        label.setAttribute('x', bar.getX() + bar.getWidth() + 5);
      } else {
        label.classList.remove('big');
        label.setAttribute('x', bar.getX() + bar.getWidth() / 2);
      }
    }
  }]);

  return Bar;
}();

var Popup = /*#__PURE__*/function () {
  function Popup(parent, custom_html) {
    _classCallCheck(this, Popup);

    this.parent = parent;
    this.custom_html = custom_html;
    this.make();
  }

  _createClass(Popup, [{
    key: "make",
    value: function make() {
      this.parent.innerHTML = "\n            <div class=\"title\"></div>\n            <div class=\"subtitle\"></div>\n            <div class=\"pointer\"></div>\n        ";
      this.hide();
      this.title = this.parent.querySelector('.title');
      this.subtitle = this.parent.querySelector('.subtitle');
      this.pointer = this.parent.querySelector('.pointer');
    }
  }, {
    key: "show",
    value: function show(options) {
      if (!options.target_element) {
        throw new Error('target_element is required to show popup');
      }

      if (!options.position) {
        options.position = 'left';
      }

      var target_element = options.target_element;

      if (this.custom_html) {
        var html = this.custom_html(options.task);
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

      if (target_element instanceof HTMLElement) {
        position_meta = target_element.getBoundingClientRect();
      } else if (target_element instanceof SVGElement) {
        position_meta = options.target_element.getBBox();
      }

      if (options.position === 'left') {
        this.parent.style.left = position_meta.x + (position_meta.width + 10) + 'px';
        this.parent.style.top = position_meta.y + 'px';
        this.pointer.style.transform = 'rotateZ(90deg)';
        this.pointer.style.left = '-7px';
        this.pointer.style.top = '2px';
      } // show


      this.parent.style.opacity = 1;
    }
  }, {
    key: "hide",
    value: function hide() {
      this.parent.style.opacity = 0;
    }
  }]);

  return Popup;
}();

var VIEW_MODE = {
  QUARTER_DAY: 'Quarter Day',
  HALF_DAY: 'Half Day',
  DAY: 'Day',
  WEEK: 'Week',
  MONTH: 'Month',
  YEAR: 'Year'
};

var Gantt = /*#__PURE__*/function () {
  function Gantt(wrapper, tasks, options) {
    _classCallCheck(this, Gantt);

    this.setup_wrapper(wrapper);
    this.setup_options(options);
    this.setup_tasks(tasks); // initialize with default view mode

    this.change_view_mode();
    this.bind_events();
  }

  _createClass(Gantt, [{
    key: "setup_wrapper",
    value: function setup_wrapper(element) {
      var svg_element, wrapper_element; // CSS Selector is passed

      if (typeof element === 'string') {
        element = document.querySelector(element);
      } // get the SVGElement


      if (element instanceof HTMLElement) {
        wrapper_element = element;
        svg_element = element.querySelector('svg');
      } else if (element instanceof SVGElement) {
        svg_element = element;
      } else {
        throw new TypeError('Frappé Gantt only supports usage of a string CSS selector,' + " HTML DOM element or SVG DOM element for the 'element' parameter");
      } // svg element


      if (!svg_element) {
        // create it
        this.$svg = createSVG('svg', {
          append_to: wrapper_element,
          "class": 'gantt'
        });
      } else {
        this.$svg = svg_element;
        this.$svg.classList.add('gantt');
      } // wrapper element


      this.$container = document.createElement('div');
      this.$container.classList.add('gantt-container');
      var parent_element = this.$svg.parentElement;
      parent_element.appendChild(this.$container);
      this.$container.appendChild(this.$svg); // popup wrapper

      this.popup_wrapper = document.createElement('div');
      this.popup_wrapper.classList.add('popup-wrapper');
      this.$container.appendChild(this.popup_wrapper);
    }
  }, {
    key: "setup_options",
    value: function setup_options(options) {
      var default_options = {
        header_height: 50,
        column_width: 30,
        step: 24,
        view_modes: _toConsumableArray(Object.values(VIEW_MODE)),
        bar_height: 20,
        bar_corner_radius: 3,
        padding: 18,
        view_mode: 'Day',
        date_format: 'YYYY-MM-DD',
        popup_trigger: 'click',
        custom_popup_html: null,
        language: 'en'
      };
      this.options = _objectSpread2(_objectSpread2({}, default_options), options);
    }
  }, {
    key: "setup_tasks",
    value: function setup_tasks(tasks) {
      // prepare tasks
      this.tasks = tasks.map(function (task, i) {
        // convert to Date objects
        task._start = date_utils.parse(task.start);
        task._end = date_utils.parse(task.end); // make task invalid if duration too large

        if (date_utils.diff(task._end, task._start, 'year') > 10) {
          task.end = null;
        } // cache index


        task._index = i; // invalid dates

        if (!task.start && !task.end) {
          var today = date_utils.today();
          task._start = today;
          task._end = date_utils.add(today, 2, 'day');
        }

        if (!task.start && task.end) {
          task._start = date_utils.add(task._end, -2, 'day');
        }

        if (task.start && !task.end) {
          task._end = date_utils.add(task._start, 2, 'day');
        } // if hours is not set, assume the last day is full day
        // e.g: 2018-09-09 becomes 2018-09-09 23:59:59


        var task_end_values = date_utils.get_date_values(task._end);

        if (task_end_values.slice(3).every(function (d) {
          return d === 0;
        })) {
          task._end = date_utils.add(task._end, 24, 'hour');
        } // invalid flag


        if (!task.start || !task.end) {
          task.invalid = true;
        } // uids


        if (!task.id) {
          task.id = generate_id(task);
        }

        return task;
      });
    }
  }, {
    key: "refresh",
    value: function refresh(tasks) {
      this.setup_tasks(tasks);
      this.change_view_mode();
    }
  }, {
    key: "change_view_mode",
    value: function change_view_mode() {
      var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.options.view_mode;
      this.update_view_scale(mode);
      this.setup_dates();
      this.render(); // fire viewmode_change event

      this.trigger_event('view_change', [mode]);
    }
  }, {
    key: "update_view_scale",
    value: function update_view_scale(view_mode) {
      this.options.view_mode = view_mode;

      if (view_mode === VIEW_MODE.DAY) {
        this.options.step = 24;
        this.options.column_width = 38;
      } else if (view_mode === VIEW_MODE.HALF_DAY) {
        this.options.step = 24 / 2;
        this.options.column_width = 38;
      } else if (view_mode === VIEW_MODE.QUARTER_DAY) {
        this.options.step = 24 / 4;
        this.options.column_width = 38;
      } else if (view_mode === VIEW_MODE.WEEK) {
        this.options.step = 24 * 7;
        this.options.column_width = 140;
      } else if (view_mode === VIEW_MODE.MONTH) {
        this.options.step = 24 * 30;
        this.options.column_width = 120;
      } else if (view_mode === VIEW_MODE.YEAR) {
        this.options.step = 24 * 365;
        this.options.column_width = 120;
      }
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
      this.gantt_start = this.gantt_end = null;

      var _iterator = _createForOfIteratorHelper(this.tasks),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var task = _step.value;

          // set global start and end date
          if (!this.gantt_start || task._start < this.gantt_start) {
            this.gantt_start = task._start;
          }

          if (!this.gantt_end || task._end > this.gantt_end) {
            this.gantt_end = task._end;
          }

          if (task.milestones) {
            var _iterator2 = _createForOfIteratorHelper(task.milestones),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var milestone = _step2.value;

                if (milestone.date < this.gantt_start) {
                  this.gantt_start = milestone.date;
                }

                if (milestone.date > this.gantt_end) {
                  this.gantt_end = milestone.date;
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

      this.gantt_start = date_utils.start_of(this.gantt_start, 'day');
      this.gantt_end = date_utils.start_of(this.gantt_end, 'day'); // add date padding on both sides

      if (this.view_is([VIEW_MODE.QUARTER_DAY, VIEW_MODE.HALF_DAY])) {
        this.gantt_start = date_utils.add(this.gantt_start, -7, 'day');
        this.gantt_end = date_utils.add(this.gantt_end, 7, 'day');
      } else if (this.view_is(VIEW_MODE.MONTH)) {
        this.gantt_start = date_utils.start_of(this.gantt_start, 'year');
        this.gantt_end = date_utils.add(this.gantt_end, 1, 'year');
      } else if (this.view_is(VIEW_MODE.YEAR)) {
        this.gantt_start = date_utils.add(this.gantt_start, -2, 'year');
        this.gantt_end = date_utils.add(this.gantt_end, 2, 'year');
      } else {
        this.gantt_start = date_utils.add(this.gantt_start, -1, 'month');
        this.gantt_end = date_utils.add(this.gantt_end, 1, 'month');
      }
    }
  }, {
    key: "setup_date_values",
    value: function setup_date_values() {
      this.dates = [];
      var cur_date = null;

      while (cur_date === null || cur_date < this.gantt_end) {
        if (!cur_date) {
          cur_date = date_utils.clone(this.gantt_start);
        } else {
          if (this.view_is(VIEW_MODE.YEAR)) {
            cur_date = date_utils.add(cur_date, 1, 'year');
          } else if (this.view_is(VIEW_MODE.MONTH)) {
            cur_date = date_utils.add(cur_date, 1, 'month');
          } else {
            cur_date = date_utils.add(cur_date, this.options.step, 'hour');
          }
        }

        this.dates.push(cur_date);
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
      this.make_grid();
      this.make_dates();
      this.make_bars();
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
        this.layers[layer] = createSVG('g', {
          "class": layer,
          append_to: this.$svg
        });
      }
    }
  }, {
    key: "make_grid",
    value: function make_grid() {
      this.make_grid_background();
      this.make_grid_rows();
      this.make_grid_header();
      this.make_grid_ticks();
      this.make_grid_highlights();
    }
  }, {
    key: "make_grid_background",
    value: function make_grid_background() {
      var grid_width = this.dates.length * this.options.column_width;
      var sum = 0;

      var _iterator3 = _createForOfIteratorHelper(this.tasks),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var task = _step3.value;
          sum += task.height || this.options.bar_height;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      sum += this.options.padding * this.tasks.length;
      var grid_height = this.options.header_height + this.options.padding + sum;
      createSVG('rect', {
        x: 0,
        y: 0,
        width: grid_width,
        height: grid_height,
        "class": 'grid-background',
        append_to: this.layers.grid
      });
      $.attr(this.$svg, {
        height: grid_height,
        width: '100%'
      });
    }
  }, {
    key: "make_grid_rows",
    value: function make_grid_rows() {
      var rows_layer = createSVG('g', {
        append_to: this.layers.grid
      });
      var lines_layer = createSVG('g', {
        append_to: this.layers.grid
      });
      var row_width = this.dates.length * this.options.column_width;
      var row_y = this.options.header_height + this.options.padding / 2;

      var _iterator4 = _createForOfIteratorHelper(this.tasks),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var task = _step4.value;
          console.log(task);
          var row_height = (task.height || this.options.bar_height) + this.options.padding;
          createSVG('rect', {
            x: 0,
            y: row_y,
            width: row_width,
            height: row_height,
            "class": 'grid-row',
            append_to: rows_layer
          });
          createSVG('line', {
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
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }, {
    key: "make_grid_header",
    value: function make_grid_header() {
      var header_width = this.dates.length * this.options.column_width;
      var header_height = this.options.header_height + 10;
      createSVG('rect', {
        x: 0,
        y: 0,
        width: header_width,
        height: header_height,
        "class": 'grid-header',
        append_to: this.layers.grid
      });
    }
  }, {
    key: "make_grid_ticks",
    value: function make_grid_ticks() {
      var tick_x = 0;
      var tick_y = this.options.header_height + this.options.padding / 2;
      var tick_height = this.options.padding * this.tasks.length;

      var _iterator5 = _createForOfIteratorHelper(this.tasks),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var task = _step5.value;
          tick_height += task.height || this.options.bar_height;
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      var _iterator6 = _createForOfIteratorHelper(this.dates),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var date = _step6.value;
          var tick_class = 'tick'; // thick tick for monday

          if (this.view_is(VIEW_MODE.DAY) && date.getDate() === 1) {
            tick_class += ' thick';
          } // thick tick for first week


          if (this.view_is(VIEW_MODE.WEEK) && date.getDate() >= 1 && date.getDate() < 8) {
            tick_class += ' thick';
          } // thick ticks for quarters


          if (this.view_is(VIEW_MODE.MONTH) && (date.getMonth() + 1) % 3 === 0) {
            tick_class += ' thick';
          }

          createSVG('path', {
            d: "M ".concat(tick_x, " ").concat(tick_y, " v ").concat(tick_height),
            "class": tick_class,
            append_to: this.layers.grid
          });

          if (this.view_is(VIEW_MODE.MONTH)) {
            tick_x += date_utils.get_days_in_month(date) * this.options.column_width / 30;
          } else {
            tick_x += this.options.column_width;
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
  }, {
    key: "make_grid_highlights",
    value: function make_grid_highlights() {
      // highlight today's date
      if (this.view_is(VIEW_MODE.DAY)) {
        var x = date_utils.diff(date_utils.today(), this.gantt_start, 'hour') / this.options.step * this.options.column_width;
        var y = 0;
        var width = this.options.column_width;
        var sum = 0;

        var _iterator7 = _createForOfIteratorHelper(this.tasks),
            _step7;

        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var task = _step7.value;
            sum += task.height || this.options.bar_height;
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }

        sum += this.options.padding * this.tasks.length;
        var grid_height = this.options.header_height + this.options.padding / 2 + sum;
        createSVG('rect', {
          x: x,
          y: y,
          width: width,
          height: grid_height,
          "class": 'today-highlight',
          append_to: this.layers.grid
        });
      }
    }
  }, {
    key: "make_dates",
    value: function make_dates() {
      var _iterator8 = _createForOfIteratorHelper(this.get_dates_to_draw()),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var date = _step8.value;
          createSVG('text', {
            x: date.lower_x,
            y: date.lower_y,
            innerHTML: date.lower_text,
            "class": 'lower-text',
            append_to: this.layers.date
          });

          if (date.upper_text) {
            var $upper_text = createSVG('text', {
              x: date.upper_x,
              y: date.upper_y,
              innerHTML: date.upper_text,
              "class": 'upper-text',
              append_to: this.layers.date
            }); // remove out-of-bound dates

            if ($upper_text.getBBox().x2 > this.layers.grid.getBBox().width) {
              $upper_text.remove();
            }
          }
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
    }
  }, {
    key: "get_dates_to_draw",
    value: function get_dates_to_draw() {
      var _this = this;

      var last_date = null;
      var dates = this.dates.map(function (date, i) {
        var d = _this.get_date_info(date, last_date, i);

        last_date = date;
        return d;
      });
      return dates;
    }
  }, {
    key: "get_date_info",
    value: function get_date_info(date, last_date, i) {
      if (!last_date) {
        last_date = date_utils.add(date, 1, 'year');
      }

      var date_text = {
        'Quarter Day_lower': date_utils.format(date, 'HH', this.options.language),
        'Half Day_lower': date_utils.format(date, 'HH', this.options.language),
        Day_lower: date.getDate() !== last_date.getDate() ? date_utils.format(date, 'D', this.options.language) : '',
        Week_lower: date.getMonth() !== last_date.getMonth() ? date_utils.format(date, 'D MMM', this.options.language) : date_utils.format(date, 'D', this.options.language),
        Month_lower: date_utils.format(date, 'MMMM', this.options.language),
        Year_lower: date_utils.format(date, 'YYYY', this.options.language),
        'Quarter Day_upper': date.getDate() !== last_date.getDate() ? date_utils.format(date, 'D MMM', this.options.language) : '',
        'Half Day_upper': date.getDate() !== last_date.getDate() ? date.getMonth() !== last_date.getMonth() ? date_utils.format(date, 'D MMM', this.options.language) : date_utils.format(date, 'D', this.options.language) : '',
        Day_upper: date.getMonth() !== last_date.getMonth() ? date_utils.format(date, 'MMMM', this.options.language) : '',
        Week_upper: date.getMonth() !== last_date.getMonth() ? date_utils.format(date, 'MMMM', this.options.language) : '',
        Month_upper: date.getFullYear() !== last_date.getFullYear() ? date_utils.format(date, 'YYYY', this.options.language) : '',
        Year_upper: date.getFullYear() !== last_date.getFullYear() ? date_utils.format(date, 'YYYY', this.options.language) : ''
      };
      var base_pos = {
        x: i * this.options.column_width,
        lower_y: this.options.header_height,
        upper_y: this.options.header_height - 25
      };
      var x_pos = {
        'Quarter Day_lower': this.options.column_width * 4 / 2,
        'Quarter Day_upper': 0,
        'Half Day_lower': this.options.column_width * 2 / 2,
        'Half Day_upper': 0,
        Day_lower: this.options.column_width / 2,
        Day_upper: this.options.column_width * 30 / 2,
        Week_lower: 0,
        Week_upper: this.options.column_width * 4 / 2,
        Month_lower: this.options.column_width / 2,
        Month_upper: this.options.column_width * 12 / 2,
        Year_lower: this.options.column_width / 2,
        Year_upper: this.options.column_width * 30 / 2
      };
      return {
        upper_text: date_text["".concat(this.options.view_mode, "_upper")],
        lower_text: date_text["".concat(this.options.view_mode, "_lower")],
        upper_x: base_pos.x + x_pos["".concat(this.options.view_mode, "_upper")],
        upper_y: base_pos.upper_y,
        lower_x: base_pos.x + x_pos["".concat(this.options.view_mode, "_lower")],
        lower_y: base_pos.lower_y
      };
    }
  }, {
    key: "make_bars",
    value: function make_bars() {
      var _this2 = this;

      this.bars = this.tasks.map(function (task) {
        var bar = new Bar(_this2, task);

        _this2.layers.bar.appendChild(bar.group);

        _this2.layers.bar.appendChild(bar.milestone_group);

        return bar;
      });
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
      var hours_before_first_task = date_utils.diff(this.get_oldest_starting_date(), this.gantt_start, 'hour');
      var scroll_pos = hours_before_first_task / this.options.step * this.options.column_width - this.options.column_width;
      parent_element.scrollLeft = scroll_pos;
    }
  }, {
    key: "bind_grid_click",
    value: function bind_grid_click() {
      var _this3 = this;

      $.on(this.$svg, this.options.popup_trigger, '.grid-row, .grid-header', function () {
        _this3.unselect_all();

        _this3.hide_popup();
      });
    }
  }, {
    key: "unselect_all",
    value: function unselect_all() {
      

      _toConsumableArray(this.$svg.querySelectorAll('.bar-wrapper')).forEach(function (el) {
        el.classList.remove('active');
      });
    }
  }, {
    key: "view_is",
    value: function view_is(modes) {
      var _this4 = this;

      if (typeof modes === 'string') {
        return this.options.view_mode === modes;
      }

      if (Array.isArray(modes)) {
        return modes.some(function (mode) {
          return _this4.options.view_mode === mode;
        });
      }

      return false;
    }
  }, {
    key: "get_task",
    value: function get_task(id) {
      return this.tasks.find(function (task) {
        return task.id === id;
      });
    }
  }, {
    key: "get_bar",
    value: function get_bar(id) {
      return this.bars.find(function (bar) {
        return bar.task.id === id;
      });
    }
  }, {
    key: "show_popup",
    value: function show_popup(options) {
      if (!this.popup) {
        this.popup = new Popup(this.popup_wrapper, this.options.custom_popup_html);
      }

      this.popup.show(options);
    }
  }, {
    key: "hide_popup",
    value: function hide_popup() {
      this.popup && this.popup.hide();
    }
  }, {
    key: "trigger_event",
    value: function trigger_event(event, args) {
      if (this.options['on_' + event]) {
        this.options['on_' + event].apply(null, args);
      }
    }
    /**
     * Gets the oldest starting date from the list of tasks
     *
     * @returns Date
     * @memberof Gantt
     */

  }, {
    key: "get_oldest_starting_date",
    value: function get_oldest_starting_date() {
      return this.tasks.map(function (task) {
        return task._start;
      }).reduce(function (prev_date, cur_date) {
        return cur_date <= prev_date ? cur_date : prev_date;
      });
    }
    /**
     * Clear all elements from the parent svg element
     *
     * @memberof Gantt
     */

  }, {
    key: "clear",
    value: function clear() {
      this.$svg.innerHTML = '';
    }
  }]);

  return Gantt;
}();

Gantt.VIEW_MODE = VIEW_MODE;

function generate_id(task) {
  return task.name + '_' + Math.random().toString(36).slice(2, 12);
}

return Gantt;

}());
