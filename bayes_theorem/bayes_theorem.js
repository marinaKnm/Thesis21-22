$(document).ready(function () {
    //define the object literal of probabilities we need for this application
    probabilities = {
        d: 0.25,
        pd: 0.95,    //probability of positive test prior to having the disease
        nh: 0.85,    //probability of negative test prior to being healthy
        ppos: 0.35  //probability of having a positive test
    }

    //as soon as the website is loaded assign the corresponding probability to each range slider
    $(function() {
        $('#demo_d').html(0.25);
        $('#demo_h').html(0.75);
        $('#demo_pd').html(0.95);
        $('#demo_nd').html(0.05);
        $('#demo_ph').html(0.15);
        $('#demo_nh').html(0.85);
        update_BayesRule();
        update_ProbabilityOfTestResult();
        MathJax.typesetPromise();
    });

    var Canvas = {
        width: 500,
        height: 420
    };

    var rec1 = {    //bottom rectangle
        x: 54, 
        y: 4,
        width: 390,
        height: 390,
        color: "#3362df"
    };


    var rec3 = {    //this will be on top of rec1
        x: 54,  
        y: 4,
        width: 97.5,    //1/4 οf rec1s' width
        height: 390,
        color: "#ed3e4e"
    };


    var rec2 = {    //this will be on top of rec1
        x: rec1.x + rec3.width,
        y: 331.5, 
        width: rec1.width - rec3.width,
        height: rec1.height - 331.5 + 3, // 15/100 of rec1s' height (plus 3 because of the stroke width)
        color: "#052783"
    };

    var rec4 = {    //this will be on top of rec3
        x: rec3.x,
        y: 19.5,
        width: rec3.width,
        height: rec3.height - 19.5 + 3, // 95/100 of rec1s' height (plus 3 because of the stroke width)
        color: "#d9071b"
    };

    var canvas = d3.select("#visualization")
        .append("svg")
        .attr("width", Canvas.width)
        .attr("height", Canvas.height);


    var rect1, rect2, rect3, rect4;

    function draw_rectangle(rect) {
        r = canvas.append("rect")
            .attr("x", rect.x)
            .attr("y", rect.y)
            .attr("width", rect.width)
            .attr("height", rect.height)
            .attr("stroke", 'black')
            .attr("stroke-width", 3)
            .attr("fill", rect.color)
            .attr("fill-opacity", 0.45);

        return r;
    }

    rect1 = draw_rectangle(rec1);
    rect2 = draw_rectangle(rec2);
    rect3 = draw_rectangle(rec3);
    rect4 = draw_rectangle(rec4);

    var left_text = canvas.append("text")
        .attr('x', 0)
        .attr('y', rec4.y + 20)
        .html('P(+|D)');

    var right_text = canvas.append("text")
        .attr('x', 452)
        .attr('y', rec2.y + 20)
        .html('P(+|H)');

    var bottom_text = canvas.append("text")
        .attr('x', rec4.x + rec4.width - 40)
        .attr('y', 415)
        .html('P(D)');    

    //render graph of probabilities
    //////////////////////////////////////////////////////////////////////////////////
    //create the canvas that will render the graph
    var container_width = $(".container").width();
    var tree_canvas = d3.select("#graph")
            .append("svg")
            .attr("width", container_width)
            .attr("height", 550);

    var positionOfInterNodes = container_width/2;

	var graph = {
		nodes: [
            {name: "left_root", fx: 5, fy:260},
			{name: "D", fx: positionOfInterNodes/2, fy: 125, tag: "D", size: "20px"},
			{name: "H", fx: positionOfInterNodes/2, fy: 395, tag: "H", size: "20px"},
			{name: "pos_dis", fx: positionOfInterNodes, fy: 57.5, tag: "P(D\u2229+)\n=P(D)P(+|D)\n=P(+)P(D|+)\n=", size: "17px"},
			{name: "neg_dis", fx: positionOfInterNodes, fy: 192.5, tag: "P(D\u2229\u2212)\n=P(D)P(\u2212|D)\n=P(\u2212)P(D|\u2212)\n=", size: "17px"},
			{name: "pos_hea", fx: positionOfInterNodes, fy: 317.5, tag: "P(H\u2229+)\n=P(H)P(+|H)\n=P(+)P(H|+)\n=", size: "17px"},
			{name: "neg_hea", fx: positionOfInterNodes, fy: 462.5, tag: "P(H\u2229\u2212)\n=P(H)P(\u2212|H)\n=P(\u2212)P(H|\u2212)\n=", size: "17px"},
			{name: "right_root", fx: container_width - 5, fy:260},     
			{name: "+", fx: 3*positionOfInterNodes/2, fy: 125, tag: "+", size: "30px"},
			{name: "-", fx: 3*positionOfInterNodes/2, fy: 395, tag: "\u2212", size: "30px"}			
		],
		links: [
            {source: "left_root", target: "D", tag: "P(D)=", id: "d"},
			{source: "left_root", target: "H", tag: "P(H)=", id: "h"},
			{source: "D", target: "pos_dis", tag: "P(+|D)=", id: "p_posd"},
			{source: "D", target: "neg_dis", tag: "P(\u2212|D)=", id: "p_negd"},
			{source: "H", target: "pos_hea", tag: "P(+|H)=", id: "p_posh"},
			{source: "H", target: "neg_hea", tag: "P(\u2212|H)=", id: "p_negh"},
			{source: "right_root", target: "+", tag: "P(+)=P(D\u2229+)+P(H\u2229+)=", id: "p_pos", position: 2},
			{source: "right_root", target: "-", tag: "P(\u2212)=P(D\u2229\u2212)+P(H\u2229\u2212)=", id: "p_neg", position: 2},
			{source: "+", target: "pos_dis", tag: "P(D|+)=P(D\u2229+)/P(+)=", id: "p_dpos", position: 1, colour: "#a8e809"},
			{source: "+", target: "pos_hea", tag: "P(H|+) =P(H\u2229+)/P(+)= ", id: "p_hpos", position: 1, colour: "#a8e809"},
			{source: "-", target: "neg_dis", tag: "P(D|\u2212)=P(D\u2229\u2212)/P(\u2212)=", id: "p_dneg", position: 1, colour: "#15edb0"},
			{source: "-", target: "neg_hea", tag: "P(H|\u2212)=P(H\u2229\u2212)/P(\u2212)=", id: "p_hneg", position: 1, colour: "#15edb0"}
		]
	};

    
    //create a force simulation in order to draw the 2 trees
    var simulation1 = d3.forceSimulation(graph.nodes)
        .force("link", d3.forceLink(graph.links)
            .id(function(d) {	//το id ξεκαθαρίζει ποιο πεδίο (του κάθε 
                //κόμβου) θα χρησιμοποιηθεί για τις συνδέσεις αλλιώς 
                //χωρίς αυτό θα χρησιμοποιούταν το index
                return d.name;
            })
        )
        .force("charge", d3.forceManyBody().strength(-50))	//simulate electrostatic effects, it's negative so they push each other 
        .force("center", d3.forceCenter(Canvas.width/2, Canvas.height/2));

    function ticked(tree) {

        tree.link.attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                    return d.source.y;
                })
            .attr("x2", function(d) {
                    return d.target.x;
                })
            .attr("y2", function(d) {
                    return d.target.y;
                });

        tree.node.attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            })

    }
    
    
    function create_tree(graph) {
        var link = tree_canvas.append("g")
            .selectAll("line")
            .data(graph.links)
            .enter()
            .append("line")
            .attr("stroke-width", 3)
            .style("stroke", function(d) {
                if (d.colour !== undefined) {
                    return d.colour;
                }
                return "pink";
            });

        var node = tree_canvas.append("g")
            .selectAll("circle")
            .data(graph.nodes)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("fill", "orange")
            .attr("stroke", "yellow");

        var node_texts = tree_canvas
            .selectAll('text')
            .data(graph.nodes)
            .enter()
            .append('text')
            .attr('x', function(d) {
                if(d.size === "17px") {
                    return d.fx-20;
                } else {
                    return d.fx;
                }
            })
            .attr('y', function(d) {
                if(d.size === "17px") {
                    return d.fy+20;
                } else {
                    return d.fy;
                }
            })
            .style("font-size", d => d.size)
            .style("font-weight", "bolder")
            .attr("id", d=>d.name); 
    
            
        var node_tspans = node_texts
            .each(function(d) {
                if(d.tag != undefined) {
                    var arr = d.tag.split("\n");
                    for(let i=0; i<arr.length; i++) {
                        let a = d3.select(this)
                            .append('tspan')
                            .text(arr[i])
                            .attr('x', d.fx-20)
                            .attr('dy', i ? "1.2em" : 0)
                            .attr("id", function(d) {
                                return d.name + i;  
                            });
                    }
                }
            });

        var link_text = tree_canvas.append('g')
            .selectAll('text')
            .data(graph.links)
            .enter()
            .append('text')
            .text(d => d.tag)
            .style("font-weight", "bolder")
            .attr('x', function(d) {
                if (d.position === 1) {
                    return d.source.x - 110;
                } else if (d.position === 2) {
                    return ((d.target.x + d.source.x) / 2 - 50);
                } else if (d.id ==="d" || d.id ==="h") {
                    return ((d.target.x + d.source.x) / 2 - 15);
                } else {
                    return d.source.x;
                }
            })
            .attr('y',  function(d) {
                if (d.id === "p_hpos") {
                    return 192.5;
                } else if (d.id === "p_dneg") {
                    return 317.5;
                } 
                
                return d.target.y
            });

        return { link, node, node_texts, node_tspans, link_text };
    }


    var graph1 = create_tree(graph);
    simulation1.on("tick", ticked(graph1));

    //CALCULATE THE VALUES OF THE PROBABILITIES OF THE LINKS ON THE GRAPH
    function updateProbabilities() {
        graph1.link_text.text(function(d) {
            let res;

            if (d.id === "d") {
                res = probabilities.d.toFixed(2);
            } else if (d.id === "h") {
                res = (1 - probabilities.d).toFixed(2);
            } else if (d.id === 'p_posd') {
                res = probabilities.pd.toFixed(2);
            } else if (d.id === 'p_negd') {
                res = (1 - probabilities.pd).toFixed(2);
            } else if (d.id === 'p_posh') {
                res = (1 - probabilities.nh).toFixed(2);
            } else if (d.id === 'p_negh') {
                res = probabilities.nh.toFixed(2);
            } else if (d.id === "p_pos") {
                res = Number((probabilities.ppos)).toFixed(2);
            } else if (d.id === "p_neg") {
                res = (1 - probabilities.ppos).toFixed(2);
            } else if (d.id === 'p_dpos') {
                res = calculate_Bayes('D', '+');
            } else if (d.id === 'p_hpos') {
                res = calculate_Bayes('H', '+');
            } else if (d.id === 'p_dneg') {
                res = calculate_Bayes('D', '-');
            } else if (d.id === 'p_hneg') {
                res = calculate_Bayes('H', '-');
            }

            return d.tag + res;
        });
    }
    

    //write the possibility for each intersection node on the tree
    function Calculate_IntersectionNodes() {
        //get every tspan with the final value and update it on the new value
        d3.select("#pos_dis3")
            .text(function() {
                return "=" + (probabilities.d * probabilities.pd).toFixed(2);
            });
        d3.select("#neg_dis3")
            .text(function() {
                return "=" + (probabilities.d * (1-probabilities.pd)).toFixed(2);
            });
        d3.select("#pos_hea3")
            .text(function() {
                return "=" + ((1-probabilities.d) * (1-probabilities.nh)).toFixed(2);
            });
        d3.select("#neg_hea3")
            .text(function() {
                return "=" + ((1-probabilities.d) * probabilities.nh).toFixed(2);
            });
    }

    updateProbabilities();
    Calculate_IntersectionNodes();

    /* function to update the value of a range slider */
    var slider, output, value;
    function change_rangeSlider(range_id, demo_id) {
        slider = document.getElementById(range_id);
        output = document.getElementById(demo_id);
        value = parseInt(slider.value) / 100;
        value = (Math.round(value * 100) / 100).toFixed(2);
        output.innerHTML = value;
        return value * 100;
    }

    function update_rangeSlider(range_id, demo_id, val) {
        slider = document.getElementById(range_id);
        output = document.getElementById(demo_id);
        // val = (Math.round(val * 100) / 100).toFixed(2);
        output.innerHTML = val;
    }

    //Calculates P(+) or P(-)
    //type either '+' or '-'
    function calculate_UnionOfPartition(type) {
        if (type === '+') {
            return probabilities.d * probabilities.pd + (1 - probabilities.nh) * (1 - probabilities.d);
        }
        else {
            return probabilities.d * (1 - probabilities.pd) + (1 - probabilities.d) * probabilities.nh;
        }
    }

    //Calculates the probability of having a disease or being healthy prior to a test result
    //posssibility either 'D' or 'H'
    //test_result either '+' or '-'
    function calculate_Bayes(possibility, test_result) {
        if (possibility === 'D') {
            if (test_result === '+') {  // ==> P(D|+)
                let res =  probabilities.pd * probabilities.d //==> P(+|D)P(D)
                res = res / calculate_UnionOfPartition('+'); // ==> P(+|D)P(D)/P(+)

                return (Math.round(res * 100) / 100).toFixed(2);
            } else {                    // ==> P(D|-)
                res = probabilities.d * (1 - probabilities.pd); // ==> P(-|D)P(D)
                res = res / calculate_UnionOfPartition('-');    // ==> P(-|D)P(D)/P(-)

                return (Math.round(res * 100) / 100).toFixed(2);
            }
        }
        else {
            if (test_result === '+') {  // ==> P(H|+)
                let res =  (1 - probabilities.nh) * (1 - probabilities.d) //==> P(+|H)P(H)
                res = res / calculate_UnionOfPartition('+'); // ==> P(+|H)P(H)/P(+)

                return (Math.round(res * 100) / 100).toFixed(2);
            } else {                    // ==> P(H|-)
                res = (1 - probabilities.d) * probabilities.nh; // ==> P(-|H)P(H)
                res = res / calculate_UnionOfPartition('-');    // ==> P(-|H)P(H)/P(-)

                return (Math.round(res * 100) / 100).toFixed(2);
            }
        }
    }

    //Updates Bayes Rule on the page
    function update_BayesRule() {
        let result = calculate_Bayes('D', '+');
        result.toString();
        result = '$$P(D|+) = \\frac{P(D)P(+|D)}{P(+)} = \\frac{P(D)P(+|D)}{P(D)P(+|D) + P(H)P(+|H)} = {\\color{red}' + result + '}$$';
        $("#bayes_rule").html(result);
    }


    //Updates P(+) and P(-) on the page
    function update_ProbabilityOfTestResult() {
        let num = calculate_UnionOfPartition('+');
        let num1 = probabilities.ppos = (Math.round(num * 100) / 100).toFixed(2);
        num1.toString();
        let num2 = 1 - probabilities.ppos;
        num2 = (Math.round(num2 * 100) / 100).toFixed(2);
        num2.toString();
        str = '$$P(+) = P(+|D)P(D) + P(+|H)P(H) = {\\color{red}' + num1 +'},$$ $$P(-) = P(-|D)P(D) + P(-|H)P(H) = {\\color{red}'+ num2 +'}$$';
        $("#partition").html(str);
    }


    //UPDATES EVERY PROBABILITY ON THE PAGE
    function update_values() {
        //update the value of bayes rule
        update_BayesRule();
        update_ProbabilityOfTestResult();
        MathJax.typesetPromise();
        //update the values on the trees
        updateProbabilities();
        Calculate_IntersectionNodes();
        //reset the simulation
        reset_svg();
    }

    $("#disease").on('input', function () {
        value = change_rangeSlider('disease', 'demo_d');
        update_rangeSlider('healthy', 'demo_h', (100 - value)/100);
        bottom_text.attr('x', rec4.x + rec4.width - 40);
        probabilities.d = value/100;

        let width = value * rec1.width / 100;
        
        rec3.width = rec4.width = width;
        rec2.x = rec3.width + rec1.x;
        rec2.width = rec1.width - rec3.width;

        rect3.attr('width', width);
        rect4.attr('width', width);
        rect2.attr('x', rec2.x).attr('width', rec2.width);
    });
    
    $("#disease").change(function() {
        update_values();
    });

    $("#healthy").on('input', function () {
        value = change_rangeSlider('healthy', 'demo_h');
        update_rangeSlider('disease', 'demo_d', (100 - value)/100);
        probabilities.d = (100 - value)/100;
        
        
        let width = (100 - value) * rec1.width / 100;
        
        rec3.width = rec4.width = width;
        rec2.x = rec3.width + rec1.x;
        rec2.width = rec1.width - rec3.width;

        rect3.attr('width', width);
        rect4.attr('width', width);
        rect2.attr('x', rec2.x).attr('width', rec2.width);
        bottom_text.attr('x', rec4.x + rec4.width - 40);
    });

    $("#healthy").change(function() {
        update_values();
    });

    $("#positive_d").on('input', function () {
        value = change_rangeSlider('positive_d', 'demo_pd');
        update_rangeSlider('negative_d', 'demo_nd', (100 - value)/100);
        probabilities.pd = value/100;

        let y = value * rec1.height / 100 - 4;
        rec4.y = rec1.height - y;
        rec4.height = rec3.height - rec4.y + 3;

        left_text.attr('y', rec4.y + 20);

        rect4.attr('y', rec4.y).attr('height', rec4.height);
    });

    $("#positive_d").change(function() {
        update_values();
    });

    $("#negative_d").on('input', function () {
        value = change_rangeSlider('negative_d', 'demo_nd');
        update_rangeSlider('positive_d', 'demo_pd', (100 - value)/100);
        probabilities.pd = (100 - value)/100;

        let y = (100 - value) * rec1.height / 100 - 4;
        rec4.y = rec1.height - y;
        rec4.height = rec3.height - rec4.y + 3;

        left_text.attr('y', rec4.y + 20);

        rect4.attr('y', rec4.y).attr('height', rec4.height);
    });
    
    $("#negative_d").change(function() {
        update_values();
    });

    $("#positive_h").on('input', function () {
        value = change_rangeSlider('positive_h', 'demo_ph');
        update_rangeSlider('negative_h', 'demo_nh', (100 - value)/100);
        probabilities.nh = (100 - value)/100;

        let y = value * rec1.height / 100 - 4;
        rec2.y = rec1.height - y;
        rec2.height = rec1.height - rec2.y + 3;

        right_text.attr('y', rec2.y + 20);

        rect2.attr('y', rec2.y).attr('height', rec2.height);
    });

    $("#positive_h").change(function() {
        update_values();
    });

    $("#negative_h").on('input', function () {
        value = change_rangeSlider('negative_h', 'demo_nh');
        update_rangeSlider('positive_h', 'demo_ph', (100 - value)/100);
        probabilities.nh = value/100;

        let y = (100 - value) * rec1.height / 100 - 4;
        rec2.y = rec1.height - y;
        rec2.height = rec1.height - rec2.y + 3;

        right_text.attr('y', rec2.y + 20);

        rect2.attr('y', rec2.y).attr('height', rec2.height);
    });

    $("#negative_h").change(function() {
        update_values();
    });


    //SIMULATION FUNCTIONALITY
    var myCanvas = {
        width: 912,
        height: 450,
        stroke_width: 3
    }

    //append a svg
    var svg = d3.select("#simulation")
      .append("svg")
        .attr("width", $("#simulation").width())
        .attr("height", myCanvas.height)
        .attr("id", "sim");

    var crcl1 = {
        center_x: myCanvas.width/4,
        radius: myCanvas.height/2 - myCanvas.stroke_width,
        center_y: myCanvas.height/2,
        colour: "#a8e809"
    }
  
    var crcl2 = {
        center_x: 3*myCanvas.width/4,
        radius: myCanvas.height/2 - myCanvas.stroke_width,
        center_y: myCanvas.height/2,
        colour: "#15edb0"
    }
 
    function draw_circle(crcl) {
        var circle = svg
            .append('circle')
            .attr('r', crcl.radius)
            .attr('cx', crcl.center_x)
            .attr('cy', crcl.center_y)
            .attr('fill', 'none')
            .attr('stroke', crcl.colour)
            .attr('stroke-width', myCanvas.stroke_width);
    }

    var circle1 = draw_circle(crcl1);
    var circle2 = draw_circle(crcl2);

    var subnote = d3.select("#simulation")
        .append("svg")
        .attr("width", $("#simulation").width())
        .attr("height", 30);

    //draws a rect and a circle below a circle and writes the corresponding text
    //type: 1 for the left circle and 2 for the right circle
    function create_subnote(crcl, colour, type) {
        subnote.append('rect')
        .attr('x', crcl.center_x - crcl1.radius - 5)
        .attr('y', 0)
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', crcl.colour);

        subnote.append('circle')
            .attr('cx', crcl.center_x)
            .attr('cy', 11)
            .attr('r', 10)
            .attr('fill', colour);

        subnote.append('text')
            .attr('x', crcl.center_x - crcl1.radius - 5 + 23)
            .attr('y', 15)
            .html(() => {
                if (type===1) return 'Θετικά Τεστ'
                else return 'Αρνητικά Τεστ'
            });
        
        subnote.append('text')
            .attr('x', crcl.center_x + 13)
            .attr('y', 15)
            .html(() => {
                if (type===1) return 'Ασθενής'
                else return 'Υγιής'
            });
    }
    
    create_subnote(crcl1, "#F8766D",1);
    create_subnote(crcl2, "#00BA38",2);

    var people, type;
    $("#submit").click(function(e){
        e.preventDefault();

        reset_svg();

        var pdpos = Number((probabilities.d * probabilities.pd).toFixed(2)); //P(D Λ +)
        var phpos = Number(((1-probabilities.d) * (1-probabilities.nh)).toFixed(2)); //P(H Λ +)
        var pdneg = Number((probabilities.d * (1-probabilities.pd)).toFixed(2)); //P(D Λ -)
        var phneg = Number(((1-probabilities.d) * probabilities.nh).toFixed(2)); //P(H Λ -)


        //create lists of objects for each test result
        var pos_list = [];
        var neg_list = [];

        people = $('#quantity').val();  //get number of dots
        type = $('#dots').val();        //get what each dot represents

        if(people < 10 || people > 1000) {
            alert("Ο δοσμένος αριθμός πρέπει να είναι μεταξύ 10 και 1000.");
            return;
        }

        /////////////////////////// DATA ////////////////////////////
        //for those testing positive
        var diseased = pdpos * people; //find number of people that actually have the disease
        var healthy = phpos * people;  //find number of people that are healthy 
        create_data(pos_list, 1, diseased, 1);
        create_data(pos_list, diseased+1, diseased+healthy, 2);

        //for those testing negative
        diseased = pdneg * people; //find number of people that actually have the disease
        healthy = phneg * people;  //find number of people that are healthy 
        create_data(neg_list, 1, diseased, 1);
        create_data(neg_list, diseased+1, diseased+healthy, 2);
        /////////////////////////////////////////////////////////////

        var node1 = create_nodes(crcl1, pos_list);
        var node2 = create_nodes(crcl2, neg_list);

        // Features of the forces applied to the nodes:
        var sim1 = d3.forceSimulation()
        .force("x", d3.forceX().strength(0.5).x( function(d){ return x(d.group) } ))
        .force("y", d3.forceY().strength(0.1).y( myCanvas.height/2 ))
        .force("center", d3.forceCenter().x(crcl1.center_x).y(crcl1.center_y)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.1).radius(10).iterations(1)) // Force that avoids circle overlapping

        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        sim1
            .nodes(pos_list)
            .on("tick", function(d){
            node1
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })
            })

        // Features of the forces applied to the nodes:
        var sim2 = d3.forceSimulation()
            .force("x", d3.forceX().strength(0.5).x( function(d){ return x(d.group) } ))
            .force("y", d3.forceY().strength(0.1).y( myCanvas.height/2 ))
            .force("center", d3.forceCenter().x(crcl2.center_x).y(crcl2.center_y)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(-1)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(.1).radius(10).iterations(1)) // Force that avoids circle overlapping

        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        sim2
            .nodes(neg_list)
            .on("tick", function(d){
            node2
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })
            })

        showMessage(type, people);
    });

    

    //type: 1 for diseased and 2 for healthy
    function create_data(list, start, end, type) {

        for (i=start; i <= end; i++) {
          var object = {};  
          object['name']=i;
          object["group"] = type;
          list.push(object);
        }        
    }

    
    // A scale that gives a X target position for each group
    var x = d3.scaleOrdinal()
      .domain([1, 2])
      .range([50, 200]);

    // A color scale
    var color = d3.scaleOrdinal()
      .domain([1, 2])
      .range(["#F8766D", "#00BA38"]);

    function create_nodes(crcl, list) {
        // Initialize the circle: all located at the center of circle area
        var node = svg.append('g')
            .selectAll("circle")
            .data(list)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("cx", crcl.center_x)
            .attr("cy", crcl.center_y)
            .style("fill", function(d){ return color(d.group)})
            .style("fill-opacity", 0.8);

        return node;
    }

    //removes visualization from the simulation
    function reset_svg() {
        svg
            .selectAll("g")
            .remove();

        svg.
            selectAll("text.message")
            .remove();
    }

    function showMessage(type, quantity) {
        let str1, str2, people;

        if (type == 1) {
            people = 1;
        } else if (type == 2) {
            people = 10;
        } else if (type == 3) {
            people = 100;
        } else if (type == 4) {
            people = 1000;
        } else if (type == 5) {
            people = 1000000;
        }

        str1 = (people * probabilities.ppos * quantity).toFixed(0) + " άτομα βγήκαν θετικά\n"
        + "αλλά " + (people * probabilities.d * probabilities.pd * quantity).toFixed(0) +" έχουν πραγματικά\n"
        + "την ασθένεια.";
    
        str2 = (people * (1-probabilities.ppos) * quantity).toFixed(0) + " άτομα βγήκαν αρνητικά\nστην ασθένεια,\nαλλά τα "+ 
        (people * (1-probabilities.d) * probabilities.nh * quantity).toFixed(0) +" είναι πραγματικά υγιή.";

        //show message, append a text element to the svg
        var text = svg.append("text")
            .attr("class", "message")
            .attr('x', crcl2.center_x + crcl2.radius + 4)
            .attr('y', 40);

        //append a tspan element to text for every data
        text.selectAll("tspan")
            .data((str1 + " \n " + str2).split("\n"))    //list of strings
            .enter()
            .append("tspan")
            .text(d => d)
            .attr("x", crcl2.center_x + crcl2.radius + 4)
            .attr("dy", 22);
            
    }
    
});
