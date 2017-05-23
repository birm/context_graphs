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
        this.item = document.getElementById(selector);
        this.svg = document.createElement("svg");
        this.item.appendChild(this.svg);
        // TODO normalize data
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
      //TODO draw the filters with zero, so they're ready
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
      // draw axes
      for (point in this.data){
        let a = document.createElement("circle");
        a.setAttribute("cx", this.data[point][x]*this.item.getAttribute("width"));
        a.setAttribute("cy", this.data[point][y]*this.item.getAttribute("height"));
        a.setAttribute("r", this.data[point][r]);
      }
    }

    /** Draw a scatter plot
     */
    scatter() {
      // get dot size
      // draw axes
      for (point in this.data){
        let a = document.createElement("circle");
        a.setAttribute("cx", this.data[point][x]*this.item.getAttribute("width"));
        a.setAttribute("cy", this.data[point][y]*this.item.getAttribute("height"));
        a.setAttribute("r", r);
        this.svg.appendChild(a);
      }
    }

    /** Draw a histogram
     */
    hist() {
      var i;
      // draw axes
      var offset = this.item.getAttribute("width")/(this.data.length);
      for (var point=0; point < this.data.length; point++){
        let a = document.createElement("rect");
        a.setAttribute("x", offset*point);
        a.setAttribute("y", 0);
        a.setAttribute("width", offset);
        a.setAttribute("height", this.data[point]*this.item.getAttribute("height"));
        this.svg.appendChild(a);
      }
    }

    /** Draw a bar chart
     */
    bar() {
      var i;
      // get origin
      var offset = this.item.getAttribute("height")/(this.data.length);
      for (var point=0; point < this.data.length; point++){
        let a = document.createElement("rect");
        a.setAttribute("x", 0)
        a.setAttribute("y", offset*point)
        a.setAttribute("width", this.data[point]*this.item.getAttribute("width"))
        a.setAttribute("height", offset);
        this.svg.appendChild(a);
      }
    }

    /** Draw filter context for pie chart
     */
    pie_filter() {
      // get center
      // for each:
      //   get radius
      //   draw the piece on top
    }

    /** Draw filter context for bubble chart
     */
    bubble_filter() {
      // draw axes
      for (point in this.data){
        let a = document.createElement("circle");
        a.setAttribute("cx", this.data[point][x]*this.item.getAttribute("width"));
        a.setAttribute("cy", this.data[point][y]*this.item.getAttribute("height"));
        a.setAttribute("r", this.data[point][r]);
        this.svg.appendChild(a);
      }
    }

    /** Draw filter context for scatter plot
     */
    scatter_filter() {
      // draw axes
      for (point in this.data){
        let a = document.createElement("circle");
        a.setAttribute("cx", this.data[point][x]*this.item.getAttribute("width"));
        a.setAttribute("cy", this.data[point][y]*this.item.getAttribute("height"));
        // TODO pick dot dize
        a.setAttribute("r", r);
        this.svg.appendChild(a);
      }
    }

    /** Draw filter context for histogram
     */
    hist_filter() {
      // draw axes
      var offset = this.item.getAttribute("width")/(this.data.length);
      for (var point=0; point < this.data.length; point++){
        let a = document.createElement("rect");
        a.setAttribute("x", (offset/3)+(offset*point));
        a.setAttribute("y", 0)
        a.setAttribute("width", offset/3)
        a.setAttribute("height", this.data[point]*this.item.getAttribute("height"));
        this.svg.appendChild(a);
      }
    }

    /* Draw filter context for bar chart
     */
    bar_filter() {
      // draw axes
      var offset = this.item.getAttribute("height")/(this.data.length);
      for (var point=0; point < this.data.length; point++){
        let a = document.createElement("rect");
        a.setAttribute("x", 0)
        a.setAttribute("y", (offset/3)+(offset*point))
        a.setAttribute("width", this.data[point]*this.item.getAttribute("width"))
        a.setAttribute("height", offset/3);
        this.svg.appendChild(a);
      }
    }

}

module.exports = graph;
