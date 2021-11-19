//$(document).ready(function(){   //make sure the document is already loaded

  var myResult = [0,0,0,0];

  var left_limit = 250; //constant center of the left circle

  var crcl1 = {
    x1: 250,
    y1: 250,
    r1: 150 //72,//70,//233, //150
  }

  var crcl2 = {
    x2: 450,//306,//302//450,
    y2: 250,
    r2: 80//103;//81; //80
  }

  console.log("r1 = ", crcl1.r1, " r2 = ", crcl2.r2);

  var canvas = d3.select("#venn")
             .append("svg") //so we append the svg element to our page
             //now let's give some properties
             .attr("width", 725) //when we are styling svg elements, we use attr method
             .attr("height", 500) //instead of style method
             .style("margin-left","400px")
             .style("background-color","#e4dada")
             .style("border","solid 3px");

  //Let's start by creating a circle:
  var circle1, circle2;
  function drawCircles() {
    circle1 = canvas.append("circle")
                  .attr('id', 'c1')
                  .attr("cx", crcl1.x1) //we want to give it a horizontal position
                  .attr("cy", crcl1.y1)
                  .attr("r", crcl1.r1) //radius
                  .attr("stroke","black") // .attr("stroke","green") 77777&&&&&777777
                  .attr("stroke-width",3)
                  .attr("fill","none");


    circle2 = canvas.append("circle")
                  .attr("cx", crcl2.x2) //we want to give it a horizontal position
                  .attr("cy", crcl2.y2)
                  .attr("r", crcl2.r2) //radius
                  .attr("stroke","black") // .attr("stroke","orange") 44444444444444$$$$$$44444444444
                  .attr("stroke-width",3)
                  .attr("fill","none")
                  .attr('id', 'c2');
  }

  drawCircles();

  function resetCanvas() {
    d3.select("svg")
      .selectAll("*")
      .remove();
    drawCircles();
    canvas.style("background-color","#e4dada");
  }

  function drawCirclesOpp() {

    circle2 = canvas.append("circle")
                  .attr("cx", crcl2.x2) //we want to give it a horizontal position
                  .attr("cy", crcl2.y2)
                  .attr("r", crcl2.r2) //radius
                  .attr("stroke","black") // .attr("stroke","orange") 44444444444444$$$$$$44444444444
                  .attr("stroke-width",3)
                  .attr("fill","none")
                  .attr('id', 'c2');

    circle1 = canvas.append("circle")
                  .attr('id', 'c1')
                  .attr("cx", crcl1.x1) //we want to give it a horizontal position
                  .attr("cy", crcl1.y1)
                  .attr("r", crcl1.r1) //radius
                  .attr("stroke","black") // .attr("stroke","green") 77777&&&&&777777
                  .attr("stroke-width",3)
                  .attr("fill","none");

  }

  function resetCanvasOpp() {
    d3.select("svg")
      .selectAll("*")
      .remove();
    drawCirclesOpp();
    canvas.style("background-color","#e4dada");
  }


  var interPoints = intersection(crcl1.x1, crcl1.y1, crcl1.r1, crcl2.x2, crcl2.y2, crcl2.r2);

  // when you hover over a button change colour to pink
  $(".Button").hover(function() {
    $(this).css("background-color", "pink");
    },function(){
      $(this).css("background-color", "lightslategray");
    });

  // functionality for each button
  $('#A').click(function() {
    $("#set").append("A");      //show in the text-box
  });

  $('#B').click(function() {
    $("#set").append("B");      //show in the text-box
  });

  $('#Union').click(function() {
    $('#set').append('&cup;');      //show in the text-box
  });

  $('#Intersection').click(function() {
    $('#set').append('&cap;');      //show in the text-box
  });

  $('#Compl').click(function() {
    $("#set").append("'");      //show in the text-box
  });

  $('#leftPar').click(function() {
    $("#set").append("(");      //show in the text-box
  });

  $('#rightPar').click(function() {
    $("#set").append(")");    //show in the text-box
  });

  $('#EmptySet').click(function() {
    $('#set').append('&empty;');    //show in the text-box
  });

  $('#Delete').click(function(index, value) {
    let myInput = $('.text-box').html();      //get the text from the text-box
    myInput = myInput.substring(0, myInput.length - 1);     //remove the last character
    $('#set').text(myInput);      //show in the text-box
  });

  $('#Reset').click(function() {
    $('.text-box').empty();     //delete the string
    resetCanvas();
    myResult = [0, 0, 0, 0];
  });

  function showMessage(str, element, time) {
    $(element).html(str);
    $(element).fadeIn(time);
    $(element).fadeOut(time);
  }

  function intersection(x0, y0, ra, x1, y1, rb) {

      // console.log('Beginning of intersection: r1 = ' +ra+ ' r2 = ' +rb);

      var a, dx, dy, d, h, rx, ry;
      var x2, y2;

      /* dx and dy are the vertical and horizontal distances between
       * the circle centers.
       */
      dx = x1 - x0;
      dy = y1 - y0;

      /* Determine the straight-line distance between the centers. */
      d = Math.sqrt((dy * dy) + (dx * dx));

      // console.log('Straight line distance between centers d = ' +d);

      /* Check for solvability. */
      if (d > (ra + rb)) {
        /* no solution. circles do not intersect. */
        return false;
      }
      if (d < Math.abs(ra - rb)) {
        // console.log('no solution: r1 = ', ra, ' r2 = ', rb);
        /* no solution. one circle is contained in the other */
        return -1;
      }

      /* 'point 2' is the point where the line through the circle
       * intersection points crosses the line between the circle
       * centers.
       */

      /* Determine the distance from point 0 to point 2. */
      a = ((ra * ra) - (rb * rb) + (d * d)) / (2.0 * d);

      /* Determine the coordinates of point 2. */
      x2 = x0 + (dx * a / d);
      y2 = y0 + (dy * a / d);

      /* Determine the distance from point 2 to either of the
       * intersection points.
       */
      h = Math.sqrt((ra * ra) - (a * a));

      /* Now determine the offsets of the intersection points from
       * point 2.
       */
      rx = -dy * (h / d);
      ry = dx * (h / d);

      /* Determine the absolute intersection points. */
      var xi = x2 + rx;
      var xi_prime = x2 - rx;
      var yi = y2 + ry;
      var yi_prime = y2 - ry;

      return [xi, xi_prime, yi, yi_prime];
    }

  function fill_intersection(color) {

    if (interPoints === false) {
      return -2;
    }

    if (interPoints == -1) {
      if (crcl1.r1 < crcl2.r2) {
        circle1.attr("fill",color);
      }
      if (crcl2.r2 < crcl1.r1){
        circle2.attr("fill",color);
      }
    }

    else {

      let g_inter = canvas.append("g");

      //calculate angles for the intersection points for circle 1
      let qqq = angle(crcl1.x1,  crcl1.y1, interPoints[0], interPoints[2]);  //angle with lower intersection point
      let sss = angle(crcl1.x1, crcl1.y1, interPoints[1], interPoints[3]);  //angle with upper intersection point

      //draw the arc with center coordinates (x1, y1)
      let d1 = describeArc(crcl1.x1, crcl1.y1, crcl1.r1, sss + 90, qqq + 90); //arc from the upper intersection point to the lower intersection point

      g_inter.append("g")
            .append("path")
            .attr("d", d1)
            .style('fill', color)
            .style("stroke","black");


      //calculate angles for the intersection points for circle 2
      let q1 = angle(crcl2.x2, crcl2.y2, interPoints[0], interPoints[2]);   //angle with lower intersection point
      let s1 = angle(crcl2.x2, crcl2.y2, interPoints[1], interPoints[3]);   //angle with upper intersection point

      if (s1 < 0) {
        s1 = 360 + s1;
      }

      //draw the arc with center coordinates (x2, y2)
      let d2 = describeArc(crcl2.x2, crcl2.y2, crcl2.r2, q1+90, s1+90); //arc from the lower intersection point to the upper intersection point

      g_inter.append("g")
            .append("path")
            .attr("d", d2)
            .style('fill', color)
            .style("stroke","black");

    }
    // console.log('fill_intersection: interPoints = ', interPoints);
  }


  function findComplement(array, index, apostrophes) {

    if (apostrophes[index] === 1) { //if we have complement for the terms[index]
      for (let j = 0; j < array.length; j++) {
        if (array[j] === 0) {
          array[j] = 1;
        }
        else array[j] = 0;
      }
    }

    return array;

  }



  function getArraysOfTerms(input) {
    let flag = 0;
    let start;
    let terms = new Array();
    let operators = new Array();
    let apostrophes = new Array();

    for (let i = 0; i < input.length; i++) {

      //looking for a whole expression in parenthesis
      if (input[i] === '(') {
        flag++;
        if (flag === 1) {
          start = i+1;  //keep the index that the expression starts from
        }
      }
      else if (input[i] === ')') {
        flag--;
        if (flag === 0) {
           terms.push(input.substring(start, i));  //store as a whole term
           if (input[i+1] === "'") {
             apostrophes.push(1);
           }
           else apostrophes.push(0);
        }
      }

      //term A, B or empty set
      else if ((input[i] === 'A' || input[i] === 'B' || input[i] === '\u2205') && (flag === 0)) {
        terms.push(input[i]);
        if (input[i+1] === "'") {
          apostrophes.push(1);
        }
        else apostrophes.push(0);
      }
      //append current operator to operators array
      else if ((input[i] === '\u222A' || input[i] === '\u2229') && (flag === 0)) {
        operators.push(input[i]);
      }
    }

    return {
      terms,
      operators,
      apostrophes
    }
  }

  // a parser for the expression in order to find which area to paint on the canvas
  function myParser(inputStr) {

    //end of recursion if the expression is a set
    if (inputStr === 'A') {
      return [1,0,1,0];
    } else if (inputStr === 'B') {
      return [0,1,1,0];
    } else if (inputStr === '\u2205') { //empty set
      return [0,0,0,0];
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////

    // arrays = getArraysOfTerms(inputStr);
    // let terms = arrays.terms;
    // let operators = arrays.operators;
    // let apostrophes = arrays.apostrophes;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let flag = 0;
    let start;
    let terms = new Array();
    let operators = new Array();
    let apostrophes = new Array(); // (bit array) every item set to 1 if the corresponding term in array terms has the complement sign

    //Reading character by character in order to find the terms and the operators of the expression
    for (let i = 0; i < inputStr.length; i++) {

      //looking for a whole expression in parenthesis
      if (inputStr[i] === '(') {
        flag++;
        if (flag === 1) {
          start = i+1;  //keep the index that the expression starts from
        }
      }
      else if (inputStr[i] === ')') {
        flag--;
        if (flag === 0) {
           terms.push(inputStr.substring(start, i));  //store as a whole term
           if (inputStr[i+1] === "'") {
             apostrophes.push(1);
           }
           else apostrophes.push(0);
        }
      }

      //term A, B or empty set
      else if ((inputStr[i] === 'A' || inputStr[i] === 'B' || inputStr[i] === '\u2205') && (flag === 0)) {
        terms.push(inputStr[i]);
        if (inputStr[i+1] === "'") {
          apostrophes.push(1);
        }
        else apostrophes.push(0);
      }
      //append current operator to operators array
      else if ((inputStr[i] === '\u222A' || inputStr[i] === '\u2229') && (flag === 0)) {
        operators.push(inputStr[i]);
      }
    } 
    //////////////////////////////////////////////////////////////////////////////////

    //initialize array marked, bit array it will mark the terms that have been used during parsing
    let marked = new Array();
    for (let i = 0; i < terms.length; i++) {
      marked[i] = 0;
    }

    let array1, array2;
    let keepInter = new Array();
    //calculate for every intersection first
    for (let i = 0; i < operators.length; i++) {

      if (operators[i] === '\u2229') { //if operator is an intersection

        //recursive calls for the left and right terms of operator[i]
        if (marked[i] === 0) {  //if neither the left term nor the right term have been parsed
          array1 = myParser(terms[i]);
          array2 = myParser(terms[i+1]);

          //left & right term have been parsed, so mark them as parsed
          marked[i] = 1;
          marked[i+1] = 1;

          array2 = findComplement(array2, i+1, apostrophes);
          array1 = findComplement(array1, i, apostrophes);



          //put the result of intersection operator into array1
          for (let j = 0; j < array1.length; j++) {
            array1[j] = array1[j] + array2[j];
            if (array1[j] === 2) {
              array1[j] = 1;
            } else array1[j] = 0;
          }

          keepInter.push(array1);
          //insert the calculated array into the stack

        } else {      //if the left term of the intersection has been parsed for a previous intersection
          array1 = keepInter.pop();//pop the calculated array from the stack

          marked[i+1] = 1;  //mark the right term as parsed

          array2 = myParser(terms[i+1]); //parse the right term

          array2 = findComplement(array2, i+1, apostrophes);



          //put the result of intersection operator at array1
          for (let j = 0; j < array1.length; j++) {
            array1[j] = array1[j] + array2[j];
            if (array1[j] === 2) {
              array1[j] = 1;
            } else array1[j] = 0;
          }

          keepInter.push(array1);//insert the calculated array into the stack

        }
      }
    }


    //now calculate the complement (if it exists) for all the remaining terms in the expression and add them into the stack
    for (let i = 0; i < marked.length; i++) {
      if (marked[i] != 1) {
        array1 = myParser(terms[i]);
        array1 = findComplement(array1, i, apostrophes);
        keepInter.push(array1);
      }
    }


    let result = [0, 0, 0, 0];
    let last;

    //apply the union operator to the terms in the stack
    while (keepInter.length != 0) {

        last = keepInter.pop();//pop from stack the already calculated array
        if (typeof(last) == 'undefined') {
          break;
        }

        for (let i = 0; i < result.length; i++) {
          result[i] = result[i] + last[i];
        }

    }

    //calculate the final area to be painted for inputStr (finally union operator)
    for (let i = 0; i < result.length; i++) {
      if (result[i] != 0) {
        result[i] = 1;
      }
    }


    return result;

  }

  //Goal: all the functionality for when you submit an input
  //make sure this is not an ivalid input
  //parse the expression and highlight the corresponding area on the Venn diagram
  $('#Submit').click(function() {
    resetCanvas();
    let inputStr = $('.text-box').html();      //get the text from the text-box

    //if input starts with union or intersection or ' or ) accordingly show error message
    switch (inputStr[0]) {
      case '\u222A':  //union
        showMessage('Μη έγκυρη πρόταση. Πρέπει να ξεκινάει με σύνολο ή αριστερή παρένθεση.', '#error_msg', 3000);
        return;
      case '\u2229': //intersection
        showrMessage('Μη έγκυρη πρόταση. Πρέπει να ξεκινάει με σύνολο ή αριστερή παρένθεση.', '#error_msg', 3000);
        return;
      case "'":
        showrMessage('Μη έγκυρη πρόταση. Πρέπει να ξεκινάει με σύνολο ή αριστερή παρένθεση.', '#error_msg', 3000);
        return;
      case ')':
        showMessage('Μη έγκυρη πρόταση. Πρέπει να ξεκινάει με σύνολο ή αριστερή παρένθεση.', '#error_msg', 3000);
        return;
    }

    let prev="";
    let mystack = "";
    for(let i=0; i<inputStr.length; i++) {      //check character by character

      //make sure that 2 sets are not given consequently
      if ((prev === 'A' || prev === 'B') && (inputStr[i] === 'A' || inputStr[i] === 'B')) {
        showMessage('Μη έγκυρη πρόταση. Δόθηκαν δύο σύνολα στη σειρά.', '#error_msg', 3000);
        return;
      }

      //make sure that 2 union or intersection signs are not given consequently
      if ((prev === '\u222A' || prev === '\u2229') && (inputStr[i] === '\u2229' || inputStr[i] === '\u222A')) {
        showrMessage('Μη έγκυρη πρόταση. Δόθηκε ' +prev+ ' και αναμένεται A, Β, (, ' + '\u2205', '#error_msg', 3000);
        return;
      }

      //make sure that after a left parenthesis we get: ', union sign, intersection sign
      if(prev === ')' && (inputStr[i] === 'A' || inputStr[i] === 'B' || inputStr[i] === "\u2205")) {
        showMessage("Μη έγκυρη πρόταση. Δόθηκε " +prev+ " , αναμένεται \u222A, \u2229, '", '#error_msg', 3000);
        return;
      }

      //make sure that we do not get a complement sign after a union sign or an intersection sign
      if ((prev === '\u222A' || prev === '\u2229') &&  inputStr[i] === "'") {
        showMessage("Μη έγκυρη πρόταση. Δόθηκε " +prev+ " , αναμένεται A, B, (, " +'\u2205', '#error_msg', 3000);
        return;
      }

      //make sure that left parethesis and right parenthesis are balanced and paired
      if (inputStr[i] === '(') {
        mystack = mystack + '(';
      }
      if(inputStr[i] === ')') {
        mystack = mystack.substring(0, mystack.length - 1); //if right parenthesis is found pop from stack
      }

      prev = inputStr[i];
    }

    if(mystack !== "") {  //if stack is not empty then left parethesis and right parenthesis are not balanced and paired
      showMessage('Μη έγκυρη πρόταση. Οι παρενθέσεις δεν είναι ισοζυγισμένες.', '#error_msg', 3000);
    }

    //Now we'll visualize user's set in the Venn diagram
    myResult = myParser(inputStr); 
    // console.log("Finished:");
    console.log(myResult);
    // debugger;

    highlightVenn();

    //check if de morgan property applies to the input
    arrays = getArraysOfTerms(inputStr);
    let  terms = arrays.terms;
    let operators = arrays.operators;
    let apostrophes = arrays.apostrophes;

    let DeMorganFalse = 0;
    // debugger;
    console.log(terms);
    console.log(operators);
    console.log(apostrophes);
    console.log('dmskfnsklgndkl');

    //input type: (AUBUAU...)'
    debugger;
    if (apostrophes.length === 1 && apostrophes[0] === 1) {
      console.log('We have only one term and it is a complement');
      arrays = getArraysOfTerms(terms[0]);

      terms = arrays.terms;
      operators = arrays.operators;
      apostrophes = arrays.apostrophes;
      console.log(terms);
      console.log(operators);
      console.log(apostrophes);
      console.log('SECOND TIME PARSING');

      // debugger;

      if(operators.length !== 0) {

        //check if the operators consist only of union signs or intersection signs
        let op = operators[0];
        for (i = 1; i < operators.length; i++) {
          if (op !== operators[i]) { //if the first operator does not match with this operator then it's not the de morgan property
            DeMorganFalse = 1;
            break;
          }
        }

        if (DeMorganFalse !== 1) {  //if the de morgan property applies to the input
          message = 'Ιδιότητα De Morgan, ισχύει: ' + inputStr + ' = ';

          if (op === '\u222A') {
            op = '\u2229';
          } else {
            op === '\u222A';
          }

          let j, str;
          for(j = 0; j < terms.length; j++) {
            if (j === terms.length - 1) {
              op = "";
            }

            if (apostrophes[j] === 1) { //ΤΙ ΓΙΝΕΤΑΙ ΑΝ ΕΧΟΥΜΕ ΠΟΛΛΑ "'''..."?
              str = "''" + op;
            } else {
              str = "'" + op;
            }

            if (terms[j].length > 1) {  //embedded term
              message = message + "(" + terms[j] + ")" + str;
            } else {
              message = message + terms[j] + str;
            }
            
          }

          showMessage(message, '#deMorgan_msg', 100000);
        }
      }
    } else {

      //input type: A'UB'U...
      for (i = 0; i < apostrophes.length; i++) {
        if ( apostrophes[i] != 1) {
          DeMorganFalse = 1;
          break;
        }
      }
      op = operators[0];
      for(i=1; i < operators.length; i++) {
        if (operators[i] != op) {
          DeMorganFalse = 1;
          break;
        }
      }

      if (DeMorganFalse === 0) { 
        //at this point all the operators are of the same type and every term has a complement
        message = 'Ιδιότητα De Morgan, ισχύει: ' + inputStr + ' = (';

        if (op === '\u222A') {
          op = '\u2229';
        } else {
          op === '\u222A';
        }

        console.log(terms);
        console.log(operators);
        console.log(apostrophes);

        for(j = 0; j < terms.length; j++) {
          if (j === terms.length - 1) {
            op = "";
          }

          if (terms[j].length > 1) {  //embedded term
            message = message + "(" + terms[j] + ")" + op;
          } else {
            message = message + terms[j] + op;
          }
        
        }
        message = message + ")'";
        showMessage(message, '#deMorgan_msg', 100000);
      }
    }
    
  


  });


  function highlightVenn() {
    if (myResult[3] === 1) {
      canvas.style("background-color","lightblue");
      circle1.attr("fill","#e4dada");
      circle2.attr("fill","#e4dada");
      if(fill_intersection("#e4dada") != -2);
    }
    if (myResult[0] === 1) {
      circle1.attr("fill","lightblue");
      if(fill_intersection("#e4dada") != -2);
    }
    if (myResult[1] === 1) {
      circle2.attr("fill","lightblue");
      if(fill_intersection("#e4dada") != -2);
    }
    if (myResult[2] === 1) {
      if(fill_intersection("lightblue") != -2);
    }
  }


  //change the size of the circles with range sliders
  var slider1 = document.getElementById("myRange1");
  var output1 = document.getElementById("demo1");
  output1.innerHTML = parseInt(slider1.value);

  var slider2 = document.getElementById("myRange2");
  var output2 = document.getElementById("demo2");
  output2.innerHTML = parseInt(slider2.value);

  $('#myRange1').on('input', function() {
    output1.innerHTML = parseInt(this.value);
    crcl1.r1 = parseInt(this.value);

    if (crcl1.r1 < crcl2.r2) {
      resetCanvasOpp();
    }
    else resetCanvas();

    interPoints = intersection(crcl1.x1, crcl1.y1, crcl1.r1, crcl2.x2, crcl2.y2, crcl2.r2);
    // console.log(interPoints);

    highlightVenn();
  });

  $('#myRange2').on('input', function() {
    output2.innerHTML = parseInt(this.value);
    crcl2.r2 = parseInt(this.value);

    if (crcl1.r1 < crcl2.r2) {
      resetCanvasOpp();
    }
    else resetCanvas();

    interPoints = intersection(crcl1.x1, crcl1.y1, crcl1.r1, crcl2.x2, crcl2.y2, crcl2.r2);
    // console.log(interPoints);
    highlightVenn();
  });

  //change the dinstance between the 2 centers of the circles
  var slider3 = document.getElementById("myRange3");
  var output3 = document.getElementById("demo3");
  output3.innerHTML = parseInt(slider3.value);

  //move only the center of the 2nd circle
  $('#myRange3').on('input', function() {
    output3.innerHTML = parseInt(this.value);

    crcl2.x2 = left_limit + Number(this.value);

    if (crcl1.r1 < crcl2.r2) {
      resetCanvasOpp();
    }
    else resetCanvas();

    interPoints = intersection(crcl1.x1, crcl1.y1, crcl1.r1, crcl2.x2, crcl2.y2, crcl2.r2);

    highlightVenn();
  });


  ///////////////////////////////////////////////////////////////////

  //get angle, in degrees, for point (ex, ey) from the horizontal line
  //passing through center (cx, cy)
  //rotation: clockwise
  function angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    // if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
  }


/////////////////////////////////////////////////////////////////////

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  ////////////////////////////////////////////////////////////////

  //returns the path for an arc of a circle from startAngle to endAngle
  //rotation: clockwise
  //angle 0 on point (0, radius)
  function describeArc(x, y, radius, startAngle, endAngle){

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
  }

  /////////////////////////////////////////////////////////

//});
