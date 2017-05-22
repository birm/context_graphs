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
        this.initial_data= data;
        this.format = format.toLowerCase();
    }


    /** Apply new data after a filter.
     * @param {Int} category - the index of the color to get
     */
     static color_pick(index){
       return "RGB(10,50,28)";
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
      var i;
      // get origin
      // draw axes
      // for each:
      //   get x
      //   get y
      //   get radius
      //   make circle
    }

    /** Draw a scatter plot
     */
    scatter() {
      var i;
      // get origin
      // draw axes
      // get dot size
      // for each:
      //   get x
      //   get y
      //   draw the scatter dot
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
      // for each:
      //   get x
      //   get y
      //   get radius
      //   make circle on top
    }

    /** Draw filter context for scatter plot
     */
    scatter_filter() {
      var i;
      // get origin
      // draw axes
      // get dot size
      // for each:
      //   get x
      //   get y
      //   draw the scatter dot
    }

    /** Draw filter context for histogram
     */
    hist_filter() {
      var i;
      // get origin
      // draw axes
      // for each:
      //   get offset
      //   get height
      //   draw a box
    }

    /* Draw filter context for bar chart
     */
    bar_filter() {
      var i;
      // get origin
      // draw axes
      // for each:
      //   get offset
      //   get width
      //   draw a box
    }

}

module.exports = graph;
