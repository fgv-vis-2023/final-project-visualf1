function _1(md){return(
md`## Race bar com as vitórias dos pilotos`
)}

async function _data(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("driversWinners@2.csv").text(), d3.autoType)
)}

function _replay(html){return(
html`<button>Replay`
)}

async function* _chart(replay,d3,width,height,bars,axis,labels,ticker,keyframes,duration,x,invalidation)
{
  replay;

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width+10, height]);

  const updateBars = bars(svg);
  const updateAxis = axis(svg);
  const updateLabels = labels(svg);
  const updateTicker = ticker(svg);

  yield svg.node();

  for (const keyframe of keyframes) {
    const transition = svg.transition()
        .duration(duration)
        .ease(d3.easeLinear);

    // Extract the top bar’s value.
    x.domain([0, keyframe[1][0].value]);

    updateAxis(keyframe, transition);
    updateBars(keyframe, transition);
    updateLabels(keyframe, transition);
    updateTicker(keyframe, transition);

    invalidation.then(() => svg.interrupt());
    await transition.end();
  }
}


function _duration(){return(
200
)}

function _6(d3,data){return(
d3.group(data, d => d.driverFullname)
)}

function _n(){return(
15
)}

function _names(data){return(
new Set(data.map(d => d.driverFullname))
)}

function _datevalues(d3,data){return(
Array.from(d3.rollup(data, ([d]) => d.wins, d => +d.year, d => d.driverFullname))
  .sort(([a], [b]) => d3.ascending(a, b))
)}

function _rank(names,d3,n){return(
function rank(value) {
  const data = Array.from(names, driverFullname => ({driverFullname, value: value(driverFullname)}));
  data.sort((a, b) => d3.descending(a.value, b.value));
  for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
  return data;
}
)}

function _11(rank,datevalues){return(
rank(driverFullname => datevalues[1][1].get(driverFullname))
)}

function _k(){return(
3
)}

function _13(keyframes){return(
keyframes[0][0]
)}

function _keyframes(d3,datevalues,k,rank)
{
  const keyframes = [];
  let ka, a, kb, b;
  for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
    for (let i = 0; i < k; ++i) {
      const t = i / k;
      keyframes.push([
        ka * (1 - t) + kb * t,
        rank(driverFullname => (a.get(driverFullname) || 0) * (1 - t) + (b.get(driverFullname) || 0) * t)
      ]);
    }
  }
  keyframes.push([kb, rank(driverFullname => b.get(driverFullname) || 0)]);
  return keyframes;
}


function _nameframes(d3,keyframes){return(
d3.groups(keyframes.flatMap(([, data]) => data), d => d.driverFullname)
)}

function _prev(nameframes,d3){return(
new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])))
)}

function _next(nameframes,d3){return(
new Map(nameframes.flatMap(([, data]) => d3.pairs(data)))
)}

function _bars(n,color,y,x,prev,next){return(
function bars(svg) {

  let bar = svg.append("g")
    .attr("fill-opacity", 0.8)
    .selectAll("rect");

  return ([year, data], transition) => {
    bar = bar
      .data(data.slice(0, n), d => d.driverFullname)
      .join(
        enter => enter.append("rect")
          .attr("fill", color)
          .attr("height", y.bandwidth())
          .attr("x", x(0))
          .attr("y", d => y((prev.get(d) || d).rank))
          .attr("width", d => x((prev.get(d) || d).value) - x(0)),
        update => update,
        exit => exit.transition(transition).remove()
          .attr("y", d => y((next.get(d) || d).rank))
          .attr("width", d => x((next.get(d) || d).value) - x(0))
      )
      .call(bar => bar.transition(transition)
        .attr("y", d => y(d.rank))
        .attr("width", d => x(d.value) - x(0)));
  };
}
)}

function _color(d3)
{
  const scale = d3.scaleOrdinal(d3.schemeTableau10);
  return d => scale(d.driverFullname);
}


function _labels(n,x,prev,y,next,textTween){return(
function labels(svg) {
  let label = svg.append("g")
      .style("font-weight", "bold")
      .style("font-family", "--var(crimson-thief)")
      .style("font-size", "19px")
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
    .selectAll("text");

  return ([year, data], transition) => label = label
    .data(data.slice(0, n), d => d.driverFullname)
    .join(
      enter => enter.append("text")
        .attr("transform", d => `translate(${x((prev.get(d) || d).value)},${y((prev.get(d) || d).rank)})`)
        .attr("y", y.bandwidth() / 2)
        .attr("x", -6)
        .attr("dy", "-0.25em")
        .text(d => d.driverFullname)
        .call(text => text.append("tspan")
          .attr("fill-opacity", 0.7)
          .attr("font-weight", "normal")
          .attr("x", -6)
          .attr("dy", "1.15em")),
      update => update,
      exit => exit.transition(transition).remove()
        .attr("transform", d => `translate(${x((next.get(d) || d).value)},${y((next.get(d) || d).rank)})`)
        .call(g => g.select("tspan").tween("text", d => textTween(d.value, (next.get(d) || d).value)))
    )
    .call(bar => bar.transition(transition)
      .attr("transform", d => `translate(${x(d.value)},${y(d.rank)})`)
      .call(g => g.select("tspan").tween("text", d => textTween((prev.get(d) || d).value, d.value))))
}
)}

function _textTween(d3,formatNumber){return(
function textTween(a, b) {
  const i = d3.interpolateNumber(a, b);
  return function(t) {
    this.textContent = formatNumber(i(t));
  };
}
)}

function _formatNumber(d3){return(
d3.format(",d")
)}

function _axis(margin,d3,x,width,barSize,n,y){return(
function axis(svg) {
  const g = svg.append("g")
      .attr("transform", `translate(0,${margin.top})`);
  
  g.append('text')
      .attr('text-anchor', 'start')
      .attr('fill', 'white')
      .attr('font-size', '15px')
      .attr('x', 5)
      .attr('y', 0)
      .text('Win Count')

  const axis = d3.axisTop(x)
      .ticks(width / 160)
      .tickSizeOuter(0)
      .tickSizeInner(-barSize * (n + y.padding()));

  return (_, transition) => {
    g.transition(transition).call(axis);
    g.select(".tick:first-of-type text").remove();
    g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "black");
    g.select(".domain").remove();
  };
}
)}

function _ticker(width,margin,barSize,n,keyframes){return(
function ticker(svg) {
  const now = svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width - 6)
      .attr("y", margin.top + barSize * (n - 0.45))
      .attr('fill', 'white')
      .attr('font-family', 'Crimson Thief, Crimson')
      .attr('font-weight', 500)
      .attr('font-size', 70)
      .text(parseInt(keyframes[0][0]));

  return ([date], transition) => {
    transition.end().then(() => now.text(parseInt(date)));
  };
}
)}

function _x(d3,margin,width){return(
d3.scaleLinear([0, 1], [margin.left, width - margin.right])
)}

function _y(d3,n,margin,barSize){return(
d3.scaleBand()
    .domain(d3.range(n + 1))
    .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
    .padding(0.1)
)}

function _height(margin,barSize,n){return(
margin.top + barSize * n + margin.bottom
)}

function _barSize(){return(
48
)}

function _margin(){return(
{top: 16, right: 6, bottom: 6, left: 0}
)}

function _d3(require){return(
require("d3@6")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["driversWinners@2.csv", {url: new URL("./files/0dcd588309f708ece7e00dbc17c26f3fd47a209fbad947bdd55c54bc2654fd12ce0ffbc85154f60d4c859fef3f5aaaf7fe40bc048606d38193a08757c4848257.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], _data);
  main.variable(observer("viewof replay")).define("viewof replay", ["html"], _replay);
  main.variable(observer("replay")).define("replay", ["Generators", "viewof replay"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["replay","d3","width","height","bars","axis","labels","ticker","keyframes","duration","x","invalidation"], _chart);
  main.variable(observer("duration")).define("duration", _duration);
  main.variable(observer()).define(["d3","data"], _6);
  main.variable(observer("n")).define("n", _n);
  main.variable(observer("names")).define("names", ["data"], _names);
  main.variable(observer("datevalues")).define("datevalues", ["d3","data"], _datevalues);
  main.variable(observer("rank")).define("rank", ["names","d3","n"], _rank);
  main.variable(observer()).define(["rank","datevalues"], _11);
  main.variable(observer("k")).define("k", _k);
  main.variable(observer()).define(["keyframes"], _13);
  main.variable(observer("keyframes")).define("keyframes", ["d3","datevalues","k","rank"], _keyframes);
  main.variable(observer("nameframes")).define("nameframes", ["d3","keyframes"], _nameframes);
  main.variable(observer("prev")).define("prev", ["nameframes","d3"], _prev);
  main.variable(observer("next")).define("next", ["nameframes","d3"], _next);
  main.variable(observer("bars")).define("bars", ["n","color","y","x","prev","next"], _bars);
  main.variable(observer("color")).define("color", ["d3"], _color);
  main.variable(observer("labels")).define("labels", ["n","x","prev","y","next","textTween"], _labels);
  main.variable(observer("textTween")).define("textTween", ["d3","formatNumber"], _textTween);
  main.variable(observer("formatNumber")).define("formatNumber", ["d3"], _formatNumber);
  main.variable(observer("axis")).define("axis", ["margin","d3","x","width","barSize","n","y"], _axis);
  main.variable(observer("ticker")).define("ticker", ["width","margin","barSize","n","keyframes"], _ticker);
  main.variable(observer("x")).define("x", ["d3","margin","width"], _x);
  main.variable(observer("y")).define("y", ["d3","n","margin","barSize"], _y);
  main.variable(observer("height")).define("height", ["margin","barSize","n"], _height);
  main.variable(observer("barSize")).define("barSize", _barSize);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
