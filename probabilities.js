$.getScript("functions.js", function(){
  $(document).ready(function(){

    //get the values of the range sliders
    var slider4= document.getElementById("prob_a");
    var output4 = document.getElementById("demo4");
    output4.innerHTML = parseInt(slider4.value);

    var slider5= document.getElementById("prob_b");
    var output5 = document.getElementById("demo5");
    output5.innerHTML = parseInt(slider5.value);

    var slider6= document.getElementById("intersect");
    var output6 = document.getElementById("demo6");
    output6.innerHTML = parseInt(slider6.value);

    
    var crcl_a = {
      x1: crcl1.x1,
      y1: crcl1.y1,
      r1: crcl1.r1,//150, //72,//70,//233, //150
      color: '#d1040b'  //red
    }

    var crcl_b = {
      x2: crcl2.x2,//306,//302//450,
      y2: crcl2.y2,
      r2: crcl2.r2,//80,//103;//81; //80
      color: '#5604d1'
    }
  

    var basic_probabilities = {
      pa: undefined,    //P(B)
      pb: undefined,    //P(A)
      paub: undefined,  //P(A UNION B)
      paib: undefined   //P(A INTERSECTION B)
    };

    function calculateBasicProbalities(crcl1, crcl2) {  //calculates every probability we need for the calculations
      //calculate each basic probability
      basic_probabilities.pa = circleArea(crcl1.r1) / sampleSpace;
      basic_probabilities.pb = circleArea(crcl2.r2) / sampleSpace;
      basic_probabilities.paib = intersectionArea(crcl1, crcl2) / sampleSpace;
      basic_probabilities.paub = basic_probabilities.pa + basic_probabilities.pb - basic_probabilities.paib;
    }
    
    function UpdateProbabilities() {  //calculates and renders the probabilities
      $('#pUnion').html((basic_probabilities.pa + basic_probabilities.pb - basic_probabilities.paib).toFixed(4));
      $('#pACompl').html((1 - basic_probabilities.pa).toFixed(4));
      $('#pBCompl').html((1 -  basic_probabilities.pb).toFixed(4));
      $('#pICompl').html((1 -  basic_probabilities.paub).toFixed(4));
      $('#pUCompl').html((1 -  basic_probabilities.paib).toFixed(4));
      $('#p1').html((basic_probabilities.pa -  basic_probabilities.paib).toFixed(4));
      $('#p2').html((basic_probabilities.pb - basic_probabilities.paib).toFixed(4));
      $('#p3').html((basic_probabilities.paub - basic_probabilities.paib).toFixed(4));
    }

    //as soon as the website is loaded assign the corresponding probability to each range slider
    $(function() {
      //calculate each basic probability
      calculateBasicProbalities(crcl_a, crcl_b);

      console.log(basic_probabilities.pa, basic_probabilities.pb, basic_probabilities.paub, basic_probabilities.paib)

      //render initial values of the range sliders
      $('#demo4').html(basic_probabilities.pa.toFixed(4));
      $('#demo5').html(basic_probabilities.pb.toFixed(4));
      $('#demo6').html(basic_probabilities.paib.toFixed(4));

      //calculate each probability and render them
      UpdateProbabilities();
    });

    //create a new canvas
    var canvas1 = d3.select("#probability")
              .append("svg") //so we append the svg element to our page
              //now let's give some properties
              .attr("width", 725) //when we are styling svg elements, we use attr method
              .attr("height", 500) //instead of style method
              .style("margin-left","100px")
              .style("background-color","#e4dada")
              .style("border","solid 3px");


    //draw the circles on the canvas
    let prob_circles = drawCircles(canvas1, crcl_a, crcl_b, "red", "blue", 0.5);
    var prob_circle1 = prob_circles.circleA;
    var prob_circle2 = prob_circles.circleB;

    var wid = $("svg").width();
    var hgt = $("svg").height();
    var sampleSpace = wid*hgt; //sample space area

    
    function probability(crcl1, crcl2, myResult) {
      //only A  only B  INTER(A,B)  (AUB)'
      var globalArea = 0;

      var intersectArea = intersectionArea(crcl1, crcl2);
      var onlysetA = circleArea(crcl1.r1) - intersectArea;
      var onlysetB = circleArea(crcl2.r2) - intersectArea;

      if (myResult[3] === 1) {
        var union = onlysetA + intersectArea + onlysetB;
        globalArea = sampleSpace - union;
      }
      if (myResult[0] === 1) {
        globalArea = globalArea + onlysetA;
      }
      if (myResult[1] === 1) {
        globalArea = globalArea + onlysetB;
      }
      if (myResult[2] === 1) {
        globalArea = globalArea + intersectArea;
      }

      var result = globalArea/sampleSpace;

      return result;
    }


    function circleArea(radius) { //find circle area PI*(r^2)
      var m = radius*radius;
      return Math.PI*m;
    }


    function intersectionArea(crcl1, crcl2) { //find Intersection area

        var d = Math.hypot(crcl2.x2 - crcl1.x1, crcl2.y2 - crcl1.y1);

        if (d < crcl1.r1 + crcl2.r2) {

            var a = crcl1.r1 * crcl1.r1;
            var b = crcl2.r2 * crcl2.r2;

            var x = (a - b + d * d) / (2 * d);
            var z = x * x;
            var y = Math.sqrt(a - z);

            if (d <= Math.abs(crcl2.r2 - crcl1.r1)) {
                return Math.PI * Math.min(a, b);
            }
            return a * Math.asin(y / crcl1.r1) + b * Math.asin(y / crcl2.r2) - y * (x + Math.sqrt(z + b - a));
        }
        return 0;
    }

    
    $('#prob_a').on('input', function() {
      crcl_a.r1 = parseInt(this.value); //input radius

      calculateBasicProbalities(crcl_a, crcl_b); 

      output4.innerHTML = basic_probabilities.pa.toFixed(4);  //update value of range slider
      prob_circle1.attr("r", crcl_a.r1);
      output6.innerHTML = basic_probabilities.paib.toFixed(4);  //show the new P(A INTERSECTION B) since the area of the intersection changed
    
      //change also the probabilities that should change
      UpdateProbabilities();
    });



    $('#prob_b').on('input', function() {
      crcl_b.r2 = parseInt(this.value); //input radius

      calculateBasicProbalities(crcl_a, crcl_b);

      output5.innerHTML = basic_probabilities.pb.toFixed(4);  //update value of range slider
      prob_circle2.attr("r", crcl_b.r2);
      output6.innerHTML = basic_probabilities.paib.toFixed(4);  //show the new P(A INTERSECTION B) since the area of the intersection changed
    
      //change also the probabilities that should change
      UpdateProbabilities();
    });


    $('#intersect').on('input', function() {
      //change the center of circle B
      crcl_b.x2 = left_limit + Number(this.value);
      prob_circle2.attr("cx", crcl_b.x2);

      calculateBasicProbalities(crcl_a, crcl_b);

      output6.innerHTML = basic_probabilities.paib.toFixed(4); //show the new P(A INTERSECTION B) since the area of the intersection changed
    
      //change also the probabilities that should change
      UpdateProbabilities();
    });
  });
});
