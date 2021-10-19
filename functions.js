$(document).ready(function(){   //make sure the document is already loaded

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
                .attr("cx", 250) //we want to give it a horizontal position
                .attr("cy", 250)
                .attr("r", 150) //radius
                .attr("stroke","green")
                .attr("stroke-width",3)
                .attr("fill","none");

   var circle2 = canvas.append("circle")
                .attr("cx", 450) //we want to give it a horizontal position
                .attr("cy", 250)
                .attr("r", 150) //radius
                .attr("stroke","orange")
                .attr("stroke-width",3)
                .attr("fill","none");

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

  //make sure this is not an ivalid input
  $('#Submit').click(function() {
    let inputStr = $('.text-box').html();      //get the text from the text-box

    //if input starts with union or intersection or ' or ) accordingly show error message
    switch (inputStr[0]) {
      case '\u222A':
        showErrorMessage('Μη έγκυρη πρόταση. Πρέπει να ξεκινάει με σύνολο ή αριστερή παρένθεση.');
        return;
      case '\u2229':
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
        // console.log('prev= '+prev);
        // console.log('current= ' +inputStr[i]);
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
        stack = stack.concat(stack, '(');  //push left parenthesis into the stack
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
    //d3.select('#set'+i).style('fill',fill);
    circle1.attr("fill","pink");
    circle2.attr("fill","pink");
  });

});
