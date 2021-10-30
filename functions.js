$(document).ready(function(){   //make sure the document is already loaded
/*
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  console.log(ctx);

  ctx.fillStyle = "#e4dada";//"yellow";
  ctx.lineWidth = 3;

  var circle1 = {
      x: 250,
      y: 250,
      r: 150,
      color: "green"
  };
  var circle2 = {
      x: 450,
      y: 250,
      r: 150,
      color: "orange"
  };

  ctx.beginPath();
  ctx.arc(circle1.x, circle1.y, circle1.r, 0, 2 * Math.PI, false);
  ctx.strokeStyle = circle1.color;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(circle2.x, circle2.y, circle2.r, 0, 2 * Math.PI, false);
  ctx.strokeStyle = circle2.color;
  ctx.stroke(); */
  var x1 = 250,
      y1 = 250,
      r1 = 150, //150
      x2 = 450,
      y2 = 250,
      r2 = 80; //150

  var canvas = d3.select("body")
             .append("svg") //so we append the svg element to our page
             //now let's give some properties
             .attr("width", 725) //when we are styling svg elements, we use attr method
             .attr("height", 500) //instead of style method
             .style("margin-left","400px")
             .style("background-color","#e4dada")
             .style("border","solid 3px");
  //Let's start by creating a circle:
  var circle1 = canvas.append("circle")
                .attr("cx", x1) //we want to give it a horizontal position
                .attr("cy", y1)
                .attr("r", r1) //radius
                .attr("stroke","black") // .attr("stroke","green") 77777&&&&&777777
                .attr("stroke-width",3)
                .attr("fill","none");

  var circle2 = canvas.append("circle")
                .attr("cx", x2) //we want to give it a horizontal position
                .attr("cy", y2)
                .attr("r", r2) //radius
                .attr("stroke","black") // .attr("stroke","orange") 44444444444444$$$$$$44444444444
                .attr("stroke-width",3)
                .attr("fill","none");

  var interPoints = intersection(x1, y1, r1, x2, y2, r2);

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
  });

  function showErrorMessage(str) {
    $('.error_msg').html(str);
    $('.error_msg').fadeIn(3000);
    $('.error_msg').fadeOut(3000);
  }

  function intersection(x0, y0, r0, x1, y1, r1) {
      var a, dx, dy, d, h, rx, ry;
      var x2, y2;

      /* dx and dy are the vertical and horizontal distances between
       * the circle centers.
       */
      dx = x1 - x0;
      dy = y1 - y0;

      /* Determine the straight-line distance between the centers. */
      d = Math.sqrt((dy * dy) + (dx * dx));

      /* Check for solvability. */
      if (d > (r0 + r1)) {
        /* no solution. circles do not intersect. */
        return false;
      }
      if (d < Math.abs(r0 - r1)) {
        /* no solution. one circle is contained in the other */
        // if (r0 < r1) {
        //   circle1.attr("fill","lightblue");
        // }
        // else {
        //   circle2.attr("fill","lightblue");
        // }
        return -1;
      }

      /* 'point 2' is the point where the line through the circle
       * intersection points crosses the line between the circle
       * centers.
       */

      /* Determine the distance from point 0 to point 2. */
      a = ((r0 * r0) - (r1 * r1) + (d * d)) / (2.0 * d);

      /* Determine the coordinates of point 2. */
      x2 = x0 + (dx * a / d);
      y2 = y0 + (dy * a / d);

      /* Determine the distance from point 2 to either of the
       * intersection points.
       */
      h = Math.sqrt((r0 * r0) - (a * a));

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

    if (interPoints == -1) {
      if (r1 < r2) {
        circle1.attr("fill",color);
      }
      else {
        circle2.attr("fill",color);
      }
    }
    else {
      canvas.append("g")
        .append("path")
        .attr("d", function() {
          return "M" + interPoints[0] + "," + interPoints[2] + "A" + r2 + "," + r2 +
            " 0 0,1 " + interPoints[1] + "," + interPoints[3]+ "A" + r1 + "," + r1 +
            " 0 0,1 " + interPoints[0] + "," + interPoints[2];
        })
        .style('fill', color)
        .style("stroke","black");

    }

  }



  function findComplement(index, apostrophes) {

    let array;
    array = stack.deleteLastpaintedArea();

    if (apostrophes[index] === 1) { //if we have complement
      for (let j = 0; j < array.length; j++) {
        if (array[j] === 0) {
          array[j] = 1;
        }
        else array[j] = 0;
      }
    }

    return array;

  }



  class Stack {
    constructor() {
      this.paintedAreaStack = new Array();
      this.operatorsStack = new Array();
    }
    insertpaintedArea(paintedArea) {
      this.paintedAreaStack.push(paintedArea);
    }
    deleteLastpaintedArea() {
      return this.paintedAreaStack.pop();
    }
    insertoperator(operator) {
      this.operatorsStack.push(operator);
    }
    deleteLastoperator() {
      return this.operatorsStack.pop();
    }
  }


  var stack = new Stack();


  // a parser for the expression in order to find which area to paint on the canvas 
  function myParser(inputStr) {

    //end of recursion if the expression is a set
    if (inputStr === 'A') {
      stack.insertpaintedArea([1,0,1,0]);
      return 0;
    } else if (inputStr === 'B') {
      stack.insertpaintedArea([0,1,1,0]);
      return 0;
    } else if (inputStr === '\u2205') { //empty set
      stack.insertpaintedArea([0,0,0,0]);
      return 0;
    }


    let flag = 0;
    let start;
    let terms = new Array();
    let operators = new Array();
    let apostrophes = new Array(); // (bit array) keeps indexes of terms that an apostrophe is following.

    //Reading character by character in order to find the terms and the operators.
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

    let marked = new Array(operators.length); //bit array of operators, marked[i]=1 => operators[i] has been used
    for (let i = 0; i < marked.length; i++) {
      marked[i] = 0;
    }


    let array1, array2;

    //calculate for every intersection
    for (let i = 0; i < operators.length; i++) {

      if (operators[i] === '\u2229') { //if operator is an intersection
        marked[i] = 1; //so that we know that this operator has been used

        stack.insertoperator(operators[i]); //add operator into the stack

        //recursive calls for the left and right terms of operator[i]
        myParser(terms[i]);
        myParser(terms[i+1]);

        array2 = findComplement(i+1, apostrophes);
        array1 = findComplement(i, apostrophes);

        stack.deleteLastoperator();
         // console.log(array1);
         // console.log(array2);

        //put the result of intersection operator at array1
        for (let j = 0; j < array1.length; j++) {
          array1[j] = array1[j] + array2[j];
          if (array1[j] === 2) {
            array1[j] = 1;
          } else array1[j] = 0;
        }

        stack.insertpaintedArea(array1);
         // console.log(array1);
      }
    }

    //calculate for the rest of the expressions (unions)
    for (let i = 0; i < operators.length; i++) {
      if (operators[i] === '\u222A') { //if operator is a union
        if (operators[i-1] != '\u2229' || i === 0 || i === operators.length-1) { //if previous operator isn't intersection

          if (i === operators.length-1) {
            i++;
          }
          myParser(terms[i]);
          array1 = findComplement(i, apostrophes);
          stack.insertpaintedArea(array1);
        }
      }
    }

    // console.log(operators);
    // console.log(marked);
    // console.log(terms);
    // console.log(operators);
    // console.log(apostrophes);
    //////////////////////////

  }

  //make sure this is not an ivalid input
  $('#Submit').click(function() {
    let inputStr = $('.text-box').html();      //get the text from the text-box

    //if input starts with union or intersection or ' or ) accordingly show error message
    switch (inputStr[0]) {
      case '\u222A':  //union
        showErrorMessage('Μη έγκυρη πρόταση. Πρέπει να ξεκινάει με σύνολο ή αριστερή παρένθεση.');
        return;
      case '\u2229': //intersect
        showErrorMessage('Μη έγκυρη πρόταση. Πρέπει να ξεκινάει με σύνολο ή αριστερή παρένθεση.');
        return;
      case "'":
        showErrorMessage('Μη έγκυρη πρόταση. Πρέπει να ξεκινάει με σύνολο ή αριστερή παρένθεση.');
        return;
      case ')':
        showErrorMessage('Μη έγκυρη πρόταση. Πρέπει να ξεκινάει με σύνολο ή αριστερή παρένθεση.');
        return;
    }

    let prev="";
    let stack = "";
    for(let i=0; i<inputStr.length; i++) {      //check character by character

      //make sure that 2 sets are not given consequently
      if ((prev === 'A' || prev === 'B') && (inputStr[i] === 'A' || inputStr[i] === 'B')) {
        showErrorMessage('Μη έγκυρη πρόταση. Δόθηκαν δύο σύνολα στη σειρά.');
        return;
      }

      //make sure that 2 union or intersection signs are not given consequently
      if ((prev === '\u222A' || prev === '\u2229') && (inputStr[i] === '\u2229' || inputStr[i] === '\u222A')) {
        showErrorMessage('Μη έγκυρη πρόταση. Δόθηκε ' +prev+ ' και αναμένεται A, Β, (, ' + '\u2205');
        return;
      }

      //make sure that after a left parenthesis we get: ', union sign, intersection sign
      if(prev === ')' && (inputStr[i] === 'A' || inputStr[i] === 'B' || inputStr[i] === "\u2205")) {
        showErrorMessage("Μη έγκυρη πρόταση. Δόθηκε " +prev+ " , αναμένεται \u222A, \u2229, '");
        return;
      }

      //make sure that left parethesis and right parenthesis are balanced and paired
      if (inputStr[i] === '(') {
        stack = stack + '(';
      }
      if(inputStr[i] === ')') {
        stack = stack.substring(0, stack.length - 1); //if right parenthesis is found pop from stack
      }

      prev = inputStr[i];
    }
    
    if(stack !== "") {  //if stack is not empty then left parethesis and right parenthesis are not balanced and paired
      showErrorMessage('Μη έγκυρη πρόταση. Οι παρενθέσεις δεν είναι ισοζυγισμένες.');
    }

    //Now we'll visualize user's set in the Venn diagram
    //mystr = "A2B1(A5B3(B1A)2A)1(S$D)1A";
    // myParser(inputStr);

    //  INTERSECTION:
    // fill_intersection("lightblue");
    // //////////////////////////////////////////////////////////////////////
    //ONLY SET A:
    // circle1.attr("fill","lightblue");
    // fill_intersection("#e4dada");
    // //ONLY SET B:
    // circle2.attr("fill","lightblue");
    // fill_intersection("#e4dada");
    /////////////
    // UNION:
    // circle1.attr("fill","lightblue");
    // circle2.attr("fill","lightblue");
    // fill_intersection("lightblue");
    /////////////
    // DEIGMATIKOS XWROS:
    // canvas.style("background-color","lightblue");
    /////////////
    // MONO DEIGMATIKOS XWROS:
     // canvas.style("background-color","lightblue");
     // circle1.attr("fill","#e4dada");
     // circle2.attr("fill","#e4dada");
     // fill_intersection("#e4dada");

  });

});
