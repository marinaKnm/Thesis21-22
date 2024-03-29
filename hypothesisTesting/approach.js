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
  var standard_Dataset = create_data(interval, upper_bound, lower_bound, mean, std, 1);
  //create standard normal data points
  var standard_Dataset_chi = create_data(interval, 18, 0, mean, std, 2);

  var object = defineScales(standard_Dataset);

  var xScale = object.xScale;
  var yScale = object.yScale;

  object = defineScales(standard_Dataset_chi);

  var xScale_chi = object.xScale;
  var yScale_chi = object.yScale;

  function defineScales(dataset) {

    var xScale = d3.scaleLinear()
        .domain([d3.min(dataset, function(d) {
            return d.x;
        }), d3.max(dataset, function(d) {
            return d.x;
        })])
        .range([0,width]);
    var yScale = d3.scaleLinear()
        .domain([
            d3.min(dataset, function(d) {
                return (d.y);
            }),
            d3.max(dataset, function(d) {
                return d.y;
            })
        ])
        .range([height,0]);

    return {xScale,yScale};
  }


  ////// Define Axis   /////////////

  var yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(0);

////////////////////////////////////////////////////

  var h0_sign; // ">=" -> lower, "<=" -> upper or "=" -> equal
  var m0;
  var fill_const = 1; // 3 possible values: value 1 corresponds to left tailed case,
                      //                    value 2 corresponds to right tailed case,
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

  //functionality for input μ or p or σ^2
  $("#parameter1").change(function() {
    let p = $("#parameter1").val();
    if (p === "proportion") {
      $("#Xi").hide();
      $("#m_checkbox").hide();
      $("#nxs").show();
      $("#parameter2").html("p");
      let j =  $("#muknotvalue").html();
      if (isNaN(j)) {  //if j is NOT a number
        $("#muknotvalue").html("p₀");
      } else if (j === "") {
        $("#muknotvalue").html("p₀");
      }
      $("#samplestat").html("$$\\bar{p}$$");
      MathJax.typesetPromise();
      $("#sd1").hide();
      $("#sd2").hide();
      $("#sd3").hide();
    } else if (p === "variance") {
      $("#parameter2").html("σ&#xB2;");
      let j =  $("#muknotvalue").html();
      if (isNaN(j)) {  //if j is NOT a number
        $("#muknotvalue").html("σ₀&#xB2;");
      } else if (j === "") {
        $("#muknotvalue").html("σ₀&#xB2;");
      }
      $("#samplestat").html("s");
      MathJax.typesetPromise();
      $("#nxs").hide();
      $("#sd1").hide();
      $("#sd2").hide();
      $("#sd3").hide();
      $("#Xi").show();
      $("#m_checkbox").show();
    } else {
      $("#Xi").hide();
      $("#m_checkbox").hide();
      $("#nxs").show();
      $("#sd1").show();
      $("#sd2").show();
      $("#sd3").show();
      $("#parameter2").html("μ");
      j =  $("#muknotvalue").html();if (isNaN(j)) {  //if j is NOT a number
        console.log("[" +j +"]");
        $("#muknotvalue").html("μ₀");
      } else if (j === "") {
        $("#muknotvalue").html("μ₀");
      }
      $("#samplestat").html("$$\\bar{x}$$");
      MathJax.typesetPromise();
    }
  });

  //chi square distribution checkbox
  $('input:checkbox').change(
    function(){
      if ($(this).is(':checked')) {
            $("#value_of_mean").html("<input type=\"text\" style=\"width:50px;\" id=\"value_avg\" class=\"hypinput2\">");
      }
      else {
        $("#value_of_mean").html("");
      }
    });

  //show the type for calculating z-value or t-value
  function show_statFunction(str) {
    $("#performance").html(str);
    MathJax.typesetPromise();
    $("#df").empty();
  }

  //calculates p-value and critical values for each case
  //possible values for type are: z or t
  function calculate_values(type, z_t, a) {
    if (type === 'z') {
      if (fill_const == 3) { //if fill_const=3
        let q;
        if (z_t > 0) { q = (-1)*z_t }else{ q = z_t }
        pValue = jStat.normal.cdf(q, mean, std); //case: P(z <= -|z_t|)
        crit_value = jStat.normal.inv(1-a/2, 0, 1);
        pValue = 2*pValue;  //final value of p-value = 2*P(x <= -|z_t|)

      } else { //TO P(z <= z_t)
        pValue = jStat.normal.cdf(z_t, mean, std);
        if (fill_const == 2) {
          crit_value = jStat.normal.inv(1-a, 0, 1);
          pValue = 1-pValue;  //final value of p-value, P(x >= z_t) = 1 - P(x <= z_t)
        } else {
          crit_value = jStat.normal.inv(a, 0, 1);
        }
      }
      //////////////////////////////////////////////////////////
    } else {
      console.log("type z");
      console.log(fill_const);
      if (fill_const == 3 && z_t > 0) { //if fill_const = 3
        pValue = jStat.studentt.cdf((-1)*z_t, df); // case: P(t <= -|z_t|)
        crit_value = jStat.studentt.inv(1-a/2,df);
        pValue = 2*pValue;  //final value of p-value = 2*P(x <= -|z_t|)
      } else {  //P(t <= z_t)
        pValue = jStat.studentt.cdf(z_t, df);
        console.log("ELSE");
        console.log(pValue);
        if (fill_const == 2) {
          crit_value = jStat.studentt.inv(1-a, df);
          pValue = 1-pValue;  //final value of p-value, P(x >= z_t) = 1 - P(x <= z_t
        } else {
          crit_value = jStat.studentt.inv(a, df);
        }
      }
    }

    return { crit_value, pValue };
  }


  var df; //degrees of freedom for the student distribution


  $('#hyptest').click(function() {

    var n = $("#size").val();
    n = parseInt(n);
    var avg = $("#xbar").val();
    avg = parseFloat(avg);
    var deviation = $("#stdev").val(); // standard deviation
    deviation = parseFloat(deviation);
    var a = $("#alpha").val();
    a = parseFloat(a);
    var pValue;
    var crit_value;
    var conclusion, conclusionc; //string with message whether to reject H0 or not
    var type, z_t;

    if ($("#parameter1").val() == "mean") { // testing for mean
      //calculate value of z or t
      z_t = (avg - m0)*Math.sqrt(n);
      z_t = z_t/deviation; // z or t
      z_t = (Math.round(z_t*100)/100);

      if ($("#sigma").val() == "known") { //testing for known variance
        type="z";

        show_statFunction('$$z = \\frac{\\bar{x} - μ_0}{σ/\\sqrt[2]{n}} = ' + z_t + '$$');

        let obj = calculate_values(type, z_t, a);
        crit_value = obj.crit_value;
        pValue = obj.pValue;

      } else { //testing for unknown variance
        type="t";

        show_statFunction('$$t = \\frac{\\bar{x} - μ_0}{s/\\sqrt[2]{n}} = ' + z_t + '$$');

        df = n - 1; //degrees of freedom of the studen distribution
        var s = "Βαθμοί Ελευθερίας = n - 1 = " + df;
        $('#df').append('<p>'+ s +'</p>').css("margin", "auto");

        let obj = calculate_values(type, z_t, a);
        crit_value = obj.crit_value;
        pValue = obj.pValue;
      }

    }
    else if ($("#parameter1").val() == "proportion") {
      //check if given p and p0 range between 0 and 1
      if (avg > 1 || m0 > 1) {
        $("#performance").html("Το p είναι ποσοστό.");
        $('#df').empty();
        $('#p_value').empty();
        $('#crit_value').empty();
        return;
      }
      if (n <= 30) {
        alert("Το μέγεθος δείγματος (n) πρέπει να είναι μεγαλύτερο του 30.");
        return;
      }
      $('#perfomance').empty();
      type = 'z';
      //calculate value
      var z_t = avg - m0;
      z_t = z_t / Math.sqrt((m0 * (1 - m0)) / n);
      z_t = (Math.round(z_t*100)/100);

      show_statFunction('$$z = \\frac{\\bar{p} - p_0} {\\sqrt[2]{ \\frac{p_0(1-p_0)}{n} }} = ' + z_t + '$$');
      let obj = calculate_values(type, z_t, a);
      crit_value = obj.crit_value;
      pValue = obj.pValue;
    }
    else if ($("#parameter1").val() == "variance") {
      $("#performance").empty();
      $('#df').empty();
      $('#p_value').empty();
      $('#crit_value').empty();

      var s = 0;
      var sigma0 = m0;

      //get values of independent variables
      var variables = $("#independent_var").val();

      if (variables === "") {
        alert("Πρέπει να δώσετε τιμές δείγματος!");
        return;
      }

      variables = variables.split(/[ ]+/);  //splits string of values on white space
      n = variables.length;   //sample size
      variables = variables.map(Number);  //convert every string of number to number

      if ($("#known_avg").is(':checked')) { //if μ is checked then mean of sample is given as input
        type="n";
        avg = $('#value_avg').val();
        if (avg === "") { //if μ is not given show message
          $("#performance").html("Δώστε μέσο δείγματος μ.");
          return;
        }

        for (let i=0; i<n; i++) { //calculate test statistic
          s = s + Math.pow((variables[i] - avg), 2);
        }
        s = s / Math.pow(sigma0,2);
        // &#xB2;&#8333;&#8345;&#8334;
        //show test statistic and its value on page
        show_statFunction('$$ χ_n^2 = \\frac{\\sum\\limits_{i = 1}^n{{(x_i-μ)}^2}} {σ₀&#xB2;} = ' + s.toFixed(5) + '$$');
        df = n;
        var strdf = "Βαθμοί Ελευθερίας = n = " + df;
        $('#df').append('<p>'+ strdf +'</p>').css("margin", "auto");

      } else {  //else we calculate the mean of sample
        type = "n-1";
        avg = 0;
        for (let i=0; i<n; i++) {
          avg = avg + variables[i];
        }
        avg = avg / n;

        for (let i=0; i<n; i++) { //calculate test statistic
          s = s + Math.pow((variables[i] - avg), 2);
        }
        s = s / Math.pow(sigma0,2);

        //show test statistic and its value on page;
        show_statFunction('$$ χ_{n-1}^2 = \\frac{\\sum\\limits_{i = 1}^n{(x_i-\\bar{x})^2}} {σ₀&#xB2;} = ' + s.toFixed(5) + '$$');
        df = n-1;
        strdf = "Βαθμοί Ελευθερίας = n-1 = " + df;
        $('#df').append('<p>'+ strdf +'</p>').css("margin", "auto");
      }

      //calculate critical value(s)
      var crit_value_chi = [];
      if (fill_const == 1) {
        crit_value_chi.push(jStat.chisquare.inv(a, df));
      } else if (fill_const == 2) {
        crit_value_chi.push(jStat.chisquare.inv(1-a, df));
      } else {
        crit_value_chi.push(jStat.chisquare.inv(a/2, df));
        crit_value_chi.push(jStat.chisquare.inv(1-a/2, df));
      }

      // show graphic representation for chi-square
      var xAxis_cr = defineXaxis(crit_value_chi, fill_const, xScale_chi, 2);
      var div = document.getElementById('p_value');
      div.innerHTML += "<h4><strong>Προσέγγιση με κρίσιμο σημείο</strong></h4>";
      var svg = create_canvas("#p_value", xAxis_cr, xScale_chi, yScale_chi, 2);

      //conclude whether to reject or not the null hypothesis
      let flag=0;
      if(fill_const == 3) {
        descrc1 = "$$χ^2_{"+ type +"} \u2264 χ^2_{"+ type +"}(1-\\frac{α}{2})$$"+ "και" + "$$χ^2_{"+ type +"} \u2265 χ^2_{"+ type +"}(\\frac{α}{2})$$";

        if (s<= crit_value_chi[0] || s>=crit_value_chi[1]) {  //reject null hypothesis
          conclusion = "$$χ^2_{"+ type +"} \u2208 (0, " + crit_value_chi[0].toFixed(5) +"]\u222A["+ crit_value_chi[1].toFixed(5) +" , \u221E)$$";
          flag = 1;
        } else {
          conclusion = "$$χ^2_{"+ type +"} \u2208 (" + crit_value_chi[0].toFixed(5) + " , " + crit_value_chi[1].toFixed(5) + ")" + "$$";
        }
      } else if(fill_const == 2) {
        descrc1 = "$$χ^2_{"+ type +"}\u2265 χ_{"+ type +"}^2(α)="+ crit_value_chi[0].toFixed(5) +"$$";
        if (s >= crit_value_chi[0]) { //reject null hypothesis
          conclusion = "$$χ^2_{"+ type +"} \u2208 [" + crit_value_chi[0].toFixed(5) + ", \u221E)$$";
          flag = 1;
        } else {
          conclusion = "$$χ^2_{"+ type +"} \u2208 (0 , "+ crit_value_chi[0].toFixed(5) +")$$";
        }
      } else {
        descrc1 = "$$χ^2_{"+ type +"}\u2264 χ_{"+ type +"}^2(α)="+ crit_value_chi[0].toFixed(5) +"$$";
        if (s <= crit_value_chi[0]) { //reject null hypothesis
          conclusion =  "$$χ^2_{"+ type +"}	\u2208 (0 , "+ crit_value_chi[0].toFixed(5) +" ]$$";
          flag = 1;
        } else {
          conclusion = "$$χ^2_{"+ type +"}	\u2208 ("+ crit_value_chi[0].toFixed(5) +" , \u221E)$$";
        }
      }
      if (flag == 1) {
        conclusion = conclusion + "<p>Άρα, απορρίπτουμε την H₀</p>";
      } else {
        conclusion = conclusion + "<p>Άρα, <em>δεν</em> έχουμε <em>επαρκή</em> στοιχεία για να απορρίψουμε την H₀</p>";
      }

      div = document.getElementById('crit_value');
      if (fill_const == 3) {
        div.innerHTML = div.innerHTML + "<p>Κρίσιμα σημεία: " + crit_value_chi[0].toFixed(5) + "</p>";
        div.innerHTML = div.innerHTML + "<p>και " + crit_value_chi[1].toFixed(5) + "</p>";
      } else {
        div.innerHTML = div.innerHTML + "<p>Κρίσιμο σημείο:" + crit_value_chi[0].toFixed(5) + "</p>";
      }
      div.innerHTML = div.innerHTML + "<p>Κανόνας Απόρριψης: Απόρριψε την " +"H₀ αν " + descrc1 + "</p>";
      div.innerHTML = div.innerHTML + "<h4><strong>Συμπέρασμα:</strong></h4><p>" + conclusion + "</p>";
      MathJax.typesetPromise();
      return;
    }

    $('#p_value').empty();
    $('#crit_value').empty();

      var descrp; //message for p-value approach
      var descrc1, desrc2; //message for critical value approach
      if(fill_const == 3) {
        let w;
        if (z_t > 0) w = (-1)*z_t; else w = z_t;
        descrp = "2\xD7P(X \u2264 "+ w +") = ";
        descrc1 = type + " \u2264 -"+ type +"<sub>α/2</sub>" + " ή " + type + " \u2265 " + type + "<sub>α/2</sub>";
      } else if (fill_const == 2) {
        descrp = "P(X \u2265 "+ z_t +") = ";
        descrc1 = type + " \u2265 " + type + "<sub>α</sub>";
      } else {
        descrp = "P(X \u2264 "+ z_t +") = ";
        descrc1 = type + " \u2264 " + type + "<sub>α</sub>";
      }

    //show p-value approach
    var xAxis_p = defineXaxis(z_t, fill_const, xScale, 1);
    var div = document.getElementById('p_value');
    div.innerHTML += "<h4><strong>Προσέγγιση με p-value</strong></h4>";
    var svg1 = create_canvas("#p_value", xAxis_p, xScale, yScale, 1);
    if (pValue <= a) {  //H0 rejected
      conclusion = "p-value \u2264 α άρα, απορρίπτουμε την H₀";
      if (fill_const == 3) {
        conclusionc = type + "\u2208(-\u221E, -"+ Math.abs(crit_value).toFixed(5) + "]\u222A["+ Math.abs(crit_value).toFixed(5) +" , \u221E)";
      } else if (fill_const == 2) {
        conclusionc = type + "\u2208["+ crit_value.toFixed(5) +" , \u221E)"
      } else {
        conclusionc = type + "\u2208(-\u221E , "+ crit_value.toFixed(5) +"]";
      }
      conclusionc = conclusionc + "<p>Άρα, απορρίπτουμε την H₀</p>";
    } else {
      conclusion = "p-value > α άρα, <em>δεν</em> έχουμε <em>επαρκή</em> στοιχεία για να απορρίψουμε την H₀";
      if (fill_const == 3) {
        conclusionc = type + "\u2208(-"+ Math.abs(crit_value).toFixed(5) +" , "+ Math.abs(crit_value).toFixed(5) + ")";
      } else if (fill_const == 2) {
        conclusionc = type + "\u2208(-\u221E , "+ crit_value.toFixed(5) + ")";
      } else {
        conclusionc = type + "\u2208("+ crit_value.toFixed(5) + " , \u221E)";
      }
      conclusionc = conclusionc + "<p>Άρα, <em>δεν</em> έχουμε <em>επαρκή</em> στοιχεία για να απορρίψουμε την H₀";
    }
    div.innerHTML = div.innerHTML + "<p>p-value = " + descrp + (pValue.toFixed(5)) + "</p>";
    div.innerHTML = div.innerHTML + "<p>Κανόνας Απόρριψης: Απόρριψε την " +"H₀" +" αν p-value "+"&#8804"+ " α</p>";
    div.innerHTML = div.innerHTML + "<h4><strong>Συμπέρασμα:</strong></h4><p>" + conclusion + "</p>";

    //show critical value approach
    document.getElementById("crit_value").innerHTML = "<h4><strong>Προσέγγιση με κρίσιμο σημείο</strong></h4>";
    var xAxis_c = defineXaxis((Math.round(crit_value*100)/100), fill_const, xScale, 1);
    div = document.getElementById('crit_value');
    var svg2 = create_canvas("#crit_value", xAxis_c, xScale, yScale, 1);
    if (fill_const == 3) {/////////////////////////
      div.innerHTML = div.innerHTML + "<p>Κρίσιμα σημεία: -"+type+ "<sub>α/2</sub> = " + ((-1)*Math.abs(crit_value)).toFixed(5) + "</p>";
      div.innerHTML = div.innerHTML + "<p>και " +type+ "<sub>α/2</sub> = " + (Math.abs(crit_value)).toFixed(5) + "</p>";
    } else {
      div.innerHTML = div.innerHTML + "<p>Κρίσιμο σημείο = "+type+ "<sub>α</sub> = " + (crit_value.toFixed(5)) + "</p>";
    }
    div.innerHTML = div.innerHTML + "<p>Κανόνας Απόρριψης: Απόρριψε την " +"H₀ αν " + descrc1+ "</p>";
    div.innerHTML = div.innerHTML + "<h4><strong>Συμπέρασμα:</strong></h4><p>" + conclusionc + "</p>";

  });

////////////////////////////////////////////////////

    function create_canvas(id, xAxis, xScale, yScale, distr) {

        var dataset;
        var dataset2;
        if (distr == 1) {
          dataset = standard_Dataset;
          dataset2 = fill(interval, upper_bound, lower_bound, mean, std, fill_const, distr);
        }  else if (distr == 2) {
          dataset = standard_Dataset_chi;
          dataset2 = fill(interval, 18, 0, mean, std, fill_const, distr);
        }

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
            .data(dataset)
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
    //functionality for the graphs
    function create_data(interval, upper_bound, lower_bound, mean, std, distr) {
        var n = Math.ceil((upper_bound - lower_bound) / interval)
        var data = [];

        x_position = lower_bound;
        for (i = 0; i < n; i++) {
          if (distr == 1) {
            data.push({
                "y": jStat.normal.pdf(x_position, mean, std),
                "x": x_position
            })
          }
          if (distr == 2) {
            data.push({
                "y": jStat.chisquare.pdf(x_position, 6),
                "x": x_position
            })
          }
            x_position += interval
        }
        return (data);
    }

    function fill(interval, upper_bound, lower_bound, mean, std, fill, distr) {
        var n = Math.ceil((upper_bound - lower_bound) / interval)
        var data = [];

        x_position = lower_bound;
        for (i = 0; i < n; i++) {
          if (distr == 1) {
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
          }
          else if (distr == 2) {
            if ((fill == 1 && x_position <= 2)||(fill == 2 && x_position >= 10.5)||(fill == 3 && (x_position >= 10.5||x_position <= 2))) {
              data.push({
                  "y": jStat.chisquare.pdf(x_position, 6),//mean, std),
                  "x": x_position
              })
            } else {
              data.push({
                  "y": 0,
                  "x": x_position
              })
            }
          }

            x_position += interval
        }
        return (data);
    }

    function defineXaxis(point, fill_const, xScale, distr) {

        var values; // real values for x axis: [-1.5,0] or [0,1.5] or [-1.5,0,1.5]
        var xAxis;
        if (distr == 1) {
          if (fill_const == 1) {
            values = [-1.5,0];
          } else if (fill_const == 2) {
            values = [0,1.5];
          } else if (fill_const == 3) {
            values = [-1.5,0,1.5];
            point = Math.abs(point);
          }

          xAxis = d3.axisBottom()
              .scale(xScale)
              .tickSize(9)
              .tickValues(values)
              .tickFormat(function(d) {
                if (d<0) {
                  if (fill_const == 3) {
                    return ((-1)*point).toString();
                  }
                  return point.toString();
                } else if (d>0) {
                   return point.toString();
                } else {
                  return '0';
                }});
        } else if (distr == 2) {
            if (fill_const == 1) {
              values = [0,2];
            } else if (fill_const == 2) {
              values = [0,10.5];
            } else if (fill_const == 3) {
              values = [0,2,10.5];
            }

            var xAxis = d3.axisBottom()
                .scale(xScale)
                .tickValues(values)
                .tickFormat(function(d) {
                  if (d>0) {
                     if (fill_const == 3) { //in this case there are 2 critical points
                       if (d == 2) {
                         return point[0].toFixed(3);
                       } else { //d==10.5
                         return point[1].toFixed(3);
                       }
                     }
                     return point[0].toFixed(3);
                  } else {
                    return '0';
                  }});
        }

        return xAxis;

    }
