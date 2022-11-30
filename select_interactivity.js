import sortedPopulation from "/Theft.json" assert {type: 'json'};

function createBarandLineChart(){
    data = FileAttachment("preprocessed_covid_data.csv").csv();

covid_data = data.map(d => ({
    cases: d['Cases - Weekly'],
    zipCode: d['ZIP Code'],
    population : d['Population'],
    month: d['Week Start'].split("-")[1]
  }));

  //Sums the population for each Zip Code
pop_zip = d3.rollups(covid_data, v => d3.sum(v, d => d.population), d => d.zipCode);

//Populatiom sorted for bar chart
sortedPopulation = pop_zip.sort((a, b) => b[1] - a[1]);

//Sliced the top 10 zipCodes based on population
slicedSortedPopulation = sortedPopulation.slice(0,10); //used for the barchart

//To label the X-axis
zipcodes = slicedSortedPopulation.map(d => d[0]);

zipMonthSum = FileAttachment("new_one.csv").csv();

zip_month_sum = zipMonthSum.map(d => ({
    cases: d['Cases - Weekly'],
    zipCode: d['ZIP Code'],
    month: d['Month']
  }));

  // Data grouped based on zip code and months using pandas
groupedData = d3.groups(zip_month_sum, d => d.zipCode);

function barChart() {
    const svg = d3.select(DOM.svg(width, height));
    svg.attr("id", "bar-chart");
    
    // setup and draw x-axis
    const districtScale = d3.scaleBand()
      .domain(zipcodes)
      .range([0, innerWidth])
      .paddingInner(0.1)
      .paddingOuter(0.1);
    
    const districtAxis = d3.axisBottom(districtScale)
      .tickSize(0)
      .tickPadding(5);
    
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
      .call(districtAxis);  
    
    // setup and draw y-axis
    const totalScale = d3.scaleLinear()
      .domain([7827485, 11520550])
      .range([innerHeight, 0])
      .nice();
    
    const totalAxis = d3.axisLeft(totalScale)
      .ticks(10)
      .tickFormat(d3.formatPrefix(",.0", 1000));
    
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(totalAxis);  
    
    // add bars using scales
    svg.insert("g", ":first-child")
      .attr("id", "bars")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .selectAll("rect")
      .data(sortedPopulation)
      .enter()
        .append("rect")
        .attr("x", d => districtScale(d[0]))
        .attr("y", d => totalScale(d[1]))
        .attr("width", districtScale.bandwidth())
        .attr("height", d => innerHeight - totalScale(d[1]))
        .style("fill", "lightgray");
    
    return svg.node();
  }


  function lineChart() {
    const svg = d3.select(DOM.svg(width, height));
    svg.attr("id", "line-chart");
    
    // setup and draw x-axis
    const dateScale = d3.scaleLinear()
      .domain(d3.extent(covid_data, d => d.month))
      .range([0, innerWidth])
      .nice();
    
    const dateAxis = d3.axisBottom(dateScale);
    
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
      .call(dateAxis);
    
    // setup and draw y-axis
    const countScale = d3.scaleLinear()
      .domain([200, 7000])
      .range([innerHeight, 0])
      .nice();
    
    const countAxis = d3.axisLeft(countScale)
      .ticks(8);
    
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(countAxis);
    
    // draw lines for each neighborhood
    const line = d3.line()
      .x(d => dateScale(d.month))
      .y(d => countScale(d.cases));
  
    svg.insert("g", ":first-child")
      .attr("id", "lines")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .selectAll("path")
      .data(groupedData)
      .enter()
      .append("path")
      .attr("d", d => line(d[1]))
      .style("stroke", "lightgray");
    
    return svg.node();
  }

  {
    const bars = d3.select(barChart)
        .select("g#bars")
        .selectAll("rect")
        .data(sortedPopulation);
          
    const lines = d3.select(lineChart)
      .select("g#lines")
      .selectAll("path")
      .data(groupedData);
          
    const debug = html`<p>${bars.size()} bars selected</p>`;
  
    bars.on("mouseover", function(d) {
      d3.select(this)
        .transition()
        .style("fill", "lightseagreen");
      
      lines.filter(e => e[0] == d[0])
        .raise()
        .transition()
        .style("stroke", "lightseagreen")
        .style("stroke-width", "3px");
      
      d3.select(debug).text(`Bar: ${d[0]}`);
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
    
    return debug;
  }

  height = 250;
  margin = ({
    top: 10, bottom: 25,
    left: 50, right: 10
  });

  innerWidth = width - margin.left - margin.right;

  innerHeight = height - margin.top - margin.bottom;

}
function init() {
    console.log("im task4");
    createBarandLineChart();
}

window.onload = init;
