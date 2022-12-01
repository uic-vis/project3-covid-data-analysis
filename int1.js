
function createMap() {



  // update the bar chart when the scatterplot
  // selection changes
//   d3.select(scatter).on('input', () => {
//     // bar.update(scatter.value);
//   });

  // intial state of bar chart
//   bar.update(scatter.value);

    // set up
    var margin = {top: 10, right: 20, bottom: 50, left: 105}, visWidth = 400, visHeight = 400;

    var origins = [2020,2021];

    var color = d3.scaleOrdinal().domain(origins).range(d3.schemeCategory10);

    d3.json("manyData.json", function(manyData) {

    var x = d3.scaleLinear()
      .domain(d3.extent(manyData, d => d.tests)).nice()
      .range([0, visWidth]);

    var y = d3.scaleLinear()
      .domain(d3.extent(manyData, d => d.cases)).nice()
      .range([visHeight, 0]);

    var svg = d3.select("#barchart").append("svg")
        .attr('width', visWidth + margin.left + margin.right)
        .attr('height', visHeight + margin.top + margin.bottom)
        .property('value', manyData);
  
    svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // axes
    svg.append("g")
    .attr('transform', `translate(0, ${visHeight})`)
      // add axis
      .call(d3.axisBottom(x))
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
    .call(x, 'tests');

    svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
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
      .attr('x', -40 + 10)
      .attr('y', visHeight / 2)
      .attr('fill', 'black')
      .attr('dominant-baseline', 'middle')
    .call(y, 'cases');
    
    // draw points
    
    var radius = 3;
    
    var dots = svg.selectAll('circle')
      .data(manyData.filter(d => d.year))
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
    
    svg.append('g')
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

   
// return debug;
function init() {
     console.log("im back");
     createMap();
}

window.onload = init;
