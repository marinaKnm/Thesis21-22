
      var n = 16;
      var p = 0.25;

      var margin = {top: 20, right: 10, bottom: 20, left: 40};

      var width = 760 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;


      var canvas1 = d3.select("#panel1").append("svg")  //body
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var nLabel = "n = " + n;
      var pLabel = "p = " + p;


      document.getElementById("nValDisplay").innerHTML = nLabel;
      document.getElementById("prodvalue").innerHTML = pLabel;

      //create binomial data points
      var binomDataset = create_binomialDataSet(n, p);

      ////// Define Scales /////////////////
      var xScale1 = d3.scaleLinear()
          .domain([0,binomDataset.length-1])
          .range([0,width]);
      var yScale1 = d3.scaleLinear()
          .domain([0, 1])
          .range([height, 0]);

      /////// Define Axis //////////////////////////////
      var xAxis1 = d3.axisBottom()
          .scale(xScale1).ticks(n+1);

      var yAxis1 = d3.axisLeft()
          .scale(yScale1);

      var xAxisGrid1 = d3.axisBottom().scale(xScale1).tickSize(-height).tickFormat('').ticks(n+1);
      var yAxisGrid1 = d3.axisLeft().scale(yScale1).tickSize(-width).tickFormat('').ticks(10);

      // Create grids.
      canvas1.append('g')
        .attr('class', 'x axis-grid')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxisGrid1);
      canvas1.append('g')
        .attr('class', 'y axis-grid')
        .call(yAxisGrid1);

      // append Axes ///////////////////////////
      canvas1.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis1);

      canvas1.append("g")
          .attr("class", "y axis")
          .call(yAxis1)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("x", -10)
          .attr("dy", "0.71em")
          .attr("fill", "#000");


      // append binomial data points
      canvas1.append("g")
          .attr("id", "rects")
          .selectAll(".binbar")
          .data(binomDataset)
          .enter()
          .append("rect")
          .attr("class", "binbar")
          .attr("x", function(d) {
             return xScale1(d.x);
          })
          .attr('width',  6)
          .attr("y", function(d) {
              return yScale1(d.y);
          })
          .attr("height", function(d) {
              return height - yScale1(d.y);
          });

      // n slider functionality
      $('#nDiv').on("input", function() {

          var n = d3.select('#nSlider').property('value');
          var p = d3.select('#probSlider').property('value');

          var nLabel = "n = " + n;
          document.getElementById("nValDisplay").innerHTML = nLabel;

          update_BinomGraph(n, p);

          // if Poisson checkbox is checked update Poisson graph
          var checkBox = document.getElementById("poiCheck");
          if (checkBox.checked == true) {
               // remove existing poisson bars
               canvas1.selectAll("#poirects").remove();
               // update poisson graph
               update_PoissonGraph(n, p);
          }

          // if Normal checkbox is checked update Normal graph
          var checkBox2 = document.getElementById("normCheck");
          if (checkBox2.checked == true) {
            // remove existing Normal points
            canvas1.selectAll("#circles").remove();
            // update Normal graph
            update_NormalGraph(n, p);
          }

      });

      // p slider functionality
      $('#prod').on("input", function() {

          var n = d3.select('#nSlider').property('value');
          var p = d3.select('#probSlider').property('value');

          var pLabel = "p = " + p;
          document.getElementById("prodvalue").innerHTML = pLabel;

          update_BinomGraph(n, p);

          // if Poisson checkbox is checked update Poisson graph
          var checkBox = document.getElementById("poiCheck");
          if (checkBox.checked == true) {
            // remove existing poisson bars
            canvas1.selectAll("#poirects").remove();
            // update poisson graph
            update_PoissonGraph(n, p);
          }

          // if Normal checkbox is checked update Normal graph
          var checkBox2 = document.getElementById("normCheck");
          if (checkBox2.checked == true) {
            // remove existing Normal points
            canvas1.selectAll("#circles").remove();
            // update Normal graph
            update_NormalGraph(n, p);
          }

      });

      // implementation of checkbox(named Poisson) that when is checked appears Poisson distribution, otherwise disappears Poisson distribution
      function poissonFun() {

        var n = d3.select('#nSlider').property('value');
        var p = d3.select('#probSlider').property('value');

        var checkBox = document.getElementById("poiCheck");

        // when Poisson checkbox is checked
        if (checkBox.checked == true) {
          update_PoissonGraph(n, p);

        } else { // when Poisson checkbox is unchecked
          canvas1.selectAll("#poirects").remove(); //remove poisson bars
        }

      }

      // implementation of checkbox(named Normal) that when is checked appears Normal distribution, otherwise disappears Normal distribution
      function normalFun() {

        var n = d3.select('#nSlider').property('value');
        var p = d3.select('#probSlider').property('value');

        var checkBox = document.getElementById("normCheck");

        // when Normal checkbox is checked
        if (checkBox.checked == true) {
          update_NormalGraph(n, p);

        } else { // when Normal checkbox is unchecked
          canvas1.selectAll("#circles").remove(); //remove normal points
        }

      }


      function update_BinomGraph(n, p) {

          // create binomial new data
          var binomDataset = create_binomialDataSet(n, p);
          var dur = 50;

          //Update scale domains
          if (n >= 16) {  //we want n+1 indexes (from 0 to n) at x axis when n>=16
            xScale1.domain([0,binomDataset.length-1]);

            canvas1.selectAll(".x.axis-grid").remove();

            xAxis1.tickValues(d3.range(0, n+1, 1));

            var xAxisGrid1 = d3.axisBottom().scale(xScale1).tickSize(-height).tickFormat('').ticks(n);

            canvas1.append('g')
              .attr('class', 'x axis-grid')
              .attr('transform', 'translate(0,' + height + ')')
              .call(xAxisGrid1);

            // update axis
            canvas1.select(".x.axis")
                .transition()
                .duration(dur)
                .call(xAxis1);

            canvas1.select(".y.axis")
                .transition()
                .duration(dur)
                .call(yAxis1);

          }

          // update binomial data points

          canvas1.selectAll("#rects").remove(); //remove bars

          canvas1.append("g")  // and create new bars that respond to new binomial data
              .attr("id", "rects")
              .selectAll(".binbar")
              .data(binomDataset)
              .enter()
              .append("rect")
              .attr("class", "binbar")
              .attr("x", function(d) {
                 return xScale1(d.x);
              })
              .attr('width', 6)
              .attr("y", function(d) {
                  return yScale1(d.y);
              })
              .attr("height", function(d) {
                  return height - yScale1(d.y);
              });
      }


      // pdf = probability density function
      // cdf = cumulative distribution function

      function create_binomialDataSet(n, p) {

          var data = [];

          for (var i = 0; i <= n; i++) {

              data.push({
                  "y": binomialPDF(i, n, p),
                  "x": i-0.05
              });
          }

          return data;
      }

      function binomialPDF(k, n, p) {

          var failure = 1-p;
          var result = 1;
          var resp = 1;

          var fact = 1;
          for (var i = 1; i <= k; i++) {
            fact = fact*i;
            result = result*(n-(i-1));
            resp = resp*p;
          }

          result = result/fact;
          result = result*resp;

          resp = 1;
          for (var i = 1; i <= n-k; i++) {
            resp = resp*failure;
          }

          result = result*resp;
          return result;

      }


      function update_PoissonGraph(n, p) {

          // create poisson new data
          var poissonDataset = create_poissonDataSet(n, p);

          canvas1.append("g")  // and create new bars that respond to new poisson data
              .attr("id", "poirects")
              .selectAll(".poibar")
              .data(poissonDataset)
              .enter()
              .append("rect")
              .attr("class", "poibar")
              .attr("x", function(d) {
                 return xScale1(d.x);
              })
              .attr('width', 6)
              .attr("y", function(d) {
                  return yScale1(d.y);
              })
              .attr("height", function(d) {
                  return height - yScale1(d.y);
              });

      }


      function create_poissonDataSet(n, p) {
          var data = [];
          var l = n*p;

          for (var i = 0; i <= n; i++) {

              data.push({
                  "y": poissonPDF(i, l),
                  "x": i-0.05
              });
          }

          return data;
      }

      function poissonPDF(k, l) {

          var lpower = 1;
          for (var i = 1; i <= k; i++) {
            lpower = lpower*l;
          }

          var xfactor = 1;
          for (var i = 1; i <= k; i++) {
            xfactor = xfactor*i;
          }

          var epower = 1/(Math.exp(l));

          var result = lpower*epower;
          result = result/xfactor;

          return result;

      }


      function update_NormalGraph(n, p) {

          if (p == 0 || p == 1 || n == 0) {
            canvas1.selectAll("#circles").remove();

          } else {

            // create normal new data
            var normalDataset = create_normalDataSet(n, p);

            canvas1.append("g")  // and create new points(circles) that respond to new normal data
                .attr("id", "circles")
                .selectAll("circle")
                .data(normalDataset)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("cx", function(d) {
                    return xScale1(d.x);
                })
                .attr("cy", function(d) {
                    return yScale1(d.y);
                })
                .attr("r", 0.5);

          }

      }


      function create_normalDataSet(n, p) {

          var data = [];
          var mean = n*p;
          var variance = n*p*(1-p);

          var temp;
          if (n < 16) {
            temp = Math.ceil((16) / 0.0125);
          } else {
            temp = Math.ceil((n) / 0.0125);
          }

          x_position = 0;
          //for each point find its normal distribution value
          for (var i = 0; i < temp; i++) {

              data.push({
                  "y": normalPDF(x_position, mean, variance),
                  "x": x_position
              });
              x_position += 0.0125;
          }
          return data;
      }


      function normalPDF(k, mean, variance) {

          var fract = 1/(Math.sqrt(2*Math.PI*variance));

          var temp = (k-mean);
          temp = temp*temp;

          var epower = 1/(Math.exp(temp/(2*variance)));

          var result = fract*epower;
          return result;

      }
