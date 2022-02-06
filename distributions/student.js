
      var df = 16; // degrees of freedom

      var margin = {top: 20, right: 10, bottom: 20, left: 40};

      var width = 760 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;


      var canvas2 = d3.select("#panel2").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var dfLabel = "βαθμοί ελευθερίας = " + df;

      document.getElementById("dfValDisplay").innerHTML = dfLabel;

      // create student data points
      var studentDataset = create_studentDataSet(df);

      ////// Define Scales /////////////////
      var xScale2 = d3.scaleLinear()
          .domain([-7,7])
          .range([0,width]);
      var yScale2 = d3.scaleLinear()
          .domain([0, 1])
          .range([height, 0]);

      /////// Define Axis //////////////////////////////
      var xAxis2 = d3.axisBottom()
          .scale(xScale2).ticks(15);

      var yAxis2 = d3.axisLeft()
          .scale(yScale2);

      var xAxisGrid2 = d3.axisBottom().scale(xScale2).tickSize(-height).tickFormat('').ticks(15);
      var yAxisGrid2 = d3.axisLeft().scale(yScale2).tickSize(-width).tickFormat('').ticks(10);

      // Create grids.
      canvas2.append('g')
        .attr('class', 'x axis-grid')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxisGrid2);
      canvas2.append('g')
        .attr('class', 'y axis-grid')
        .call(yAxisGrid2);

      // append Axes ///////////////////////////
      canvas2.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis2);

      canvas2.append("g")
          .attr("class", "y axis")
          .call(yAxis2)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("x", -10)
          .attr("dy", "0.71em")
          .attr("fill", "#000");

      canvas2.append("g")  // and create new points(circles) that respond to new student data
          .attr("id", "circles")
          .selectAll("circle")
          .data(studentDataset)
          .enter()
          .append("circle")
          .attr("class", "dot")
          .attr("cx", function(d) {
              return xScale2(d.x);
          })
          .attr("cy", function(d) {
              return yScale2(d.y);
          })
          .attr("r", 0.5);

      var normal01Dataset = create_normal01DataSet();

      // df slider functionality
      $('#dfDiv').on("input", function() {

          var df = d3.select('#dfSlider').property('value');

          var dfLabel = "βαθμοί ελευθερίας = " + df;
          document.getElementById("dfValDisplay").innerHTML = dfLabel;

          df = parseInt(df);

          var studentDataset = create_studentDataSet(df);

          canvas2.selectAll("#circles").remove(); //remove circles

          canvas2.append("g")  // and create new points(circles) that respond to new student data
              .attr("id", "circles")
              .selectAll("circle")
              .data(studentDataset)
              .enter()
              .append("circle")
              .attr("class", "dot")
              .attr("cx", function(d) {
                  return xScale2(d.x);
              })
              .attr("cy", function(d) {
                  return yScale2(d.y);
              })
              .attr("r", 0.5);

      });


      function create_studentDataSet(df) { // df = degrees of freedom

          var confr; // confr is the constant fraction Γ((v+1)/2)/(sqrt(vπ)Γ(v/2))

          if (df%2 == 0) { // if df is even
            var numerator = 1;
            var denominator = 2*Math.sqrt(df);
            for (var i = df-1; i >= 2; i--) {
              if (i%2 == 0) {
                denominator = denominator*i;
              } else if (i%2 != 0) {
                numerator = numerator*i;
              }
            }
            confr = numerator/denominator;

          } else {     // if df is odd
            var numerator = 1;
            var denominator = Math.PI*Math.sqrt(df);
            for (var i = df-1; i >= 2; i--) {
              if (i%2 == 0) {
                numerator = numerator*i;
              } else if (i%2 != 0) {
                denominator = denominator*i;
              }
            }
            confr = numerator/denominator;

          }

          var data = [];

          var temp;
          temp = Math.ceil((14) / 0.0125);

          x_position = -7;
          //for each point find its student distribution value
          for (var i = 0; i < temp; i++) {

              data.push({
                  "y": studentPDF(x_position, df, confr),
                  "x": x_position
              });
              x_position += 0.0125;
          }

          return data;
      }

      function studentPDF(t, df, fraction) {

        var result;

        var base = (1 + ((t*t)/df));
        var exponent = -((df+1)/2);
        var temp = Math.pow(base, exponent); // Math.pow(base, exponent)
        result = fraction*temp;

        return result;

      }


      // implementation of checkbox(named Normal(0,1)) that when is checked appears Normal(0,1) distribution, otherwise disappears Normal(0,1) distribution
      function normal01Fun() {

        var checkBox = document.getElementById("normCheck01");

        // when Normal(0,1) checkbox is checked
        if (checkBox.checked == true) {

          canvas2.append("g")  // and create new points(circles) that respond to normal(0,1) data
              .attr("id", "circles1")
              .selectAll("circle")
              .data(normal01Dataset)
              .enter()
              .append("circle")
              .attr("class", "dot1")
              .attr("cx", function(d) {
                  return xScale2(d.x);
              })
              .attr("cy", function(d) {
                  return yScale2(d.y);
              })
              .attr("r", 0.5);

        } else { // when Normal(0,1) checkbox is unchecked
          canvas2.selectAll("#circles1").remove(); //remove normal(0,1) points
        }

      }


      function create_normal01DataSet() {

          var data = [];
          var mean = 0;
          var variance = 1;

          var temp;
          temp = Math.ceil((14) / 0.0125);

          x_position = -7;
          //for each point find its normal(0,1) distribution value
          for (var i = 0; i < temp; i++) {

              data.push({
                  "y": normal01PDF(x_position, mean, variance),
                  "x": x_position
              });
              x_position += 0.0125;
          }
          return data;
      }


      function normal01PDF(k, mean, variance) {

          var fract = 1/(Math.sqrt(2*Math.PI*variance));

          var temp = (k-mean);
          temp = temp*temp;

          var epower = 1/(Math.exp(temp/(2*variance)));

          var result = fract*epower;
          return result;

      }
