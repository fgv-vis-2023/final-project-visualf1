
var margin = {top: 10, right: 30, bottom: 30, left: 90},
    width = 590 - margin.left - margin.right,
    height = 850 - margin.top - margin.bottom;
    height_added = 500 - margin.top - margin.bottom +30;

var selectedYear = "2022";
var selectedCorrida = null;
var yearValueSpan = document.getElementById("year-value");
var corridaValueSpan = document.getElementById("corrida-value");

const dropdownItems = document.querySelectorAll('.dyear');
// Add click event listener to each dropdown item
dropdownItems.forEach(item => {
  item.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior

    // Get the selected year from the href attribute
    const selectedYear = this.getAttribute('href').substring(1);

    // Use the selectedYear variable as needed
    console.log('Selected year:', selectedYear);
    clearGraph();

    updateGraph(selectedYear, null);
  });
});

const dropdownCorridaItems = document.querySelectorAll('.dcorrida');

// Add click event listener to each corrida dropdown item
dropdownCorridaItems.forEach(item => {
  item.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior

    // Get the selected corrida from the text content
    const selectedCorrida = this.textContent;

    // Use the selectedCorrida variable as needed
    console.log('Selected corrida:', selectedCorrida);
    console.log('Selected year:', selectedYear);
    clearGraph();

    updateGraph(selectedYear, selectedCorrida);
  });
});




// Append the SVG object to the body of the page
var svg = d3.select("#viz-violin")
  .append("svg")
    .attr("width", height + margin.top + margin.bottom) // Swap width and height
    .attr("height", width + margin.left + margin.right) // Swap width and height
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


function clearGraph() {
    svg.selectAll("*").remove();
}


function updateGraph(selectedYear, selectedCorrida) {
            
    // Read the data and compute summary statistics for each species
    d3.csv("https://raw.githubusercontent.com/felipelmc/Formula1-Viz/main/times.csv", function(data) {

    var data = data.filter(function(d) {
        return d.year === selectedYear && (selectedCorrida === null || d.raceName === selectedCorrida);
    });
    

    var categories = Array.from(new Set(data.map(function(d) { return d.constructorName; })));

    yearValueSpan.textContent = selectedYear;
    corridaValueSpan.textContent = selectedCorrida === null ? "Todas" : selectedCorrida;

    // Build and show the X scale (inverted Y scale)
    var x = d3.scaleLinear() // Use scaleLinear for inverted scale
    .domain([10.0, 60.0])
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
        input = d.map(function(g) { return g.duration; })
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

    var tooltip = d3.select("body")
        .selectAll(".tooltip")
        .data([null])
        .enter()
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    

    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2 + 150)
        .attr("y", height_added + margin.bottom + 10)
        .attr("text-anchor", "middle")
        .text("Tempo em segundos");
    
    // Add legend for y-axis
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2) + 160)
        .attr("y", -margin.left)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text("Construtora");

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
        .style("fill", "#236FC2")
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
        .attr("cy", function(d) {
            return y(d.constructorName) + y.bandwidth() / 2 - Math.random() * jitterWidth;
        })
        .attr("cx", function(d) {
            return x(d.duration) + 30;
        })
        .attr("r", 3)
        .style("fill", "#FA3131")
        .attr("stroke", "white")
    .on("mouseover", function(event, d) {
      // Show the tooltip and update its content
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip.html("Position: " + d.position)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px");

      // Increase the size of the circle on mouseover
      d3.select(this).attr("r", 6);
      d3.select(this).attr("stroke", "yellow");
    })
    // Add mouseout event listener
    .on("mouseout", function() {
      // Hide the tooltip
      tooltip.transition()
        .duration(200)
        .style("opacity", 0);

      // Reset the size of the circle on mouseout
      d3.select(this).attr("r", 3);
      d3.select(this).attr("stroke", "white");
    });

    });
};

updateGraph(selectedYear, null);