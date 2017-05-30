/** Data loading and normalization features fot context graphs.
 * @constructor
 * @param {object} data - the data to work on.
 * @param {Array} [source] - the variable name(s) to convert to x, y, and r respectively. Defaults to x->x.
 * @param {Boolean} [pie] - If a pie chart is intended; .max returns the sum instead of the larest element if true.
  */
class loader{
  constructor(data, source=["x"], pie=false){
    this.data = data;
    this.source = source;
    this.max = false;
  }
  load(){
    var dest = ["x", "y", "r"];
    var new_data = { };
    var max = Array.apply(null, Array(this.from.length)).map(Number.prototype.valueOf,0);
    for (var d in this.data){
      var thisrecord = {};
      for (var i = 0; i<Math.min(this.from.length, 3); i++ ){
        var n = data[d][this.from[i]];
        if (this.pie){
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
  max(){
    if (!this.max){
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
 */
class graph {
    constructor(selector, data, max, format="pie") {
        this.selector = selector;
        this.data = data;
        this.max = max;
        this.initial_data = data;
        this.format = format.toLowerCase();
        this.color = ["#FFFFFF"];
        this.filtercolor= ["#555555"];
        this.item = document.getElementById(selector);
        this.canvas = document.createElement("canvas");
        this.canvas.getContext("2d");
        this.canvas.style.width ='100%';
        this.canvas.style.height='100%';
        this.canvas.width  = canvas.offsetWidth;
        this.canvas.height = canvas.offsetHeight;
        this.scale = Math.min(this.canvas.width, this.canvas.height);
        this.item.appendChild(this.canvas);
    }

    /** Apply new data after a filter.
     * @param {Array} data - the new data, ordered like the original data
     */
    filter(data) {
        this.clear_filters();
        this.data = data;
        if (this.format === "bar"){
          this.bar_filter();
        }
        if (this.format === "histogram"){
          this.hist_filter();
        }
        if (this.format === "scatter"){
          this.scatter_filter();
        }
        if (this.format === "bubble"){
          this.bubble_filter();
        }
        else{ // pie or invalid
          this.pie_filter();
        }
    }

    /** Draw a graph of the specified type.
     */
    draw() {
      if (this.format === "bar"){
        this.bar();
      }
      if (this.format === "histogram"){
        this.hist();
      }
      if (this.format === "scatter"){
        this.scatter();
      }
      if (this.format === "bubble"){
        this.bubble();
      }
      else{ // pie or invalid
        this.pie();
      }
    }

    clear_filters(){
      this.canvas.getElementsByClassName("filtering").map(e => this.canvas.removeChild(e));
      // TODO -- figure out how to do this now with canvas
      // maybe by z-ind?
    }

    /** Draw a pie chart
     */
    pie() {
        var prct = 0;
        //TODO need sum of all
        for (var point in this.data){
          var x = Math.cos(2*Math.PI*(prct+(this.data[point]['x']/this.max[0])));
          var y = Math.sin(2*Math.PI*(prct+(this.data[point]['x']/this.max[0])));
          var xt = Math.cos(2*Math.PI*prct);
          var yt = Math.sin(2*Math.PI*prct);
          prct = (this.data[point]['x']/this.max[0]) + prct;
          //set color and start
          this.canvas.fillStyle = this.color[point % this.color.length];
          this.canvas.beginPath();
          // go to center (half half)
          this.canvas.moveTo(this.canvas.width / 2, this.canvas.height / 2);
          // draw a line to x y
          this.canvas.lineTo(x * this.scale, y * this.scale);
          // draw an arc to xt yt
          this.canvas.arcTo(xt * this.scale, yt * this.scale);
          // draw back to center
          this.canvas.moveTo(this.canvas.width / 2, this.canvas.height / 2);
          // fill this shape
          this.canvas.fill();
        }
      }

    /** Draw a bubble chart
     */
    bubble() {
      // draw axes
      for (var point in this.data){
        var a = document.createElement("circle");

        //set color and start
        this.canvas.fillStyle = this.color[point % this.color.length];
        this.canvas.beginPath();
        // draw a circle at x y with radius r
      }
    }

    /** Draw a scatter plot
     */
    scatter() {
      // get dot size
      // draw axes
      for (var point in this.data){
        //set color and start
        this.canvas.fillStyle = this.color[point % this.color.length];
        this.canvas.beginPath();
        // draw a circle at x y
      }
    }

    /** Draw a histogram
     */
    hist() {
      var i;
      // draw axes
      var offset = this.item.getAttribute("width")/(this.data.length);
      for (var point=0; point < this.data.length; point++){
        //set color and start
        this.canvas.fillStyle = this.color[point % this.color.length];
        this.canvas.beginPath();
        // draw a box offset by previous, x height
      }
    }

    /** Draw a bar chart
     */
    bar() {
      var i;
      // get origin
      var offset = this.item.getAttribute("height")/(this.data.length);
      for (var point=0; point < this.data.length; point++){
        //set color and start
        this.canvas.fillStyle = this.color[point % this.color.length];
        this.canvas.beginPath();
        // draw a box offset by previous, x width
      }
    }

    /** Draw filter context for pie chart
     */
    pie_filter() {
      // get center
      //TODO change to curve
      var prct = 0;
      for (var point in this.data){
        var a = document.createElement("path");
        var x = Math.cos(2*Math.PI*(prct+(this.initial_data[point]['x']/this.max[0])))*(this.data[point]['x']/this.max[0]);
        var y = Math.sin(2*Math.PI*(prct+(this.initial_data[point]['x']/this.max[0])))*(this.data[point]['x']/this.max[0]);
        var xt = Math.cos(2*Math.PI*prct)*(this.data[point]['x']/this.max[0]);
        var yt = Math.sin(2*Math.PI*prct)*(this.data[point]['x']/this.max[0]);
        prct = (this.data[point]['x']/this.max[0]) + prct;
        this.canvas.fillStyle = this.filtercolor[point % this.color.length];
        // go to center (half half)
        this.canvas.moveTo(this.canvas.width / 2, this.canvas.height / 2);
        // draw a line to x y
        this.canvas.lineTo(x * this.scale, y * this.scale);
        // draw an arc to xt yt
        this.canvas.arcTo(xt * this.scale, yt * this.scale);
        // draw back to center
        this.canvas.moveTo(this.canvas.width / 2, this.canvas.height / 2);
        // fill this shape
        this.canvas.fill();
      }
    }

    /** Draw filter context for bubble chart
     */
    bubble_filter() {
      // draw axes
      for (var point in this.data){
        //set color and start
        this.canvas.fillStyle = this.color[point % this.color.length];
        this.canvas.beginPath();
        // draw a circle at x y and r on top
      }
    }

    /** Draw filter context for scatter plot
     */
    scatter_filter() {
      // draw axes
      for (var point in this.data){
        //set color and start
        this.canvas.fillStyle = this.color[point % this.color.length];
        this.canvas.beginPath();
        // on top
        // draw a circle at x y
        // fill with semi-transparent.
      }
    }

    /** Draw filter context for histogram
     */
    hist_filter() {
      // draw axes
      var offset = this.item.getAttribute("width")/(this.data.length);
      for (var point=0; point < this.data.length; point++){
        //set color and start
        this.canvas.fillStyle = this.color[point % this.color.length];
        this.canvas.beginPath();
      }
    }

    /* Draw filter context for bar chart
     */
    bar_filter() {
      // draw axes
      var offset = this.item.getAttribute("height")/(this.data.length);
      for (var point=0; point < this.data.length; point++){
        //set color and start
        this.canvas.fillStyle = this.color[point % this.color.length];
        this.canvas.beginPath();
      }
    }

}

module.exports = { graph, loader};
