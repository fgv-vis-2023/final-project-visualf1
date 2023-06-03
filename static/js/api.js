const proxy_live = "https://cors-proxy.fringe.zone/"
const base_live = "livetiming.formula1.com/static/"
const base_ergast = "ergast.com/api/f1/"

var season = 2018
var round = 1

// Ergast Block
args = {}

function getErgastData(url, callback) {
    $.ajax({
        url: url,
        dataType: "jsonp",
        success: callback,

    })
}

function constructErgastUrl(args={}) {
    if (args == {}) {
        return base_ergast + mode + ".json"
    }

    else {
        var url = base_ergast
        for (const [key, value] of Object.entries(args)) {
            url += key + "/" + value
        }
        url += ".json"
        return url
    }
}






// Live Timing Block

function getLiveTimingData(url, callback) {
    $.ajax({
        url: proxy_live + url,
        dataType: "json",
        success: callback,
    })
}

