
////// SVG
var svg = d3.select("svg"),
    margin = { top: 40, right: 20, bottom: 140, left: 55 },
    margin2 = { top: 415, right: 20, bottom: 30, left: 55 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;

///Format dates
var parseDate = d3.timeParse('%Y %b');

//Définir la légende du graphe/////////////////////////////////////////////////////////////

cc = svg.append("circle").attr("cx",100).attr("cy",40).attr("r", 4).style("fill", "blue")
svg.append("circle").attr("cx",100).attr("cy",65).attr("r", 4).style("fill", "red")
svg.append("circle").attr("cx",100).attr("cy",90).attr("r", 4).style("fill", "black")
svg.append("text").attr("x", 130).attr("y", 42).text("PYTHON").style("font-size", "13px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 130).attr("y", 67).text("Language R").style("font-size", "13px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 130).attr("y", 90).text("MATLAB").style("font-size", "13px").attr("alignment-baseline","middle")
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





//Associer les données pour chaque axe :
var x = d3.scaleTime().range([0, width]), //Axe X des années  pour le focus
    x2 = d3.scaleTime().range([0, width]),//Axe X des années pour le contexte
    y = d3.scaleLinear().range([height, 0]), //Axe Y des données pour le focus
    y2 = d3.scaleLinear().range([height2, 0]); // Axe Y des données  pour le contexte


//Créer les axes
var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);
    yAxis.tickFormat(d3.format('d'));


//Spécifier le rectangle de sélection :
//Avec la fonction « brush » on va choisir la taille de rectangle de sélection de données :
var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);


//Créer les trois lines coresspondantes au focus


var line = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x(d.Year); })
    .y(function (d) { return y(d.python); })
    
var line_v2 = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x(d.Year); })
    .y(function (d) { return y(d.r); });
var line_v3 = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x(d.Year); })
    .y(function (d) { return y(d.matlab); });

//Créer les trois lines cpresspondantes au contexte

var line2 = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x2(d.Year); })
    .y(function (d) { return y2(d.python); });
var line2_v2 = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x2(d.Year); })
    .y(function (d) { return y2(d.r); });
var line2_v3 = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x2(d.Year); })
    .y(function (d) { return y2(d.matlab); });


svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

//Créer le groupe de svg focus

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Créer le groupe de svg contexte 
var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

//Lecture de données
var fisheye = d3.fisheye.circular().radius(200).distortion(2);

d3.csv("ressources/out.csv", type, function (error, data) {
    if (error) throw error;


    //On doit trouver le min des Y et leurs Max afin de bien représenter les axes sans débordement "perception visuelle".
    minY = Math.min(
    d3.min(data, function (d) { return d.python; }),
    d3.min(data, function (d) { return d.r; }),
    d3.min(data, function (d) { return d.matlab; })
    )

    maxY = Math.max(
        d3.max(data, function (d) { return d.python; }),
        d3.max(data, function (d) { return d.r; }),
        d3.max(data, function (d) { return d.matlab; })
        )
    //On définit les domaines de chaque axe
    x.domain(d3.extent(data, function (d) { return d.Year; })).nice();
    y.domain([minY, maxY]).nice();
    x2.domain(x.domain());
    y2.domain(y.domain());

    //Instancier le focus pour les trois lines

     path1 = focus.append("path")
        .attr("fill", "none")
        .datum(data)
        .attr("stroke", "blue")
        .style("stroke-width", 2)   
        .attr("class", "line")
        .attr("d", line);

     path2 = focus.append("path")
        .attr("fill", "none")
        .datum(data)
        .attr("stroke", "red")
        .style("stroke-width", 2)   
        .attr("class", "line2")
        .attr("d", line_v2);

     path3 = focus.append("path")
        .attr("fill", "none")
        .datum(data)
        .attr("stroke", "black")
        .style("stroke-width", 2)   
        .attr("class", "line3")
        .attr("d", line_v3);


        

        svg.on("mousemove", function () {
            fisheye.focus(d3.mouse(this));   
            path1.attr("d",function(d){
              
             for (var i = 0; i < d.length; i++) {
                dd[i].fisheye = fisheye(  {x:parseFloat(d[i].python),
                    y: parseFloat(d[i].python) } );
                  }
                 return d; 
      

                
            });

   

        });
        





    focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    focus.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

    //Instancier le context pour les trois lines

    context.append("path")
        .attr("fill", "none")
        .datum(data)
        .attr("stroke", "blue")
        .attr("class", "line")
        .attr("d", line2);

    context.append("path")
        .attr("fill", "none")
        .datum(data)
        .attr("stroke", "red")
        .attr("class", "line2")
        .attr("d", line2_v2);

    context.append("path")
        .attr("fill", "none")
        .datum(data)
        .attr("stroke", "black")
        .attr("class", "line3")
        .attr("d", line2_v3);

    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

 //Créer le rectangle de brush et Instancier leurs actions

    context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());
});
function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;

 //ignore brush-by-zoom

    var s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    focus.select(".line").attr("d", line);
    focus.select(".line2").attr("d", line_v2);
    focus.select(".line3").attr("d", line_v3);
    focus.select(".axis--x").call(xAxis);
}
function type(d) {
   
    d.Year = parseDate(String(d.Year))
    d.python = +d.python;
    d.r = + d.r;
    d.matlab = + d.matlab;
    return d;
}

function myFunction() {
var python ;
var r;
var matlab;
    python = document.getElementById("python");
    r = document.getElementById("r");
    matlab = document.getElementById("matlab");
    focus.select(".line").attr("opacity",python.checked == true ? 1 :0)
    focus.select(".line2").attr("opacity",r.checked == true ? 1 :0)
    focus.select(".line3").attr("opacity",matlab.checked == true ? 1 :0)
    context.select(".line").attr("opacity",python.checked == true ? 1 :0)
    context.select(".line2").attr("opacity",r.checked == true ? 1 :0)
    context.select(".line3").attr("opacity",matlab.checked == true ? 1 :0)
 
  }
 ////Le titre du graph     
svg.append("text")
.attr("x", (width / 2)+60)             
.attr("y", 0 - (margin.top / 2) +40)
.attr("text-anchor", "middle")
.style("fill", "#5a5a5a")
.style("font-weight", "300")
.style("font-size", "24px")
.text("The Most used languages in Data Science 2009-2020");
/// Les titres des axes

  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width+55)
    .attr("y", height + 78)
    .style("font-size","15px")
    .text("Date");
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -2)
    .attr("x", -50)
    .attr("dy", ".75em")
    .attr("dx", ".75em")
    .attr("transform", "rotate(-90)")
    .style("font-size","15px")   
    .text("Nombre de questions posées");

    /////////  Fisheye (Ne marche que sur Firefox 2017.2.5 j'ai pas trouvé où est le problème) ///////////////////////////////////////
    



    


    