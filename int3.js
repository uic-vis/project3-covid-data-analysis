
function createMap() {
    console.log("hello hey there in map");
     
    var linesvg = createLineChart();

    d3.json("groupedData.json", function(groupedData) {
            console.log("gd" + groupedData);

    var lines = d3.select(linesvg)
    .select("g#lines")
    .selectAll("path")
    .data(groupedData);
    console.log("lines" + lines);


        console.log("linesvg" + linesvg);

       var zipcodes = ["60629", "60618", "60632", "60639", "60647", "60623", "60617", "60625", "60608", "60634"];

     // set the dimensions and margins of the graph
        var margin = {top: 10, right: 10, bottom: 25, left: 50},
            innerWidth = 868,
            innerHeight = 215,
            width = 1000,
            height = 250;

        var svg = d3.select("#barchart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

         // setup and draw x-axis
  var  districtScale = d3.scaleBand()
  .domain(zipcodes)
  .range([0, innerWidth])
  .paddingInner(0.1)
  .paddingOuter(0.1);

var districtAxis = d3.axisBottom(districtScale)
  .tickSize(0)
  .tickPadding(5);

svg.append("g")
  .attr("class", "axis")
  .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
  .call(districtAxis);  

// setup and draw y-axis
var totalScale = d3.scaleLinear()
  .domain([7827485, 11520550])
  .range([innerHeight, 0])
  .nice();


var totalAxis = d3.axisLeft(totalScale)
  .ticks(10)
  .tickFormat(d3.formatPrefix(",.0", 1000));

  svg.append("g")
  .attr("class", "axis")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .call(totalAxis);  

// add bars using scales

d3.json("sortedPopulation.json", function(data) {
    console.log(data);
svg.append("g", ":first-child")
  .attr("id", "bars")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .selectAll("rect")
  .data(data)
  .enter()
    .append("rect")
    .attr("x", d => districtScale(d[0]))
    .attr("y", d => totalScale(d[1]))
    .attr("width", districtScale.bandwidth())
    .attr("height", d => innerHeight - totalScale(d[1]))
    .style("fill", "lightgray")
    .on("mouseover", function(d) {
        console.log("d", d)
        console.log("lines", lines)
        d3.select(this)
        .transition()
        .style("fill", "lightseagreen")

        createLineChart(d);
linesfunc()
function linesfunc(){
    console.log("line")
    lines
    //.filter(e => {console.log("e", e); e[0] == d[0]})
        .raise()
        .transition()
        .style("stroke", "lightseagreen")
        .style("stroke-width", "3px");
}
        })
    .on("mouseout", function(d) {
            d3.select(this)
            .transition()
            .style("fill", "lightgray")

            // lines.filter();
            
            lines.filter(e => e[0] == d[0])
            .raise()
            .transition()
            .style("stroke", "lightgray")
            .style("stroke-width", "1px");
            });
});
});
}


function createLineChart(dd) {
    console.log("hello hey there in line");
// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 25, left: 50},
innerWidth = 868,
innerHeight = 215,
width = 1000,
height = 250;
d3.select("#linechart").html("")

var svg = d3.select("#linechart").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("covid_data.json", function(covid_data) {

    var dateScale = d3.scaleLinear()
    .domain(d3.extent(covid_data, d => d.month))
    .range([0, innerWidth])
    .nice();
  
  var dateAxis = d3.axisBottom(dateScale);
  
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
    .call(dateAxis);
  
  // setup and draw y-axis
  var countScale = d3.scaleLinear()
    .domain([200, 7000])
    .range([innerHeight, 0])
    .nice();
  
  var countAxis = d3.axisLeft(countScale)
    .ticks(8);
  
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(countAxis);
  
  // draw lines for each neighborhood
  var line = d3.line()
    .x(d => dateScale(d.month))
    .y(d => countScale(d.cases));


d3.json("groupedData.json", function(groupedData) {
  svg.append("g", ":first-child")
    .attr("id", "lines")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .selectAll("path")
    .data(groupedData)
    .enter()
    .append("path")
    .attr("d", d => line(d[1]))
    .style("stroke", "lightgray")
    .filter(e => e[0] == dd[0])
      .raise()
      .transition()
      .style("stroke", "lightseagreen")
      .style("stroke-width", "3px");
    });

});

return svg.node();

}


function int3(){
    console.log("mouseover 1");

    var barchart = createMap();

    var charts = createLineChart();

    var gd = d3.json("groupedData.json", function(groupedData) {
        return groupedData;
        });
        
        var sp = d3.json("sortedPopulation.json", function(data) {
            return data;
        });
        
        console.log("mouseover 2" + barchart);

var bars = d3.select(barchart)
.select("g#barchart")
.selectAll("rect")
.data(sp)
  
var lines = d3.select(charts)
.select("g#linechart")
.selectAll("path")
.data(gd);
  
    bars.on("mouseover", function(d) {
d3.select(this)
.transition()
.style("fill", "lightseagreen");

lines.filter(e => e[0] == d[0])
.raise()
.transition()
.style("stroke", "lightseagreen")
.style("stroke-width", "3px");
});

bars.on("mouseout", function(d) {
d3.select(this)
.transition()
.style("fill", "lightgray");

lines.filter(e => e[0] == d[0])
.raise()
.transition()
.style("stroke", "lightgray")
.style("stroke-width", "1px");
});

}

// return debug;

function init() {
    console.log("im back");
     createMap();
    // createLineChart();

    // int3();
}

window.onload = init;
