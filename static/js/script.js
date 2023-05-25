
const proxy_url = 'https://cors-proxy.fringe.zone/livetiming.formula1.com/static/2021/2021-03-28_Bahrain_Grand_Prix/2021-03-28_Race/TimingAppData.json'
const raw_url = 'https://livetiming.formula1.com/static/2021/2021-03-28_Bahrain_Grand_Prix/2021-03-28_Race/TimingAppData.json'

// d3.json(url,function (data) {
//     console.log(data)
// })

// $.ajax({
//     url: url,
//     dataType: 'json',
//     type: 'GET',
//     success: function (data) {
//         console.log(data);
//     }
// });

fetch(proxy_url).then(response => {
    console.log(response)
    return response.json()
}
).then(data => {
    console.log(data)
}
)


fetch(raw_url).then(response => {
    console.log(response)
    return response.json()
}
).then(data => {
    console.log(data)
}
)

d3.json(proxy_url, function (data) {
    console.log(data)
}
)

d3.json(raw_url, function (data) {
    console.log(data)
}
)
