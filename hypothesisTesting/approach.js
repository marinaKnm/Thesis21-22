////////////////////////////////////////////////////
  var interval = 0.025;
  var upper_bound = 5.0;
  var lower_bound = -5.0;
  var mean = 0;
  var std = 1;

  var margin = {top: 20, right: 10, bottom: 20, left: 0};

  var width = 360 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

  //create standard normal data points
  var standard_Dataset = create_data(interval, upper_bound, lower_bound, mean, std);

  ////// Define Scales /////////////
  var xScale = d3.scaleLinear()
      .domain([d3.min(standard_Dataset, function(d) {
          return d.x;
      }), d3.max(standard_Dataset, function(d) {
          return d.x;
      })])
      .range([0,width]);
  var yScale = d3.scaleLinear()
      .domain([
          d3.min(standard_Dataset, function(d) {
              return (d.y);
          }),
          d3.max(standard_Dataset, function(d) {
              return d.y;
          })
      ])
      .range([height,0]);


  ////// Define Axis   /////////////

  var yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(0);

////////////////////////////////////////////////////

  var h0_sign; // ">=" -> lower, "<=" -> upper or "=" -> equal
  var m0;
  var fill_const = 1; // 3 possible values: value 1 corresponds to left tail case,
                      //                    value 2 corresponds to right tail case,
                      //                    value 3 corresponds to two tailed case.

  function tailsigns() {
    h0_sign = document.getElementById("tail").value;
    if (h0_sign == "lower") {
      document.getElementById("ha_operator").innerHTML = "<";
      fill_const = 1;
    }
    else if (h0_sign == "upper") {
      document.getElementById("ha_operator").innerHTML = ">";
      fill_const = 2;
    }
    else if (h0_sign == "equal") {
      document.getElementById("ha_operator").innerHTML = "\u2260";
      fill_const = 3;
    }
    // console.log(fill_const);
  }

  function muknotval() {
    m0 = document.getElementById("muknot").value;
    document.getElementById("muknotvalue").innerHTML = m0;
  }

  $('#hyptest').click(function() {

    var n = $("#size").val();
    n = parseInt(n);
    var avg = $("#xbar").val();
    avg = parseFloat(avg);
    var deviation = $("#stdev").val(); // standard deviation
    deviation = parseFloat(deviation);
    var a = $("#alpha").val();
    a = parseFloat(a);

    if ($("#parameter1").val() == "mean") { // testing for mean
      var z_t = (avg - m0)*Math.sqrt(n);
      z_t = z_t/deviation; // z or t
      z_t = (Math.round(z_t*100)/100);
      var result;
      var pValue; //EDW THA EXOUME TO APOTELESMA p-value !!!!<----

      if ($("#sigma").val() == "known") { //testing for known variance

        result = '$$z = \\frac{\\bar{x} - μ_0}{σ/\\sqrt[2]{n}} = ' + z_t + '$$';
        $("#performance").html(result);
        MathJax.typesetPromise();
        $("#df").empty();

        if (fill_const == 3 && z_t > 0) { //AN TO fill_const EINAI 3 THA XREIASTOUME TO P(z <= -|z_t|) !!!!<----
          pValue = jStat.normal.cdf((-1)*z_t, mean, std);
        } else { // GIA OPOIADHPOTE ALLH PERIPTWSH THA XREIASTOYME TO P(z <= z_t)  !!!!<----
          pValue = jStat.normal.cdf(z_t, mean, std);
        }

      } else { //testing for unknown variance

        result = '$$t = \\frac{\\bar{x} - μ_0}{s/\\sqrt[2]{n}} = ' + z_t + '$$';
        $("#performance").html(result);
        MathJax.typesetPromise();
        $("#df").empty();

        var df = n - 1;
        var s = "Βαθμοί Ελευθερίας = n - 1 = " + df;
        $('#df').append('<p>'+ s +'</p>').css("margin", "auto");

        if (fill_const == 3 && z_t > 0) { //AN TO fill_const EINAI 3 THA XREIASTOUME TO P(t <= -|z_t|) !!!!<----
          pValue = jStat.studentt.cdf((-1)*z_t, n-1); // n-1 = df
        } else { // GIA OPOIADHPOTE ALLH PERIPTWSH THA XREIASTOYME TO P(t <= z_t)  !!!!<----
          pValue = jStat.studentt.cdf(z_t, n-1); // n-1 = df
        }

      }

      if (fill_const == 2) { //AN TO fill_const EINAI 2 THA XREIASTOUME TO P(x >= z_t) = 1 - P(x <= z_t) OPOY x EINAI z OR t !!!!<----
        pValue = 1-pValue;
      } else if (fill_const == 3) { //AN TO fill_const EINAI 3 THA XREIASTOUME TO 2*P(x <= -|z_t|) !!!!<----
        pValue = 2*pValue;
      }

      $('#p_value').empty();
      $('#crit_value').empty();

      console.log(z_t,fill_const);
      var xAxis_p = defineXaxis(z_t, fill_const);

      var div = document.getElementById('p_value');
      div.innerHTML += "<h4><strong>Προσέγγιση με p-τιμή</strong></h4>";
      var svg1 = create_canvas("#p_value", xAxis_p);
      div.innerHTML = div.innerHTML + "<p>p-value = " + (pValue.toFixed(5)).toString() + "</p>"; //pValue.toString() !!!!<----
      div.innerHTML = div.innerHTML + "<p>Κανόνας Απόρριψης: Απόρριψε την " +"H₀" +" αν p-value "+"&#8804"+ " α</p>"; // !!!!<----
      document.getElementById("crit_value").innerHTML = "<h4><strong>Προσέγγιση με κρίσιμο σημείο</strong></h4>";

    }
    else if ($("#parameter1").val() == "proportion") {
      console.log("proportion");
    }

  });

////////////////////////////////////////////////////

    function create_canvas(id, xAxis) {

        var dataset2 = fill(interval, upper_bound, lower_bound, mean, std, fill_const);

        var svg = d3.select(id).append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // append  rectangles
        svg.append("g")
            .attr("id", "rects")
            .selectAll(".binbar")
            .data(dataset2)
            .enter()
            .append("rect")
            .attr("class", "binbar")
            .attr("x", function(d) {
               return xScale(d.x);
            })
            .attr('width',  4)
            .attr("y", function(d) {
                return yScale(d.y);
            })
            .attr("height", function(d) {
                return height - yScale(d.y);
            });

        // append circles
        svg.append("g")
            .attr("id", "circles")
            .selectAll("circle")
            .data(standard_Dataset)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", function(d) {
                return xScale(d.x);
            })
            .attr("cy", function(d) {
                return yScale(d.y);
            })
            .attr("r", 1.5);


        // append Axes ///////////////////////////
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        return svg;
    }

////////////////////////////////////////////////
    function create_data(interval, upper_bound, lower_bound, mean, std) {
        var n = Math.ceil((upper_bound - lower_bound) / interval)
        var data = [];

        x_position = lower_bound;
        for (i = 0; i < n; i++) {
            data.push({
                "y": jStat.normal.pdf(x_position, mean, std),
                "x": x_position
            })
            x_position += interval
        }
        return (data);
    }

    function fill(interval, upper_bound, lower_bound, mean, std, fill) {
        var n = Math.ceil((upper_bound - lower_bound) / interval)
        var data = [];

        x_position = lower_bound;
        for (i = 0; i < n; i++) {
            if ((fill == 1 && x_position <= -1.5)||(fill == 2 && x_position >= 1.5)||(fill == 3 && (x_position >= 1.5||x_position <= -1.5))) {
              data.push({
                  "y": jStat.normal.pdf(x_position, mean, std),
                  "x": x_position
              })
            } else {
              data.push({
                  "y": 0,
                  "x": x_position
              })
            }
            x_position += interval
        }
        return (data);
    }

    function defineXaxis(z_t, fill_const) {

        var values; // real values for x axis: [-1.5,0] or [0,1.5] or [-1.5,0,1.5]

        if (fill_const == 1) {
          values = [-1.5,0];
        } else if (fill_const == 2) {
          values = [0,1.5];
        } else if (fill_const == 3) {
          values = [-1.5,0,1.5];
          z_t = Math.abs(z_t);
        }

        var xAxis = d3.axisBottom()
            .scale(xScale)
            .tickSize(9)
            .tickValues(values)
            .tickFormat(function(d) {
              if (d<0) {
                if (fill_const == 3) {
                  return ((-1)*z_t).toString();
                }
                return z_t.toString();
              } else if (d>0) {
                 return z_t.toString();
              } else {
                return '0';
              }});

        return xAxis;

    }
