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
        console.log(typeof(year_data));
        updateYearList();
    });
}

const dropdownYear= document.getElementById("dropdown-dyear");
const dropdownPilot = document.getElementById("dropdown-dpilot");

function updateYearList() {
    dropdownYear.innerHTML = "";
    let years = Object.keys(year_data).reverse();
    for (let y in years) {
        let year = years[y];
        let opt = document.createElement("a");
        opt.classList.add("dropdown-item");
        opt.classList.add("dyear");
        opt.setAttribute("href", "#" + year);
        opt.innerHTML = year;
        opt.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior
            updateDriverList(year);
        });
        dropdownYear.appendChild(opt);
    }
}
let selectedDrivers = [];
var availableColors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"];
var usedColors = {};

function updateDriverList(year) {
    dropdownPilot.innerHTML = "";
    console.log(year_data);
    let driverList = year_data[year];
    let tempDriver = driverList[0];
    drawDriverChart(year, tempDriver);
    for (d in selectedDrivers) {
        removeDriver(selectedDrivers[d]);
    }
    selectedDrivers = [];
    usedColors = {};
    for (let i = 0; i < driverList.length; i++) {
        let driver = driverList[i];
        let div = document.createElement("div");
        div.style = "padding-left: 30px;";
        div.classList.add("form-check");
        div.classList.add("dropdown-item");
        div.classList.add("dpilot");
        div.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" value=\"" + driver + "\" id=\"" + driver + "\">" +
                        "<label class=\"form-check-label\" for=\"" + driver + "\">" + driver + "</label>";
        dropdownPilot.appendChild(div);

        let checks = document.getElementsByClassName("form-check-input");
        checks[i].addEventListener('change', function(event) {
            let driver = this.value;
            let checked = this.checked;
            if (checked) {
                if (selectedDrivers.length >= 5) {
                    alert("Você já selecionou 5 pilotos! Por favor, desmarque um piloto para selecionar outro.");
                    this.checked = false;
                    return;
                }
                updateDriverChart(driver, year, "add");
                addDriver(driver);
            }
            if (!checked) {
                updateDriverChart(driver, year, "remove");
                removeDriver(driver);
            }
        });


    }
}

function addDriver(driver) {
    selectedDrivers.push(driver);
    if (selectedDrivers.length === 1) {
        document.getElementsByClassName("card-text-b war")[0].remove();
    }
    let pilotDiv = document.getElementById("card-body-pilotos");
    let p = document.createElement("p");
    p.classList.add("card-text");
    console.log(usedColors[driver]);
    p.id = driver + "-card";
    p.innerHTML = "<span id='driver-value' style='font-weight: bold;'>" + driver + ":    " + "</span><svg width='22' height='22' style='border-top:-2px' id=" + driver.replace(/\s/g, '') + "-legend></svg>";
    pilotDiv.appendChild(p);
}

function removeDriver(driver) {
    console.log(selectedDrivers);
    selectedDrivers = selectedDrivers.filter(item => item !== driver);

    if (selectedDrivers.length === 0) {
        let pilotDiv = document.getElementById("card-body-pilotos");
        let p = document.createElement("p");
        p.classList.add("card-text-b");
        p.classList.add("war");
        p.innerHTML = "<span id='driver-value'>Selecione um piloto</span>";
        pilotDiv.appendChild(p);
    }
    let pilotDiv = document.getElementById(driver + "-card");
    pilotDiv.remove();
}



let x = d3.scaleTime()
let y = d3.scaleLinear()


function drawDriverChart(year, tempDriver) {
    d3.csv("https://raw.githubusercontent.com/fgv-vis-2023/final-project-visualf1/main/data/wrang/positions.csv", function(error,data) {
        //data
        let new_data = [];
        data.forEach(element => {
            if(element.driverFullname == tempDriver && element.year == year){
                new_data.push(element);
            }
        });

        d3.select("#viz-time-series").selectAll("svg").remove();

        var svg = d3.select("#viz-time-series")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        x = d3.scaleTime()
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
        y = d3.scaleLinear()
            .domain([0, max_points * num_races])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));

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
                accumulated_points += max_points
                ) })
            )
        var accumulated_points = 0;

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

        

    });
}

function updateDriverChart(driver, year, mode){
    d3.csv("https://raw.githubusercontent.com/fgv-vis-2023/final-project-visualf1/main/data/wrang/positions.csv", function(error, data) {
        let new_data = [];
        data.forEach(element => {
            if(element.driverFullname == driver && element.year == year){
                new_data.push(element);
            }
        });
        //checks mode if its add or remove
        if(mode == "add"){
            //identify the svg element with the driver name
            svg = d3.select("#viz-time-series")
            var svg = d3.select("#viz-time-series").select("svg").select("g").append("g").attr("id", driver);


            let color = availableColors.pop();
            usedColors[driver] = color;

            let legend = document.getElementById(driver.replace(/\s/g, '') + "-legend")
            legend.innerHTML= "<circle cx='10' cy='10' r='5' fill='" + color + "'></circle>";

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
                .attr("stroke", color)
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

            tooltip.style("position", "absolute")
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
                .attr("fill", color)
                .attr("stroke", "white")
                .attr("stroke-width", 1.5)
                .on("mouseenter", function(d) {
                    d3.select(this).attr("r", 8);
                    tooltip.style("visibility", "visible");
                    let xval = this.getAttribute("cx");
                    xval = parseInt(xval) + 100;
                    let yval = this.getAttribute("cy");
                    yval = parseInt(yval) - 70;
                    console.log("hovered ");
                    tooltip.style("top", yval + "px").style("left", xval + "px");
                    const st = " style='color: black;'";
                    tooltip.html ("<h5" + st + "> Race: </h5><p style = 'margin-top: -30px; margin-left: 48px; color:black;'>" + d.raceName + "</p><h5" + st + "> Position: </h5><p style = 'margin-top: -30px; margin-left: 80px; color:black;'>" + d.position + "</p><h5" + st + "> Points: </h5><p style = 'margin-top: -30px; margin-left: 62px; color:black;'>" + d.points + "</p><h5" + st + "> Date: </h5><p style = 'margin-top: -30px; margin-left: 48px; color:black;'>" + d.date + "</p>");
                })
                .on("mouseleave", function() {
                    d3.select(this).attr("r", 4     );
                    tooltip.style("visibility", "hidden");
                });

        }
        else if(mode == "remove"){
            document.getElementById(driver).remove();
            availableColors.push(usedColors[driver]);
        }
        else{
            console.log("error in mode");
        }
    });
}


drawDriverChart(2022, "Max Verstappen");


