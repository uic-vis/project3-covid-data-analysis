function createMap() {
    console.log("hello hey there in map");
    var map = L.map('map', { drawControl: true }).setView([41.881832, -87.623177], 11);

    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    function highlightFeature(e) {
        var layer = e.target;

        var selectedIntersection = layer.feature.properties.ZIPCODE
        layer.bindPopup(selectedIntersection);
        layer.openPopup();
    }


    function clickFeature(e) {
        console.log("on click");

        d3.select("#plot").html("");
        d3.select("#titlebar").html("");
        d3.select("#titlebar").text(e.target.feature.properties.ZIPCODE + " " + "Data");
        d3.select("#beforelabel").html("");
        d3.select("#beforelabel").text("Before Vaccination");
        d3.select("#afterlabel").html("");
        d3.select("#afterlabel").text("After Vaccination");
        d3.select("#legend").style("visibility", "visible");
        // select the svg area
        var data = [
            {when : "Before Vaccination", Cases : e.target.feature.properties.CASES_BEFORE, Tests : e.target.feature.properties.TESTS_BEFORE, Deaths : e.target.feature.properties.DEATHS_BEFORE},
            {when : "After Vaccination", Cases : e.target.feature.properties.CASES_AFTER, Tests : e.target.feature.properties.TESTS_AFTER, Deaths : e.target.feature.properties.DEATHS_AFTER}
        ];
       
        console.log('data', data);

     // set the dimensions and margins of the graph
        var margin = {top: 10, right: 10, bottom: 20, left: 40},
            width = 460,
            height = 500;

        var keys = ["Cases", "Tests", "Deaths"];
        var groupKey = "when";

        var color = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888"]);
        

        var svg = d3.select("#plot")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var x0 = d3.scaleBand()
        .domain(data.map(d => d[groupKey]))
        .rangeRound([margin.left, width - margin.right])
        .paddingInner(0.1);

        var x1 = d3.scaleBand()
        .domain(keys)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05);

        var y = d3.scaleLinear()
                  .domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice()
                  .rangeRound([height - margin.bottom, margin.top]);

       var xAxis = g => g.attr("transform", `translate(0,${height - margin.bottom + 50})`)
                         .call(d3.axisBottom(x0).tickSizeOuter(10))
                         .call(g => g.select(".domain").remove());

        var yAxis = g => g.attr("transform", `translate(${margin.left},0)`)
                          .call(d3.axisLeft(y).ticks(null, "s"))
                          .call(g => g.select(".domain").remove())
                          .call(g => g.select(".tick:last-of-type text").clone()
                          .attr("x", 3)
                          .attr("text-anchor", "start")
                          .attr("font-weight", "bold")
                          .text(data.y));

        svg.append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${x0(d[groupKey])},0)`)
    .selectAll("rect")
    .data(d => keys.map(key => ({key, value: d[key]})))
    .enter().append("rect")
    .attr("x", d => x1(d.key))
      .attr("y", d => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => 100 + y(0) - y(d.value))
      .attr("fill", d => color(d.key));

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            click: clickFeature
        });        
    }

    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    var geojson = L.geoJson(violations, { onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }

    }).addTo(map);
}

function init() {
    console.log("im back");
    createMap();
}

window.onload = init;
