function plot_stats (datafile,whichbutton) {

document.getElementById('statsplot01').innerHTML = ""

// set the dimensions and margins of the graph
var margin = {top: 50, right: 30, bottom: 70, left: 60},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#statsplot01")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv(datafile, function(data) {

  // List of groups = header of the csv files
  var keys = data.columns.slice(1)

  var firstdate = d3.timeParse("%Y-%m-%d")(data[0].date)
  var lastdate = d3.timeParse("%Y-%m-%d")(data.slice(-1)[0].date)
  // Add X axis
  var x = d3.scaleTime()
    //.domain(d3.extent(data, function(d) { return d.date; }))
    .domain([firstdate,lastdate])
    //.domain([new Date(2019,11,30),new Date(2021,3,31)])
    .range([ 0, width ]);    

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(14).tickSizeOuter(0).tickFormat(d3.timeFormat("%Y-%m")))
    .selectAll("text")  
            .style("text-anchor", "end")
            .style("font-weight", "bold")
            .style("font-size", 12)
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr('transform', 'translate(25,0)rotate(-65)')
            // .attr("transform", "rotate(-65)")
            // .attr("transform", "translate(25,10)")
    //.select(".domain").remove()    
    
  // Customization
  // svg.selectAll(".tick line").attr("stroke", "#b8b8b8")

  // Add X axis label:
  // svg.append("text")
  //     .attr("text-anchor", "end")
  //     .attr("x", width)
  //     .attr("y", height-30 )      
  //     //.text("Time");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 13000])  
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
      .style("font-weight", "bold")
      .style("font-size", 12);

  // color palette
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeCategory10);

  //stack the data?
  var stackedData = d3.stack()
    // .offset(d3.stackOffsetSilhouette)
    .offset(d3.stackOffsetZero)
    .keys(keys)
    (data)

  // create a tooltip
  var Tooltip = svg
    .append("text")
    .attr("x", 30)
    .attr("y", 0)
    .style("opacity", 1)
    .style("font-size", 14)

  Tooltip.text("Hover over an area in the chart to see the label")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    Tooltip.style("opacity", 1)
    d3.selectAll(".myArea").style("opacity", .2)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d,i) {
    grp = keys[i]
    Tooltip.text(grp)
  }

  var mouseleave = function(d) {
    Tooltip.style("opacity", 0)
    d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
   }

  // Area generator
  var area = d3.area()
    .x(function(d) { return x(d3.timeParse("%Y-%m-%d")(d.data.date)); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })
    .curve(d3.curveBasis)

  // Show the areas
  svg
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
      .attr("class", "myArea")
      .style("fill", function(d) { return color(d.key); })
      .attr("d", area)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
})

  document.getElementById("button_topicsmonthly").className = "none"  
  document.getElementById("button_topicscumulative").className = "none"  
  document.getElementById("button_serversmonthly").className = "none"  
  document.getElementById("button_serverscumulative").className = "none";    

  document.getElementById(whichbutton).className = "current";    
}

plot_stats('data/by_topiclabel.csv','button_topicsmonthly')