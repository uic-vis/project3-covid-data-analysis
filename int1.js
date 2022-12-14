
function createMap() {

    // set up
    var margin = {top: 10, right: 20, bottom: 50, left: 105}, visWidth = 500, visHeight = 500;

    d3.json("manyData.json", function(manyData) {

        var x = d3.scaleLinear()
        .domain(d3.extent(manyData, d => d.tests)).nice()
        .range([0, visWidth]);
    
      var y = d3.scaleLinear()
        .domain(d3.extent(manyData, d => d.cases)).nice()
        .range([visHeight, 0]);
    
        var xaxis = (g, scale, label) => 
        g.attr('transform', `translate(0, ${visHeight})`)
          // add axis
          .call(d3.axisBottom(scale))
          // remove baseline
          .call(g => g.select('.domain').remove())
          // add grid lines
          .call(g => g.selectAll('.tick line')
            .clone()
              .attr('stroke', '#d3d3d3')
              .attr('y1', -visHeight)
              .attr('y2', 0))
        // add label
        .append('text')
          .attr('x', visWidth / 2)
          .attr('y', 40)
          .attr('fill', 'black')
          .attr('text-anchor', 'middle')
          .text(label)
    
        var yaxis = (g, scale, label) =>
         g.call(d3.axisLeft(scale))
          // remove baseline
          .call(g => g.select('.domain').remove())
          // add grid lines
          .call(g => g.selectAll('.tick line')
            .clone()
              .attr('stroke', '#d3d3d3')
              .attr('x1', 0)
              .attr('x2', visWidth))
        // add label
        .append('text')
          .attr('x', -40)
          .attr('y', visHeight / 2)
          .attr('fill', 'black')
          .attr('dominant-baseline', 'middle')
          .text(label)
      

    var svg = d3.selectAll('#barchart')
        .append('svg')
        .attr('width', visWidth + margin.left + margin.right)
        .attr('height', visHeight + margin.top + margin.bottom)
        .property('value', manyData);
  
    var g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // axes
   g.append('g').call(xaxis, x, 'tests');
   g.append('g').call(yaxis, y, 'cases');
    
    // draw points
    
    var radius = 3;
    
    var dots = g.selectAll('circle')
      .data(manyData.filter(d => d.year))
      .enter()
      .append('circle')
        .attr('cx', d => x(d.tests))
        .attr('cy', d => y(d.cases))
        .attr('fill', function(d) {
      if(d.year == 2020) {
          return "black";
      } else {
          return "red";
      }})
        .attr('opacity', 1)
        .attr('r', radius);
    
    // ********** brushing here **********
    
    var brush = d3.brush()
        // set the space that the brush can take up
        .extent([[0, 0], [visWidth, visHeight]])
        // handle events
        .on('brush', onBrush)
        .on('end', onEnd);
    
    g.append('g')
        .call(brush);
    
    function onBrush(event) {
      // event.selection gives us the coordinates of the
      // top left and bottom right of the brush box
      const [[x1, y1], [x2, y2]] = event.selection;
      
      // return true if the dot is in the brush box, false otherwise
      function isBrushed(d) {
        const cx = x(d.tests);
        const cy = y(d.cases)
        return cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2;
      } 
      
      // style the dots
      dots.attr('fill', d => isBrushed(d) ? '#FF0000' : 'gray');
      
      // update the data that appears in the cars variable
      svg.property('value', manyData.filter(isBrushed)).dispatch('input');
    }
    
    function onEnd(event) {
      // if the brush is cleared
      if (event.selection === null) {
        // reset the color of all of the dots
        dots.attr('fill', '#FF0000');
        svg.property('value', manyData).dispatch('input');
      }
    }

    return svg.node();

});


}

function barChart() {
    // set up

    const marginMulti = ({top: 10, right: 20, bottom: 50, left: 105})
    
    const visWidth = 500;
    const visHeight = 500;

    var origins = [2020,2021];

    var color = d3.scaleOrdinal().domain(origins).range(d3.schemeCategory10);
  
    const svg = d3.selectAll('#linechart').append('svg')
        .attr('width', visWidth + marginMulti.left + marginMulti.right)
        .attr('height', visHeight + marginMulti.top + marginMulti.bottom);
  
    const g = svg.append('g')
        .attr("transform", `translate(${marginMulti.left}, ${marginMulti.top})`);
    
    // create scales
    
    const x = d3.scaleLinear()
        .range([0, visWidth]);
    
    const y = d3.scaleBand()
        .domain(color.domain())
        .range([0, visHeight])
        .padding(0.2);
    
    // create and add axes
    
    const xAxis = d3.axisBottom(x).tickSizeOuter(0);
    
    const xAxisGroup = g.append('g')
        .attr("transform", `translate(0, ${visHeight})`);
    
    xAxisGroup.append('text')
        .attr("x", visWidth / 2)
        .attr("y", 40)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .text("correlation");
    
    const yAxis = d3.axisLeft(y);
    
    const yAxisGroup = g.append("g")
        .call(yAxis)
        // remove baseline from the axis
        .call(g => g.select(".domain").remove());
      
    let barsGroup = g.append("g");
  
    function update(manyData) {
      
      // get the number of cars for each origin
    //   const originCounts = d3.rollup(
    //     manyData,
    //     group => group.length,
    //     d => d.year
    //   );
  
      // update x scale
      d3.json("originCounts.json", function(originCounts) {

      x.domain([0, 40]).nice()
  
      // update x axis
  
      const t = svg.transition()
          .ease(d3.easeLinear)
          .duration(200);
  
      xAxisGroup
        .transition(t)
        .call(xAxis);
      
      // draw bars
      barsGroup.selectAll("rect")
        .data(originCounts, ([year, count]) => year)
        .enter()
        .append("rect")
          .attr("fill", ([year, count]) => color(year))
          .attr("height", y.bandwidth())
          .attr("x", 0)
          .attr("y", ([year, count]) => y(year))
        .transition(t)
          .attr("width", ([year, count]) => x(count))
    }
      )};

    return Object.assign(svg.node(), { update })
    
  }
   
// return debug;
function init() {
     console.log("im back");
     createMap();
     const bar = barChart();
     d3.json("manyData.json", function(manyData) {
     bar.update(manyData);});

    //  const scatter = createMap();
    //  const barAll = barChart();
   
    //  // update the bar chart when the scatterplot
    //  // selection changes
    //  d3.select(scatter).on('input', () => {
    //    bar.update(scatter.value);
    //  });
   
    //  // intial state of bar chart
    //  barAll.update(scatter.value);
}

window.onload = init;
