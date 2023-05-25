const proxy = "https://cors-proxy.fringe.zone/"
const base = "livetiming.formula1.com/static/"
var year = 2018


var url_test = "2021/2021-03-28_Bahrain_Grand_Prix/2021-03-28_Race/TimingAppData.json"


//Listeners

window.onload = function () {
    yearListener = document.getElementById("year");
    yearListener.addEventListener("change", function () {
        year = yearListener.value;
        update_page();
    });
}

async function draw(df) {
    df = await df
    // console.log(df)
    //  console.log(df[8000][1]["Position"][0]["Entries"]['1']['X'])
    var viz = d3.select("#viz")
        .append("svg")
        .attr("width", 600)
        .attr("height", 600)

    var xScale = d3.scaleLinear()
        .domain([-10000, 10000])
        .range([0, 600])

    var yScale = d3.scaleLinear()
        .domain([-10000, 10000])
        .range([0, 600])

    var xAxis = d3.axisBottom(xScale)
    var yAxis = d3.axisLeft(yScale)

    viz.append("g")
        .attr("transform", "translate(0, 1000)")
        .call(xAxis)

    viz.append("g")
        .attr("transform", "translate(0, 0)")
        .call(yAxis)

    //sets domain 

    
    

    //scatter plot from df 
    // viz.selectAll("circle")
    //     .data(df)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d, i) { return xScale(d[1]["Position"][0]["Entries"]['77']["X"]) })
    //     .attr("cy", function (d) { return yScale(d[1]["Position"][0]["Entries"]['77']["Y"]) })
    //     .attr("r", 1)
    //     .attr("fill", "black")
    //     .attr("stroke", "black")
    //instead adds 1 point at a time adding a wait time
    df.forEach(function (d, i) {
        setTimeout(function () {
            viz.append("circle")
                .attr("cx", xScale(d[1]["Position"][0]["Entries"]['77']["X"]))
                .attr("cy", yScale(d[1]["Position"][0]["Entries"]['77']["Y"]))
                .attr("r", 1)
                .attr("fill", "black")
                .attr("stroke", "black")
        }, 10 * i)
    })
    
}

function require_telemetry(url) {
    request_array = fetch(url).then(response => response.text()).then(text => text.split("\r\n"))
    var dataFrame = []
    request_array.then(function (data) {
        data.forEach(function (line) {
            if (line != "") {
                let line_array = line.split('"')
                line_array.pop()
                let strData = atob(line_array[1]);
                let charData = strData.split('').map(function (x) { return x.charCodeAt(0); });
                let binData = new Uint8Array(charData);
                let data = pako.inflate(binData, { raw: true });
                let strData2 = String.fromCharCode.apply(null, new Uint16Array(data));
                let json = JSON.parse(strData2);
                dataFrame.push([line_array[0], json])
            }
        })
        console.log("drawing")
        draw(dataFrame)


    })
}

var tempurl = "https://cors-proxy.fringe.zone/livetiming.formula1.com/static/2022/2022-03-20_Bahrain_Grand_Prix/2022-03-20_Race/Position.z.jsonStream"
require_telemetry(tempurl)
// d3.json(proxy + base + year + "/" + "Index.json", function (data) {
//     var list = document.createElement("ol");
//     data["Meetings"].forEach(function (meeting) {
//         let item = document.createElement("li");
//         item.innerHTML = meeting["Name"] + " " + meeting["Sessions"][4]["Path"];
//         list.appendChild(item);
//     })
//     document.getElementById("Race Names").appendChild(list);
// }
// )

// function update_page(){
//     d3.json(proxy + base + year + "/" + "Index.json", function (data) {
//         var list = document.createElement("ol");
//         data["Meetings"].forEach(function (meeting) {
//             let item = document.createElement("li");
//             item.innerHTML = meeting["Name"] + " " + meeting["Sessions"][1]["Path"];
//             list.appendChild(item);
//         })
//         RaceNames = document.getElementById("Race Names")
//         RaceNames.innerHTML = ""
//         RaceNames.appendChild(list);
//     }
//     )
// }

// var b64 = "7ZWxasNADED/RbMTdJJ8Ot8a+gft0tIhlEALxUOazfjfazsZUnwpwplMtOiMfQ/pdOK5g6f2dPw6/EB+6+Dl9AEZCIk2yBvC5yAZQ0beUpOElV+hgt3+OOzuIIxh97lv28P39AIhYwU0RZ6iQA4oFdSXVcaHvp8+z9gmsZGWEt2QkY6munEi8czhyAVcCt7TqVA6rBm2nfUGnAqwxmTEydauGzAt7DWVJqtGnlf9hz0ntbW6kFSLnbKOM9vmY55XlhYspYItYF3fcamxdDeWrLqs3AH9T2kyKA1VXWmutDUqLcyHw5X24EpTTqxErjRX2vqUNvyP1ZXmSrtWmmyDJsboRnOjrdFoUdxoD2i09/4X"

// //using pako 

// var strData = atob(b64);
// var charData = strData.split('').map(function (x) { return x.charCodeAt(0); });
// var binData = new Uint8Array(charData);
// var data = pako.inflate(binData, { raw: true });
// var strData = String.fromCharCode.apply(null, new Uint16Array(data));
// var json = JSON.parse(strData);
// console.log(json)


// //var fetch_data = fetch("https://cors-proxy.fringe.zone/livetiming.formula1.com/static/2022/2022-03-20_Bahrain_Grand_Prix/2022-03-20_Race/CarData.z.jsonStream").then(response => response.text()).then(text => console.log(text))