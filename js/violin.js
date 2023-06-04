var margin = {top: 10, right: 30, bottom: 30, left: 70},
    width = 590 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;
    height_added = 500 - margin.top - margin.bottom +30;

// Append the SVG object to the body of the page
var svg = d3.select("#viz-violin")
  .append("svg")
    .attr("width", height + margin.top + margin.bottom) // Swap width and height
    .attr("height", width + margin.left + margin.right) // Swap width and height
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Read the data and compute summary statistics for each species
d3.csv("https://raw.githubusercontent.com/felipelmc/Formula1-Viz/main/times.csv", function(data) {

var data  = data.filter(function(d) {
    return d.year === "2022";
  });

var categories = Array.from(new Set(data .map(function(d) { return d.constructorName; })));


// Build and show the X scale (inverted Y scale)
var x = d3.scaleLinear() // Use scaleLinear for inverted scale
  .domain([10000.0, 45000.0])
  .range([0, height]); // Swap height and 0

var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height_added + ")") // Move the x-axis to the bottom
  .call(d3.axisBottom(x));

xAxis.selectAll("text")
  .style("fill", "white"); // Set axis text color to white


xAxis.select("path")
  .style("stroke", "white"); // Set axis line color to white

  // Build and show the Y scale (inverted X scale)
  var y = d3.scaleBand()
    .range([0, width])
    .domain(categories)
    .padding(0.05);

  var yAxis = svg.append("g")
    .call(d3.axisLeft(y));
  yAxis.selectAll("text")
    .style("fill", "white"); // Set axis text color to white
  yAxis.select("path")
    .style("stroke", "white"); // Set axis line color to white

  // Features of the histogram
  var histogram = d3.histogram()
    .domain(x.domain()) // Swap x and y domain
    .thresholds(x.ticks(20))
    .value(d => d);

  // Compute the binning for each group of the dataset
  var sumstat = d3.nest()
    .key(function(d) { return d.constructorName; })
    .rollup(function(d) {
      input = d.map(function(g) { return g.milliseconds; })
      bins = histogram(input)
      return bins;
    })
    .entries(data);

  // What is the biggest number of values in a bin? We need it because this value will have a width of 100% of the bandwidth.
  var maxNum = 0;
  for (i in sumstat) {
    allBins = sumstat[i].value;
    lengths = allBins.map(function(a) { return a.length; });
    longuest = d3.max(lengths);
    if (longuest > maxNum) { maxNum = longuest; }
  }

  // The maximum width of a violin must be y.bandwidth = the width dedicated to a group
  var yNum = d3.scaleLinear() // Use scaleLinear for inverted scale
    .range([0, y.bandwidth()])
    .domain([-maxNum, maxNum]); // Swap -maxNum and maxNum

  // Color scale for dots
  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([3, 9]);

  // Add the shape to this SVG!
  svg
    .selectAll("myViolin")
    .data(sumstat)
    .enter()
    .append("g")
    .attr("transform", function(d) { return "translate(0," + y(d.key) + ")"; }) // Swap x and y position
    .append("path")
    .datum(function(d) { return d.value; })
    .style("stroke", "none")
    .style("fill", "blue")
    .attr("d", d3.area()
      .y0(yNum(0)) // Swap yNum(0) and yNum(d.length)
      .y1(function(d) { return yNum(d.length) ; }) // Swap yNum(0) and yNum(d.length)
      .x(function(d) { return x(d.x0) +30; }) // Swap x and y
      .curve(d3.curveCatmullRom)
    );

  // Add individual points with jitter
  var jitterWidth = 15;
  svg
    .selectAll("indPoints")
    .data(data)
    .enter()
    .append("circle")
    .attr("cy", function(d) { return y(d.constructorName) + y.bandwidth() / 2 - Math.random() * jitterWidth; }) // Swap y and x position
    .attr("cx", function(d) { return x(d.milliseconds) + 30; }) // Swap x and y position
    .attr("r", 3)
    .style("fill", "red")
    .attr("stroke", "white");
});
