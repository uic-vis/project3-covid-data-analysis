
function createMap() {
    const buttons = d3.selectAll('input');
    var selectedradio = 2021;
    buttons.on('change', function(d) {
    console.log('button selected' + this.value);
    selectedradio = this.value;
    line(selectedradio);
    });

    function line(selectedradio){
    console.log("hello selectedradio" + selectedradio);
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    heightLine = 300,
    width = 1000,
    height = 250;


           d3.json("dataLine.json", function(dataLine) {
            d3.json("dataLine2.json", function(dataLine2) {
        var xLine = d3.scaleLinear()
        .domain(d3.extent(dataLine.columns))
        .range([margin.left, width - margin.right]);

        var yLine = d3.scaleLinear()
    .domain([0, d3.max(dataLine.series, d => d3.max(d.values))]).nice()
    .range([heightLine - margin.bottom, margin.top]);

    // var xAxisLine = xAxisLine
    // .attr("transform", `translate(0,${heightLine - margin.bottom})`)
    // .call(d3.axisBottom(xLine).tickFormat(function(d){
    //   return xData[d];
    // })
    // .ticks(width / 80).tickSizeOuter(0))
    // .call(g => g.select(".tick:last-of-type text").clone()
    //     // Add X axis label:
    //     //.attr("x", 3)
    //     .attr("x", width)
    //     .attr("y", heightLine + margin.top + 20)
    //     .attr("text-anchor", "middle")
    //     .attr("font-weight", "bold")
    //     .text(dataLine.x))
      
        // var yAxisLine = yAxisLine
        // .attr("transform", `translate(${margin.left},0)`)
        // .call(d3.axisLeft(yLine))
        // .call(g => g.select(".tick:last-of-type text").clone()
        //     .attr("x", 3)
        //     .attr("text-anchor", "middle")
        //     .attr("font-weight", "bold")
        //     .attr("transform", "rotate(-90)")
        //     .text(dataLine.y));
            
     var line = d3.line()
    .defined(d => !isNaN(d))
    .x((d, i) => xLine(dataLine.columns[i]))
    .y(d => yLine(d));

    var xData = ["", "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    d3.select("#linechart").html("");

    var svg = d3.select("#linechart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)      
        
        svg.append("g")
        .attr("transform", `translate(0,${heightLine - margin.bottom})`)
        .call(d3.axisBottom(xLine).tickFormat(function(d){
          return xData[d];
        })
        .ticks(width / 80).tickSizeOuter(0))
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", width)
            .attr("y", heightLine + margin.top + 20)
            .attr("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text(dataLine.x));
      
        svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yLine))
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "middle")
            .attr("font-weight", "bold")
            .attr("transform", "rotate(-90)"));
      
       svg.append("g")
       .attr("id", "lines")
       .attr("stroke", selectedradio == 2021 ? "#FF9900" : "#0000FF")
          .attr("stroke-width", 3)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .selectAll("path")
          .data(selectedradio == 2021 ? dataLine.series : dataLine2.series)
          .enter()
          .append("path")
          .attr("d", d => line(d.values))
          .style("mix-blend-mode", "multiply");
        });
           });
        }

    }


// return debug;
function init() {
    console.log("im back");
     createMap();
}

window.onload = init;
