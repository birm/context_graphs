/** Data loading and normalization features fot context graphs.
 * @constructor
 * @param {object} data - the data to work on.
 * @param {Array} [source] - the variable name(s) to convert to x, y, and r respectively. Defaults to x->x.
 * @param {Boolean} [pie] - If a pie chart is intended; .max returns the sum instead of the larest element if true.
 */
class loader {
  constructor(data, source = ["x"], pie = false) {
    this.data = data;
    this.source = source;
    this.max = false;
  }
  load() {
    var dest = ["x", "y", "r"];
    var new_data = {};
    var max = Array.apply(null, Array(this.from.length)).map(Number.prototype
      .valueOf, 0);
    for (var d in this.data) {
      var thisrecord = {};
      for (var i = 0; i < Math.min(this.from.length, 3); i++) {
        var n = data[d][this.from[i]];
        if (this.pie) {
          tracking[i] = tracking[i] + n;
        } else {
          tracking[i] = Math.max(tracking[i], n);
        }
        thisrecord[this.from[i]] = n;
      }
      new_data[d] = thisrecord;
    }
    this.max = max;
    return new_data;
  }
  max() {
    if (!this.max) {
      this.load();
    }
    return this.max;
  }
}

/** A manager for contextual filter graphs
 * @constructor
 * @param {String} selector - the selector for the element in which to place the graph.
 * @param {Object} data - Initial Data
 * @param {Object} max - An array of the max of each variable in data.
 * @param {String} [format] - the format of the graph, default pie.
 * @param {Int}  [Size] - The size or dimensions for the canvas.
 */
class graph {
  constructor(selector, data, max, format = "pie", size = 400) {
    // deal with one element or array for size
    if (Number.isInteger(size)) {
      size = [size, size];
    }
    if (size.length < 2) {
      new Error("Size should be an integer or 2 elment array.")
    }
    this.size = size;
    this.selector = selector;
    this.data = data;
    this.max = max;
    this.initial_data = data;
    this.format = format.toLowerCase();
    this.color = ["#D90000", "#D96200", "#00AD00", "#008282"];
    this.filtercolor = ["#FF7070", "#FFB170", "#70FF70", "#70FFFF"];
    this.item = document.getElementById(selector);
    this.frame = document.createElement("canvas");
    this.canvas = this.frame.getContext("2d");
    this.frame.width = this.size[0];
    this.frame.height = this.size[1];
    this.scale = Math.min(this.size[0], this.size[1]) / 2;
    this.item.appendChild(this.frame);
    this.labels = {};
    this.filtered = false;
    // TODO add addEventListener('click', function(event) {});
  }

  /** Apply new data after a filter.
   * @param {Array} data - the new data, ordered like the original data
   */
  filter(data) {
    this.data = data;
    if (this.format === "bar") {
      this.bar_filter();
    } else if (this.format === "histogram") {
      this.hist_filter();
    } else if (this.format === "scatter") {
      this.scatter_filter();
    } else if (this.format === "bubble") {
      this.bubble_filter();
    } else { // pie or invalid
      this.pie_filter();
    }
    this.filtered = true;
    return this.canvas;
  }

  /** Draw a graph of the specified type.
   */
  draw() {
    this.canvas.clearRect(0, 0, this.frame.width, this.frame.height);
    if (this.format === "bar") {
      this.bar();
    } else if (this.format === "histogram") {
      this.hist();
    } else if (this.format === "scatter") {
      this.scatter();
    } else if (this.format === "bubble") {
      this.bubble();
    } else { // pie or invalid
      this.pie();
    }
    this.filtered = false;
    return this.canvas;
  }

  /** Create and register a data label.
   * @param {String} text - the label text
   * @param {Int} x - the label canvas x position
   * @param {Int} y - the label canvas y position
   * @param {Boolean} [draw] - if to draw, if false, it just registers
   * @param {Int} [size] - the label font size in px, default 12
   */
  label(text, x, y, draw = true, size = 12) {
    if (draw) {
      this.canvas.font = parseInt(size, 10) + "px Georgia";
      this.canvas.fillStyle = "#000000"
      this.canvas.fillText(text, x, y);
    }
    // register this point
    this.labels[text] = [x, y];
  }

  /** Apply new data after a filter.
   * @param {Int} x - the x position of the click
   * @param {Int} y - the y position of the click
   */
  closest_label(x, y) {
    this.labels;
    var dist = Infinity;
    var closest;
    var pos;
    for (var label in this.labels) {
      pos = Math.sqrt((this.labels[label][0]) ^ 2 + (this.labels[label][1]) ^
        2);
      if (pos < dist) {
        closest = label;
      }
      return closest;
    }
  }

  /** Draw a pie chart
   */
  pie() {
    // labels
    var prct = 0;
    var i = 0;
    for (var point in this.data) {
      this.canvas.beginPath();
      // go to center (half half)
      this.canvas.moveTo(this.size[0] / 2, this.size[1] / 2);
      // draw an arc from x y to xt yt
      this.canvas.arc(this.size[0] / 2, this.size[1] / 2, this.scale, 2 *
        Math.PI * prct,
        2 * Math.PI * (prct + (this.data[point]['x'] / this.max[0])));
      // draw back to center
      this.canvas.lineTo(this.size[0] / 2, this.size[1] / 2);
      this.canvas.closePath();
      // fill this shape
      this.canvas.fillStyle = this.color[i % this.color.length];
      this.canvas.fill();
      this.label(point,
        (this.size[0] / 2) * (1 + 0.8 * Math.cos(2 * Math.PI * (prct + (this.initial_data[
          point]['x'] / (2 * this.max[0]))))),
        (this.size[0] / 2) * (1 + 0.8 * Math.sin(2 * Math.PI * (prct + (this.initial_data[
          point]['x'] / (2 * this.max[0]))))));
      prct = (this.data[point]['x'] / this.max[0]) + prct;
      i++;
    }
  }

  /** Draw a bubble chart
   */
  bubble() {
    // draw axes
    // TODO Draw clickable lables
    var i = 0;
    for (var point in this.data) {
      this.canvas.beginPath();
      // draw a circle at x y with radius r
      this.canvas.arc(this.size[0] * (this.data[point]['x'] / this.max[0]),
        this.size[1] *
        (this.data[point]['y'] / this.max[1]), (this.data[point]['r'] /
          this.max[2]) * this.scale, 0, 2 *
        Math.PI);
      this.canvas.closePath();
      // fill this shape
      this.canvas.fillStyle = this.color[i % this.color.length];
      this.canvas.fill();
      this.label(point, this.size[0] * (this.data[point]['x'] / this.max[0]),
        this.size[1] *
        (this.data[point]['y'] / this.max[1]));
      i++;
    }
  }

  /** Draw a scatter plot
   */
  scatter() {
    // TODO Draw clickable lables
    // draw axes
    var i = 0;
    for (var point in this.data) {
      this.canvas.beginPath();
      // draw a circle at x y
      this.canvas.arc(this.size[0] * (this.data[point]['x'] / this.max[0]),
        this.size[1] *
        (this.data[point]['y'] / this.max[1]), 2, 0, 2 * Math.PI)
      this.canvas.closePath();
      // fill this shape
      this.canvas.fillStyle = this.color[i % this.color.length];
      console.log(
        `${point}[${this.data[point]['x']},${this.data[point]['y']}] colored ${this.color[i % this.color.length]}`
      )
      this.canvas.fill();
      i++;
    }
  }

  /** Draw a histogram
   */
  hist() {
    // TODO Draw clickable lables
    var i = 0;
    // draw axes
    var offset = this.size[0] / (Object.keys(this.data).length);
    for (var point in this.data) {
      this.canvas.beginPath();
      // draw a box offset by previous, data set height
      this.canvas.moveTo(offset * i, this.size[1]);
      this.canvas.lineTo(offset * i, this.size[1] - this.scale * (this.data[
        point]['x'] / this.max[0]));
      this.canvas.lineTo(offset * (i + 1), this.size[1] - this.scale * (this.data[
        point]['x'] / this.max[0]));
      this.canvas.lineTo(offset * (i + 1), this.size[1]);
      this.canvas.closePath();
      // fill this shape
      this.canvas.fillStyle = this.color[i % this.color.length];
      // log information
      console.log(
        `${point}[${this.data[point]['x']}] colored ${this.color[i % this.color.length]}`
      )
      this.canvas.fill();
      this.label(point, offset * (i + 0.5), this.size[1], 0.8 * this.size[1] -
        this.scale * (this.data[
          point]['x'] / this.max[0]));
      i++;
    }
  }

  /** Draw a bar chart
   */
  bar() {
    // TODO Draw clickable lables
    var i = 0;
    // get origin
    var offset = this.size[1] / (Object.keys(this.data).length);
    for (var point in this.data) {
      this.canvas.beginPath();
      // draw a box offset by previous, data set width
      this.canvas.moveTo(0, offset * i);
      this.canvas.lineTo(this.scale * (this.data[point]['x'] / this.max[0]),
        offset * i);
      this.canvas.lineTo(this.scale * (this.data[point]['x'] / this.max[0]),
        offset * (i +
          1));
      this.canvas.lineTo(0, offset * (i + 1));
      this.canvas.closePath();
      // TODO remove, but log line info
      console.log(this.scale * (this.data[point]['x'] / this.max[0]))
      console.log(offset)
      // fill this shape
      this.canvas.fillStyle = this.color[i % this.color.length];
      // log information
      console.log(
        `${point}[${this.data[point]['x']}] colored ${this.color[i % this.color.length]}`
      )
      this.canvas.fill();
      this.label(point, this.scale * (this.data[point]['x'] / this.max[0]),
        offset * (i + 0.5));
      i++;
    }
  }

  /** Draw filter context for pie chart
   */
  pie_filter() {
    // TODO Draw clickable lables
    var i = 0;
    // get center
    //TODO change to curve
    var prct = 0;
    for (var point in this.data) {
      this.canvas.beginPath();
      // go to center (half half)
      this.canvas.moveTo(this.size[0] / 2, this.size[1] / 2);
      // draw an arc from x y to xt yt
      this.canvas.arc(this.size[0] / 2, this.size[1] / 2, this.scale * (this.data[
          point]['x'] / this.initial_data[
          point]['x']), 2 *
        Math.PI * prct,
        2 * Math.PI * (prct + (this.initial_data[point]['x'] / this.max[0]))
      );
      // draw back to center
      this.canvas.lineTo(this.size[0] / 2, this.size[1] / 2);
      this.canvas.closePath();
      // fill this shape
      this.canvas.fillStyle = this.filtercolor[i % this.color.length];
      this.canvas.fill();
      this.label(point,
        (this.size[0] / 2) * (1 + 0.8 * Math.cos(2 * Math.PI * (prct + (this.initial_data[
          point]['x'] / (2 * this.max[0]))))),
        (this.size[0] / 2) * (1 + 0.8 * Math.sin(2 * Math.PI * (prct + (this.initial_data[
          point]['x'] / (2 * this.max[0]))))));
      i++;
      prct = (this.initial_data[point]['x'] / this.max[0]) + prct;
    }
  }

  /** Draw filter context for bubble chart
   */
  bubble_filter() {
    // TODO Draw clickable lables
    // draw axes
    var i = 0;
    for (var point in this.data) {
      this.canvas.beginPath();
      // draw a circle at x y and r on top
      this.canvas.arc(this.size[0] * (this.data[point]['x'] / this.max[0]),
        this.size[1] *
        (this.data[point]['y'] / this.max[1]), (this.data[point]['r'] /
          this.max[2]) * this.scale, 0, 2 *
        Math.PI);
      this.canvas.closePath();
      this.canvas.fillStyle = this.filtercolor[i % this.color.length];
      this.canvas.fill();
      this.label(point, this.size[0] * (this.data[point]['x'] / this.max[0]),
        this.size[1] *
        (this.data[point]['y'] / this.max[1]));
      i++;
    }
  }

  /** Draw filter context for scatter plot
   */
  scatter_filter() {
    // TODO Draw clickable lables
    var i = 0;
    // draw axes
    for (var point in this.data) {
      this.canvas.beginPath();
      // on top
      this.canvas.arc(this.size[0] * (this.data[point]['x'] / this.max[0]),
        this.size[1] *
        (this.data[point]['y'] / this.max[1]), 2, 0, 2 * Math.PI)
      this.canvas.closePath();
      this.canvas.fillStyle = this.filtercolor[i % this.color.length];
      this.canvas.fill();
      i++;
    }
  }

  /** Draw filter context for histogram
   */
  hist_filter() {
    // TODO Draw clickable lables
    // draw axes
    var i = 0;
    var offset = this.size[0] / (Object.keys(this.data).length);
    for (var point in this.data) {
      this.canvas.beginPath();
      this.canvas.moveTo(offset * (i + 1 / 3), this.size[1]);
      this.canvas.lineTo(offset * (i + 1 / 3), this.size[1] - this.scale * (
        this.data[
          point]['x'] / this.max[0]));
      this.canvas.lineTo(offset * (i + 2 / 3), this.size[1] - this.scale * (
        this.data[
          point]['x'] / this.max[0]));
      this.canvas.lineTo(offset * (i + 2 / 3), this.size[1]);
      this.canvas.closePath();
      this.canvas.fillStyle = this.filtercolor[i % this.color.length];
      this.canvas.fill();
      this.label(point, offset * (i + 0.5), this.size[1], 0.8 * this.size[1] -
        this.scale * (this.initial_data[
          point]['x'] / this.max[0]));
      i++;
    }
  }

  /* Draw filter context for bar chart
   */
  bar_filter() {
    // draw axes
    var i = 0;
    var offset = this.size[1] / (Object.keys(this.data).length);
    for (var point in this.data) {
      this.canvas.beginPath();
      // draw a box offset by previous, data set width
      this.canvas.moveTo(0, offset * (i + 1 / 3));
      this.canvas.lineTo(this.scale * (this.data[point]['x'] / this.max[0]),
        offset * (i + 1 / 3));
      this.canvas.lineTo(this.scale * (this.data[point]['x'] / this.max[0]),
        offset * (i +
          2 / 3));
      this.canvas.lineTo(0, offset * (i + 2 / 3));
      this.canvas.closePath();
      this.canvas.fillStyle = this.filtercolor[i % this.color.length];
      this.canvas.fill();
      this.label(point, this.scale * (this.initial_data[point]['x'] / this.max[
        0]), offset * (i + 0.5));
      i++;
    }
  }

}

module.exports = {
  graph,
  loader
};
