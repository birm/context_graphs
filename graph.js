/** A manager for contextual filter graphs
 * @constructor
 * @param {String} selector - the selector for the element in which to place the graph.
 * @param {Array} data - An ordered list of numbers for initial data.
 * @param {String} [format] - the format of the graph, default pie.
  */
class graph {
    constructor(selector, data, format="pie") {
        this.selector = selector;
        this.data = data;
        this.initial_data = data;
        this.format = format.toLowerCase();
        this.color = "";
        this.filtercolor="";
    }

    /** Apply new data after a filter.
     * @param {Array} data - the new data, ordered like the original data
     */
    filter(data) {
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

    /** Draw a pie chart
     */
    pie() {
      var i;
      // get center
      // radius
      // for each:
      //   draw the pie piece
    }

    /** Draw a bubble chart
     */
    bubble() {
      // get origin
      // draw axes
      for (point in this.data){
        "circle"
        a.setAttribute("cx", this.data[point][x]);
        a.setAttribute("cy", this.data[point][y]);
        a.setAttribute("r", this.data[point][r]);
      }
    }

    /** Draw a scatter plot
     */
    scatter() {
      // get origin
      // get dot size
      // draw axes
      for (point in this.data){
        "circle"
        a.setAttribute("cx", this.data[point][x]);
        a.setAttribute("cy", this.data[point][y]);
        a.setAttribute("r", r);
      }
    }

    /** Draw a histogram
     */
    hist() {
      var i;
      // get origin
      // draw axes
      // for each:
      //   get offset
      //   get height
      //   draw a box
      for (var point=0; point < this.data.length; point++){
        "rect"
        a.setAttribute("x", x)
        a.setAttribute("y", y)
        a.setAttribute("width", w)
        a.setAttribute("height", this.data[point]);
      }
    }

    /** Draw a bar chart
     */
    bar() {
      var i;
      // get origin
      // draw axes
      // for each:
      //   get offset
      //   get width
      //   draw a box
      for (point in this.data){
        "rect"
        a.setAttribute("x", x)
        a.setAttribute("y", y)
        a.setAttribute("width", this.data[point])
        a.setAttribute("height", h);
      }
    }

    /** Draw filter context for pie chart
     */
    pie_filter() {
      var i;
      // get center
      // for each:
      //   get radius
      //   draw the piece on top
    }

    /** Draw filter context for bubble chart
     */
    bubble_filter() {
      var i;
      // get origin
      // draw axes
      for (point in this.data){
        "circle"
        a.setAttribute("cx", this.data[point][x]);
        a.setAttribute("cy", this.data[point][y]);
        a.setAttribute("r", this.data[point][r]);
      }
    }

    /** Draw filter context for scatter plot
     */
    scatter_filter() {
      // get origin
      // draw axes
      // get dot size
      for (point in this.data){
        "circle"
        a.setAttribute("cx", this.data[point][x]);
        a.setAttribute("cy", this.data[point][y]);
        a.setAttribute("r", r);
      }
    }

    /** Draw filter context for histogram
     */
    hist_filter() {
      // get origin
      // draw axes
      for (var point=0; point < this.data.length; point++){
        "rect"
        a.setAttribute("x", x)
        a.setAttribute("y", y)
        a.setAttribute("width", w)
        a.setAttribute("height", this.data[point]);
      }
    }

    /* Draw filter context for bar chart
     */
    bar_filter() {
      var i;
      // get origin
      // draw axes
      for (point in this.data){
        "rect"
        a.setAttribute("x", x)
        a.setAttribute("y", y)
        a.setAttribute("width", this.data[point])
        a.setAttribute("height", h);
      }
    }

}

module.exports = graph;
