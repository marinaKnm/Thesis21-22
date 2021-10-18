$(document).ready(function(){

 $(".Button").hover(function() {
  $(this).css("background-color", "pink");
  },function(){
    $(this).css("background-color", "#f4f4f4");
  });

 $('#A').click(function() {
   $("#set").append("A");
 });
 $('#B').click(function() {
   $("#set").append("B");
 });
 $('#Union').click(function() {
  $('#set').append('&cup;');
 });
 $('#Intersection').click(function() {
  $('#set').append('&cap;');
 });
 $('#Compl').click(function() {
   $("#set").append("'");
 });
 $('#leftPar').click(function() {
   $("#set").append("(");
 });
 $('#rightPar').click(function() {
   $("#set").append(")");
 });
 $('#EmptySet').click(function() {
   $('#set').append('&empty;');
 });

 $('#Delete').click(function(index, value) {
   var myInput = $('.text-box').html();
   myInput = myInput.substring(0, myInput.length - 1);
   $('#set').text(myInput);
 });

 $('#Reset').click(function() {
   $('.text-box').empty();
 });

});
