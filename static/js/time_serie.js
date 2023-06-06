var selectedYear = 2022;
var year_data = null;

const tParser = d3.timeParse("%Y-%m-%d");

var margin = {top: 10, right: 30, bottom: 30, left: 90},
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
        opt.innerHTML = driver;
        opt.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior
            console.log('Selected driver:', driver);
            drawDriverChart(driver, year);
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

        var x = d3.scaleTime()
            .domain(d3.extent(new_data, function(d) { return tParser(d.date); }))
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            

            .call(d3.axisBottom(x).ticks(7));


        var y = d3.scaleLinear()
            .domain([0, 26])
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

        
        svg.append("path")
            .datum(new_data)
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(function(d, i) { return x(
                // tParser(d.date)
                tParser(d.date)
                ) })
            .y(function(d, i) { return y(
                // parseInt(d.points)
                parseInt(d.points)
                ) })
            )

    
            


        // ending here for now, to test



    });

}




