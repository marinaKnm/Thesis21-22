$(document).ready(function(){

function include(file) {

  var script  = document.createElement('script');
  script.src  = file;
  script.type = 'text/javascript';
  script.defer = true;

  document.getElementsByTagName('head').item(0).appendChild(script);

}

/* Include Many js files */
include('functions.js');
include('probabilities.js');
// console.log("master:" + "circle1 rad = " + crcl1.r1 + " circle2 rad = " + crcl1.r2)
// console.log("master: "+ myResult);

});
