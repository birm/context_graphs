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
      this.svg.getElementsByClassName("filtering").map(e => this.svg.removeChild(e));
    }

    /** Draw a pie chart
     */
    pie(){
        // get center
        var prct = 0;
        for (var point=0; point < this.data.length; point++){
          let a = document.createElement("path");
          let x = Math.cos(2*Math.PI*this.data[point]);
          let y = Math.sin(2*Math.PI*this.data[point]);
          let xt = Math.cos(2*Math.PI*prct);
          let yt = Math.sin(2*Math.PI*prct);
          prct = this.data[point] + prct;
          let len = Math.min(this.item.getAttribute("width"),this.item.getAttribute("height"));
          a.setAttribute("d", `M ${xt} ${yt} A ${len} ${len} 0 0 ${len} ${x} ${y} L 0 0`)
          a.classList.add('filtering');
          a.classList.add('pie_'+point);
          this.svg.appendChild(a);
        }
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
        a.classList.add('bubble_'+point);
        this.svg.appendChild(a);
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
        a.classList.add('scatter_'+point);
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
        a.classList.add('hist_'+point);
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
        a.classList.add('bar_'+point);
        this.svg.appendChild(a);
      }
    }

    /** Draw filter context for pie chart
     */
    pie_filter() {
      // get center
      //TODO change to curve
      var prct = 0;
      for (var point=0; point < this.data.length; point++){
        let a = document.createElement("path");
        let x = Math.cos(2*Math.PI*this.initial_data[point])*this.data[point];
        let y = Math.sin(2*Math.PI*this.initial_data[point])*this.data[point];
        let xt = Math.cos(2*Math.PI*prct)*this.data[point];
        let yt = Math.sin(2*Math.PI*prct)*this.data[point];
        prct = this.data[point] + prct;
        let len = Math.min(this.item.getAttribute("width"),this.item.getAttribute("height"));
        a.setAttribute("d", `M ${xt} ${yt} A ${len} ${len} 0 0 ${len} ${x} ${y} L 0 0`)
        a.classList.add('filtering');
        a.classList.add('filtering');
        a.classList.add('pie_f_'+point);
        this.svg.appendChild(a);
      }
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
        a.classList.add('filtering');
        a.classList.add('bubble_f_'+point);
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
        a.classList.add('filtering');
        a.classList.add('scatter_f_'+point);
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
        a.classList.add('filtering');
        a.classList.add('hist_f_'+point);
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
        a.classList.add('filtering');
        a.classList.add('bar_f_'+point);
        this.svg.appendChild(a);
      }
    }

}

module.exports = graph;
