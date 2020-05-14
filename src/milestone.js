import date_utils from './date_utils';
import { $, createSVG, animateSVG } from './svg_utils';

export default class Milestone {
    constructor(gantt, task, bar, opts) {
        this.set_defaults(gantt, task, bar, opts);
        this.prepare();
        this.bind();
    }

    set_defaults(gantt, task, bar, opts) {
        this.action_completed = false;
        this.gantt = gantt;
        this.bar = bar;
        this.task = task;
        this.href = opts.href;
        this.date = opts.date;
    }

    prepare() {
        this.prepare_values();
        this.prepare_helpers();
    }

    prepare_values() {
        this.invalid = this.task.invalid;
        this.height = this.gantt.options.bar_height;
        this.x = this.compute_x();
        this.y = this.compute_y();
        this.href = this.href;
        this.width = 16;
        this.group = this.bar.milestone_group;
    }

    prepare_helpers() {
        SVGElement.prototype.getX = function() {
            return +this.getAttribute('x');
        };
        SVGElement.prototype.getY = function() {
            return +this.getAttribute('y');
        };
        SVGElement.prototype.getWidth = function() {
            return +this.getAttribute('width');
        };
        SVGElement.prototype.getHeight = function() {
            return +this.getAttribute('height');
        };
        SVGElement.prototype.getEndX = function() {
            return this.getX() + this.getWidth();
        };
    }

    draw() {
        this.draw_image();
    }

    draw_image() {
        this.$image = createSVG('image', {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.width,
            href: this.href,
            append_to: this.group
        });
    }

    bind() {
        if (this.invalid) return;
    }

    compute_x() {
        const { step, column_width } = this.gantt.options;
        const task_start = this.date;
        const gantt_start = this.gantt.gantt_start;

        const diff = date_utils.diff(task_start, gantt_start, 'hour');
        let x = diff / step * column_width;

        if (this.gantt.view_is('Month')) {
            const diff = date_utils.diff(task_start, gantt_start, 'day');
            x = diff * column_width / 30;
        }
        return x;
    }

    compute_y() {
        return (
            this.gantt.options.header_height +
            this.gantt.options.padding +
            this.task._index * (this.height + this.gantt.options.padding)
        );
    }
}

function isFunction(functionToCheck) {
    var getType = {};
    return (
        functionToCheck &&
        getType.toString.call(functionToCheck) === '[object Function]'
    );
}