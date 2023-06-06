var selectedYear = 2022;
var year_data = null;


var margin = {top: 10, right: 30, bottom: 30, left: 90},
    width = 590 - margin.left - margin.right,
    height = 850 - margin.top - margin.bottom;
    height_added = 500 - margin.top - margin.bottom +30;

var svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

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
        d3.select("#viz-time-series").selectAll("*").remove();
});

}





