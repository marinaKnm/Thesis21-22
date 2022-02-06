
      var p4 = 0.5;

      var margin = {top: 20, right: 10, bottom: 20, left: 40};

      var width = 760 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;


      var canvas4 = d3.select("#panel4").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var pLabel4 = "p = " + p4;


      document.getElementById("prodvalue4").innerHTML = pLabel4;

      //create bernoulli data points
      var bernDataset = create_bernoulliDataSet(p4);

      ////// Define Scales /////////////////
      var xScale4 = d3.scaleLinear()
          .domain([0,16])
          .range([0,width]);
      var yScale4 = d3.scaleLinear()
          .domain([0, 1])
          .range([height, 0]);

      /////// Define Axis //////////////////////////////
      var xAxis4 = d3.axisBottom()
          .scale(xScale4).ticks(17);

      var yAxis4 = d3.axisLeft()
          .scale(yScale4);

      var xAxisGrid4 = d3.axisBottom().scale(xScale4).tickSize(-height).tickFormat('').ticks(17);
      var yAxisGrid4 = d3.axisLeft().scale(yScale4).tickSize(-width).tickFormat('').ticks(10);

      // Create grids.
      canvas4.append('g')
        .attr('class', 'x axis-grid')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxisGrid4);
      canvas4.append('g')
        .attr('class', 'y axis-grid')
        .call(yAxisGrid4);

      // append Axes ///////////////////////////
      canvas4.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis4);

      canvas4.append("g")
          .attr("class", "y axis")
          .call(yAxis4)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("x", -10)
          .attr("dy", "0.71em")
          .attr("fill", "#000");

      // append bernoulli data points
      canvas4.append("g")
          .attr("id", "rects")
          .selectAll(".bernbar")
          .data(bernDataset)
          .enter()
          .append("rect")
          .attr("class", "bernbar")
          .attr("x", function(d) {
             return xScale4(d.x);
          })
          .attr('width',  6)
          .attr("y", function(d) {
              return yScale4(d.y);
          })
          .attr("height", function(d) {
              return height - yScale4(d.y);
          });


      // p slider functionality
      $('#prod4').on("input", function() {

          var p4 = d3.select('#probSlider4').property('value');

          var pLabel4 = "p = " + p4;
          document.getElementById("prodvalue4").innerHTML = pLabel4;

          canvas4.selectAll("#rects").remove(); //remove bars

          var bernDataset = create_bernoulliDataSet(p4);

          canvas4.append("g")
              .attr("id", "rects")
              .selectAll(".bernbar")
              .data(bernDataset)
              .enter()
              .append("rect")
              .attr("class", "bernbar")
              .attr("x", function(d) {
                 return xScale4(d.x);
              })
              .attr('width',  6)
              .attr("y", function(d) {
                  return yScale4(d.y);
              })
              .attr("height", function(d) {
                  return height - yScale4(d.y);
              });

      });


      function create_bernoulliDataSet(p) {

          var data = [];

          for (var i = 0; i <= 16; i++) {

              data.push({
                  "y": bernPDF(i, p),
                  "x": i-0.05
              });
          }

          return data;
      }

      function bernPDF(k, p) {

          if (k == 1) {
            return p;
          }
          else if (k == 0) {
            return 1-p;
          }
          else {
            return 0;
          }

      }
