var wid = $("svg").width();
var hgt = $("svg").height();
var sampleSpace = wid*hgt; //sample space area


$('#myRange1').on('input', function() {

  output1.innerHTML = parseInt(this.value);
  crcl1.r1 = parseInt(this.value);
  //console.log("probab1! " + crcl1.r1);
  //console.log("embadon1: " + intersectionArea(crcl1, crcl2));

  //console.log(wid*hgt);
  console.log("probability: " + probability(crcl1, crcl2, myResult));
  //console.log("cnv: " + canvas.width);

});

$('#myRange2').on('input', function() {
  output2.innerHTML = parseInt(this.value);
  crcl2.r2 = parseInt(this.value);
  //console.log("probab2! " + crcl2.r2);
  //console.log("embadon2: " + intersectionArea(crcl1, crcl2));

  console.log("probability: " + probability(crcl1, crcl2, myResult));
});

$('#myRange3').on('input', function() {
  output3.innerHTML = parseInt(this.value);
  crcl2.x2 = left_limit + Number(this.value);
  //console.log("probab3! " + crcl1.r1 + " " + crcl2.r2);
  //console.log("embadon3: " + intersectionArea(crcl1, crcl2));

  console.log("probability: " + probability(crcl1, crcl2, myResult));
});


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
