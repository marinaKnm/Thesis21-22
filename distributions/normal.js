
      var mi = 0;
      var sig = 1;

      var margin = {top: 20, right: 10, bottom: 20, left: 40};

      var width = 760 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;


      var canvas7 = d3.select("#panel7").append("svg")  //body
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var miLabel = "μ = " + mi;
      var sigLabel = "σ = " + sig;


      document.getElementById("miValDisplay").innerHTML = miLabel;
      document.getElementById("sigvalue").innerHTML = sigLabel;

      //create normal data points
      var normalDataset7 = create_normalDataSet7(mi, sig);

      ////// Define Scales /////////////////
      var xScale7 = d3.scaleLinear()
          .domain([-20,20])
          .range([0,width]);
      var yScale7 = d3.scaleLinear()
          .domain([0, 1])
          .range([height, 0]);

      /////// Define Axis //////////////////////////////
      var xAxis7 = d3.axisBottom()
          .scale(xScale7).ticks(41);

      var yAxis7 = d3.axisLeft()
          .scale(yScale7);

      var xAxisGrid7 = d3.axisBottom().scale(xScale7).tickSize(-height).tickFormat('').ticks(41);
      var yAxisGrid7 = d3.axisLeft().scale(yScale7).tickSize(-width).tickFormat('').ticks(10);

      // Create grids.
      canvas7.append('g')
        .attr('class', 'x axis-grid')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxisGrid7);
      canvas7.append('g')
        .attr('class', 'y axis-grid')
        .call(yAxisGrid7);

      // append Axes ///////////////////////////
      canvas7.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis7);

      canvas7.append("g")
          .attr("class", "y axis")
          .call(yAxis7)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("x", -10)
          .attr("dy", "0.71em")
          .attr("fill", "#000");


      // append normal data points
      canvas7.append("g")  // and create new points(circles) that respond to new normal data
          .attr("id", "circles")
          .selectAll("circle")
          .data(normalDataset7)
          .enter()
          .append("circle")
          .attr("class", "dot1")
          .attr("cx", function(d) {
              return xScale7(d.x);
          })
          .attr("cy", function(d) {
              return yScale7(d.y);
          })
          .attr("r", 0.5);


      // μ slider functionality
      $('#miDiv').on("input", function() {

          var mi = d3.select('#miSlider').property('value');
          var sig = d3.select('#sigSlider').property('value');

          var miLabel = "μ = " + mi;
          document.getElementById("miValDisplay").innerHTML = miLabel;

          canvas7.selectAll("#circles").remove(); //remove circles

          var normalDataset7 = create_normalDataSet7(mi, sig);

          canvas7.append("g")  // and create new points(circles) that respond to new normal data
              .attr("id", "circles")
              .selectAll("circle")
              .data(normalDataset7)
              .enter()
              .append("circle")
              .attr("class", "dot1")
              .attr("cx", function(d) {
                  return xScale7(d.x);
              })
              .attr("cy", function(d) {
                  return yScale7(d.y);
              })
              .attr("r", 0.5);


      });

      // sigma slider functionality
      $('#sig').on("input", function() {

        var mi = d3.select('#miSlider').property('value');
        var sig = d3.select('#sigSlider').property('value');

        var sigLabel = "σ = " + sig;
        document.getElementById("sigvalue").innerHTML = sigLabel;

        canvas7.selectAll("#circles").remove(); //remove circles

        var normalDataset7 = create_normalDataSet7(mi, sig);

        canvas7.append("g")  // and create new points(circles) that respond to new normal data
            .attr("id", "circles")
            .selectAll("circle")
            .data(normalDataset7)
            .enter()
            .append("circle")
            .attr("class", "dot1")
            .attr("cx", function(d) {
                return xScale7(d.x);
            })
            .attr("cy", function(d) {
                return yScale7(d.y);
            })
            .attr("r", 0.5);

      });


      function create_normalDataSet7(mi, sig) {

          var data = [];

          var temp;
          temp = Math.ceil((40) / 0.0125);
          var sig2 = sig*sig;

          var x_position = -20;
          //for each point find its normal distribution value
          for (var i = 0; i < temp; i++) {

              data.push({
                  "y": normalPDF7(x_position, mi, sig2),
                  "x": x_position
              });
              x_position += 0.0125;
          }

          return data;

      }

      function normalPDF7(k, mi, sig2) {

        var fract = 1/(Math.sqrt(2*Math.PI*sig2));

        var temp = (k-mi);
        temp = temp*temp;

        var epower = 1/(Math.exp(temp/(2*sig2)));

        var result = fract*epower;
        return result;

      }
