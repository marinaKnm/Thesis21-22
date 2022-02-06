
      var a = -5;
      var b = 5;

      var margin = {top: 20, right: 10, bottom: 20, left: 40};

      var width = 760 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;


      var canvas5 = d3.select("#panel5").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var aLabel = "a = " + a;
      var bLabel = "b = " + b;


      document.getElementById("aValDisplay").innerHTML = aLabel;
      document.getElementById("bValDisplay").innerHTML = bLabel;

      //create uniform data points
      var uniformDataset = create_uniformDataSet(a, b);

      ////// Define Scales /////////////////
      var xScale5 = d3.scaleLinear()
          .domain([-10,10])
          .range([0,width]);
      var yScale5 = d3.scaleLinear()
          .domain([0, 1])
          .range([height, 0]);

      /////// Define Axis //////////////////////////////
      var xAxis5 = d3.axisBottom()
          .scale(xScale5).ticks(21);

      var yAxis5 = d3.axisLeft()
          .scale(yScale5);

      var xAxisGrid5 = d3.axisBottom().scale(xScale5).tickSize(-height).tickFormat('').ticks(21);
      var yAxisGrid5 = d3.axisLeft().scale(yScale5).tickSize(-width).tickFormat('').ticks(10);

      // Create grids.
      canvas5.append('g')
        .attr('class', 'x axis-grid')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxisGrid5);
      canvas5.append('g')
        .attr('class', 'y axis-grid')
        .call(yAxisGrid5);

      // append Axes ///////////////////////////
      canvas5.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis5);

      canvas5.append("g")
          .attr("class", "y axis")
          .call(yAxis5)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("x", -10)
          .attr("dy", "0.71em")
          .attr("fill", "#000");


      // append uniform data points
      canvas5.append("g")  // and create new points(circles) that respond to new uniform data
          .attr("id", "circles")
          .selectAll("circle")
          .data(uniformDataset)
          .enter()
          .append("circle")
          .attr("class", "dot3")
          .attr("cx", function(d) {
              return xScale5(d.x);
          })
          .attr("cy", function(d) {
              return yScale5(d.y);
          })
          .attr("r", 0.5);

      // a slider functionality
      $('#aDiv').on("input", function() {

          var a = d3.select('#aSlider').property('value');
          var b = d3.select('#bSlider').property('value');

          var aLabel = "a = " + a;
          document.getElementById("aValDisplay").innerHTML = aLabel;

          canvas5.selectAll("#circles").remove(); //remove circles

          var uniformDataset = create_uniformDataSet(a, b);

          canvas5.append("g")  // and create new points(circles) that respond to new uniform data
              .attr("id", "circles")
              .selectAll("circle")
              .data(uniformDataset)
              .enter()
              .append("circle")
              .attr("class", "dot3")
              .attr("cx", function(d) {
                  return xScale5(d.x);
              })
              .attr("cy", function(d) {
                  return yScale5(d.y);
              })
              .attr("r", 0.5);


      });

      // b slider functionality
      $('#bDiv').on("input", function() {

        var a = d3.select('#aSlider').property('value');
        var b = d3.select('#bSlider').property('value');

          var bLabel = "b = " + b;
          document.getElementById("bValDisplay").innerHTML = bLabel;

          canvas5.selectAll("#circles").remove(); //remove circles

          var uniformDataset = create_uniformDataSet(a, b);

          canvas5.append("g")  // and create new points(circles) that respond to new uniform data
              .attr("id", "circles")
              .selectAll("circle")
              .data(uniformDataset)
              .enter()
              .append("circle")
              .attr("class", "dot3")
              .attr("cx", function(d) {
                  return xScale5(d.x);
              })
              .attr("cy", function(d) {
                  return yScale5(d.y);
              })
              .attr("r", 0.5);

      });



      function create_uniformDataSet(a, b) {

          var data = [];

          var temp;
          temp = Math.ceil((20) / 0.0125);

          var x_position = -10;
          //for each point find its uniform distribution value
          for (var i = 0; i < temp; i++) {

              data.push({
                  "y": uniformPDF(x_position, a, b),
                  "x": x_position
              });
              x_position += 0.0125;
          }

          return data;

      }

      function uniformPDF(k, a, b) {

          if (k >= a && k <= b) {
            if (a == 0 && b == 0) {
              return 1/0.008;
            }
            return 1/(b-a);
          }
          else {
            return 0;
          }

      }
