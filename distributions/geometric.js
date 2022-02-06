
      var p3 = 0.5;

      var margin = {top: 20, right: 10, bottom: 20, left: 40};

      var width = 760 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;


      var canvas3 = d3.select("#panel3").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var pLabel3 = "p = " + p3;


      document.getElementById("prodvalue3").innerHTML = pLabel3;

      //create geometric data points
      var geomDataset = create_geometricDataSet(p3);


      ////// Define Scales /////////////////
      var xScale3 = d3.scaleLinear()
          .domain([0,16])
          .range([0,width]);
      var yScale3 = d3.scaleLinear()
          .domain([0, 1])
          .range([height, 0]);

      /////// Define Axis //////////////////////////////
      var xAxis3 = d3.axisBottom()
          .scale(xScale3).ticks(17);

      var yAxis3 = d3.axisLeft()
          .scale(yScale3);

      var xAxisGrid3 = d3.axisBottom().scale(xScale3).tickSize(-height).tickFormat('').ticks(17);
      var yAxisGrid3 = d3.axisLeft().scale(yScale3).tickSize(-width).tickFormat('').ticks(10);

      // Create grids.
      canvas3.append('g')
        .attr('class', 'x axis-grid')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxisGrid3);
      canvas3.append('g')
        .attr('class', 'y axis-grid')
        .call(yAxisGrid3);

      // append Axes ///////////////////////////
      canvas3.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis3);

      canvas3.append("g")
          .attr("class", "y axis")
          .call(yAxis3)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("x", -10)
          .attr("dy", "0.71em")
          .attr("fill", "#000");


      // append geometric data points
      canvas3.append("g")
          .attr("id", "rects")
          .selectAll(".geombar")
          .data(geomDataset)
          .enter()
          .append("rect")
          .attr("class", "geombar")
          .attr("x", function(d) {
             return xScale3(d.x);
          })
          .attr('width',  6)
          .attr("y", function(d) {
              return yScale3(d.y);
          })
          .attr("height", function(d) {
              return height - yScale3(d.y);
          });

      // p slider functionality
      $('#prod3').on("input", function() {

          var p3 = d3.select('#probSlider3').property('value');

          var pLabel3 = "p = " + p3;
          document.getElementById("prodvalue3").innerHTML = pLabel3;

          canvas3.selectAll("#rects").remove(); //remove bars

          var geomDataset = create_geometricDataSet(p3);

          canvas3.append("g")
              .attr("id", "rects")
              .selectAll(".geombar")
              .data(geomDataset)
              .enter()
              .append("rect")
              .attr("class", "geombar")
              .attr("x", function(d) {
                 return xScale3(d.x);
              })
              .attr('width',  6)
              .attr("y", function(d) {
                  return yScale3(d.y);
              })
              .attr("height", function(d) {
                  return height - yScale3(d.y);
              });

      });

      function create_geometricDataSet(p) {

          var data = [];

          for (var i = 0; i <= 16; i++) {

              data.push({
                  "y": geomPDF(i, p),
                  "x": i-0.05
              });
          }

          return data;
      }

      function geomPDF(k, p) {

          var failure = 1-p;
          var result;

          var temp = 1;
          for (var i = 1; i <= k; i++) {
            temp = temp*failure;
          }

          result = temp*p;
          return result;

      }
