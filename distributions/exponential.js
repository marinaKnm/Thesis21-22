
      var l6 = 1;

      var margin = {top: 20, right: 10, bottom: 20, left: 40};

      var width = 760 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;


      var canvas6 = d3.select("#panel6").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var l6Label = "λ = " + l6;

      document.getElementById("lValDisplay").innerHTML = l6Label;

      // create exponential data points
      var exponDataset = create_exponentialDataSet(l6);

      ////// Define Scales /////////////////
      var xScale6 = d3.scaleLinear()
          .domain([0,16])
          .range([0,width]);
      var yScale6 = d3.scaleLinear()
          .domain([0, 1])
          .range([height, 0]);

      /////// Define Axis //////////////////////////////
      var xAxis6 = d3.axisBottom()
          .scale(xScale6).ticks(17);

      var yAxis6 = d3.axisLeft()
          .scale(yScale6);

      var xAxisGrid6 = d3.axisBottom().scale(xScale6).tickSize(-height).tickFormat('').ticks(17);
      var yAxisGrid6 = d3.axisLeft().scale(yScale6).tickSize(-width).tickFormat('').ticks(10);

      // Create grids.
      canvas6.append('g')
        .attr('class', 'x axis-grid')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxisGrid6);
      canvas6.append('g')
        .attr('class', 'y axis-grid')
        .call(yAxisGrid6);

      // append Axes ///////////////////////////
      canvas6.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis6);

      canvas6.append("g")
          .attr("class", "y axis")
          .call(yAxis6)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("x", -10)
          .attr("dy", "0.71em")
          .attr("fill", "#000");

      canvas6.append("g")  // and create new points(circles) that respond to new exponential data
          .attr("id", "circles")
          .selectAll("circle")
          .data(exponDataset)
          .enter()
          .append("circle")
          .attr("class", "dot2")
          .attr("cx", function(d) {
              return xScale6(d.x);
          })
          .attr("cy", function(d) {
              return yScale6(d.y);
          })
          .attr("r", 0.5);

      // λ slider functionality
      $('#lDiv').on("input", function() {

          var l6 = d3.select('#lSlider').property('value');

          var l6Label = "λ = " + l6;
          document.getElementById("lValDisplay").innerHTML = l6Label;

          var exponDataset = create_exponentialDataSet(l6);

          canvas6.selectAll("#circles").remove(); //remove circles

          canvas6.append("g")  // and create new points(circles) that respond to new exponential data
              .attr("id", "circles")
              .selectAll("circle")
              .data(exponDataset)
              .enter()
              .append("circle")
              .attr("class", "dot2")
              .attr("cx", function(d) {
                  return xScale6(d.x);
              })
              .attr("cy", function(d) {
                  return yScale6(d.y);
              })
              .attr("r", 0.5);

      });

      function create_exponentialDataSet(l) {

          var data = [];

          var temp;
          temp = Math.ceil((16) / 0.0125);

          x_position = 0;
          //for each point find its exponential distribution value
          for (var i = 0; i < temp; i++) {

              data.push({
                  "y": exponPDF(x_position, l),
                  "x": x_position
              });
              x_position += 0.0125;
          }

          return data;
      }

      function exponPDF(x, l) {

        var result;

        var temp = Math.exp((-1)*l*x);
        result = l*temp;

        return result;

      }
