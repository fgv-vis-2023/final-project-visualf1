var selectedYear = 2022;
var year_data = null;

const tParser = d3.timeParse("%Y-%m-%d");

var margin = {top: 20, right: 120, bottom: 60, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    height_added = 500 - margin.top - margin.bottom +30;





window.onload = function() {
    d3.json("https://raw.githubusercontent.com/fgv-vis-2023/final-project-visualf1/main/data/wrang/participation.json", function(error, data) { 
        year_data = data;
        updateYearList();
    });
}

const dropdownYear= document.getElementById("dropdown-dyear");
const dropdownPilot = document.getElementById("dropdown-dpilot");

function updateYearList() {
    dropdownYear.innerHTML = "";
    for (let year in year_data) {
        let opt = document.createElement("a");
        opt.classList.add("dropdown-item");
        opt.classList.add("dyear");
        opt.setAttribute("href", "#" + year);
        opt.innerHTML = year;
        opt.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior
            console.log('Selected year:', year);
            updateDriverList(year);
        });
        dropdownYear.appendChild(opt);
    }
}

function updateDriverList(year) {
    dropdownPilot.innerHTML = "";
    console.log(year_data);

    let driverList = year_data[year];
    for (let i = 0; i < driverList.length; i++) {
        let driver = driverList[i];
        let opt = document.createElement("a");
        opt.classList.add("dropdown-item");
        opt.classList.add("dpilot");
        opt.setAttribute("href", "#");
        opt.innerHTML = '<div class="form-check"><input class="form-check-input" type="checkbox" value="" id="Checkme1" /><label class="form-check-label" for="Checkme1">' + driver + '</label></div>';
        opt.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior
            console.log('Selected driver:', driver);
            drawDriverChart(driver, year);
            document.getElementById("driver-value").innerHTML = driver;
            document.getElementById("year-value").innerHTML = year;
        });
        dropdownPilot.appendChild(opt);
    }
}

function drawDriverChart(driver, year) {
    d3.csv("https://raw.githubusercontent.com/fgv-vis-2023/final-project-visualf1/main/data/wrang/positions.csv", function(error, data) {
        console.log(data);
        let new_data = [];
        //filter data

        data.forEach(element => {
            if(element.driverFullname == driver && element.year == year){
                new_data.push(element);
            }
        });

        //clear previous chart
        d3.select("#viz-time-series").selectAll("svg").remove();

        var svg = d3.select("#viz-time-series")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // adds a little bit of space between start of line and y-axis
        
        var x = d3.scaleTime()
            .domain(d3.extent(new_data, function(d) { return tParser(d.date); }))
            .range([ 10, width ]);
        svg.append("g")
            .attr("transform", "translate(-10," + height + ")")
            .call(d3.axisBottom(x).ticks(7));

        var max_points = 25;
        if (year < 1961) {
            max_points = 8;
        }   else if (year < 1991) {
            max_points = 9;
        }    else if (year < 2010) {
            max_points = 10;
        }   else {
            max_points = 25;
        }

        var num_races = new_data.length;
        var y = d3.scaleLinear()
            .domain([0, max_points * num_races])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));



        //for a black background well set the axis to white
        svg.selectAll("path")
            .attr("stroke", "white");
        
        svg.selectAll("line")
            .attr("stroke", "white");

        svg.selectAll("text")
            .attr("fill", "white");

        var accumulated_points = 0;
        svg.append("path")
            .datum(new_data)
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(function(d, i) { return x(
                tParser(d.date)
                ) })
            .y(function(d, i) { return y(
                accumulated_points += parseInt(d.points)
                ) })
            )
        var accumulated_points = 0;

        var tooltip = d3.select("#viz-time-series").append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")

        svg.append("g")
            .selectAll("dot")
            .data(new_data)
            .enter()
            .append("circle")
                .attr("cx", function(d, i) { return x(
                    tParser(d.date)
                    ) })
                .attr("cy", function(d, i) { return y(
                    accumulated_points += parseInt(d.points)
                    ) })
                .attr("r", 4)
                .attr("fill", "black")
                .attr("stroke", "white")
                .attr("stroke-width", 1.5)
                .on("mouseenter", function(event, d) {
                    d3.select(this).attr("r", 8);
                    tooltip.style("visibility", "visible");
                    let xval = this.getAttribute("cx");
                    xval = parseInt(xval) + 100;
                    let yval = this.getAttribute("cy");
                    yval = parseInt(yval) - 70;
                    console.log("hovered ");
                    tooltip.style("top", yval + "px").style("left", xval + "px");
                })
                .on("mouseleave", function() {
                    d3.select(this).attr("r", 4     );
                    tooltip.style("visibility", "hidden");

                });



        
            

        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width  / 2)
            .attr("y", height + margin.bottom - 20)
            .attr("text-anchor", "middle")
            .text("Tempo");
    
        // Add legend for y-axis
        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -(height + margin.top) / 2 +10)
            .attr("y", -margin.left + 40)
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .text("Pontos");
            


        // ending here for now, to test



    });

}

drawDriverChart("Max Verstappen", 2022);


