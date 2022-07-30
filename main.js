var METRIC = "Happiness-Score";
var YEAR = 2022;
let DOTS = document.getElementsByClassName("dot");
let MTX_IDX = ['Happiness-Score', 'GDP', 'Social-Support', 'Healthy-Life-Expectancy',
'Freedom', 'Trust', 'Generosity', 'Dystopia'];
let DESCRIPTIONS = [
'This slide shows the top 50 happiest countries. The score is used to determine which countries are happiest.'+
'The following slides shows each metric used in calculating the score.',
'This slide shows how much the GDP per person of the country contributed to the happiness of the country.',
'This slide shows how much social support in the country contributed to the happiness of the country.',
'This slide shows how much health and life expectancy of the country\'s population contributed to the happiness of the country.',
'This slide shows how much freedom contributed to the happiness of the country.',
'This slide shows how much trust of the people in the country contributed to the happiness of the country. Countries with high scores have low corruption.',
'This slide shows how much the generocity of the people of the country contributed to the happiness of the country.',
'This slide shows how much better the current country is when pinned against a fictional dystopian country. This metric was added to boost the scores of some of the low ranked countries.',
];

let AN = [
    [
        {
          note: {
            label: "The top countries are mostly in the Western Europe Region",
          },
          x: 120,
          y: 55,
          dy: -20,
          dx: 100,
        }
    ],
    [
      {
        note: {
          label: "Luxembourg has the highest GDP score for the third consecutive year",
        },
        x: 200,
        y: 25,
        dy: 20,
        dx: 250,
      }
    ],
    [
        {
            note: {
              label: "Mauritius is one of two African countries with high social support scores",
            },
            x: 120,
            y: 347,
            dy: 20,
            dx: 250,
        },
        {
            note: {
              label: "South Africa is the second country",
            },
            x: 120,
            y: 468,
            dy: -20,
            dx: 50,
        }
    ],
    [
        {
        note: {
          label: "The top 3 countries with highest life expectancy scores are all in Asia",
        },
        x: 100,
        y: 25,
        dy: 20,
        dx: 100,
      }
    ],
    [
        {
            note: {
              label: "Cambodia consistenly has one of the highest Freedom scores but it is usually not ranked highly overall",
            },
            x: 80,
            y: 25,
            dy: 20,
            dx: 100,
        }
    ],
    [
        {
            note: {
              label: "Both Singapore and Rawanda consistenly score amongst the top 3 countries with highest trust in government",
            },
            x: 60,
            y: 25,
            dy: 100,
            dx: 100,
        }
    ],
    [
        {
            note: {
              label: "None of the Western Europe Region countries are in the top 5 countries with highest generosity score",
            },
            x: 40,
            y: 25,
            dy: 10,
            dx: 100,
        },
        {
            note: {
              label: "The first Western Europe Region country to show up is United Kingdom at #8",
            },
            x: 30,
            y: 88,
            dy: 240,
            dx: 200,
        }
    ],
    [
        {
            note: {
              label: "Many countries with high Dystopia scores are also poorly ranked like Liberia",
            },
            x: 200,
            y: 25,
            dy: 40,
            dx: 200,
        }
    ]
]

function process(happinessdata, metric, year) {
    var colors = ["#FEBE93", "#ACEFD5","#BEAFE1", "#D2F4F3", "#99A885", "#90DAD9", "#FEED78", "#D291BC",
    "#75C7EA", "#C8B8A1", "#658C72", "#7CB5D2", "#E8D3F5", "#927E75", "#E4ED85", "#FDA7BE"];
    var margin = {top: 100, right: 150, bottom: 60, left: 150},
    width = 1200 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;
    var m = metric + "-" + year;
    var xdomain = 7.5;
    if(year == 2022){
        xdomain = 7500;
    }
    var rankeddata = happinessdata.filter(function(d,i){
        return d["Rank-"+year] != "";
    });
    console.log(METRIC + YEAR + m);
    rankeddata.sort(function(a,b){
        try {
            return d3.descending(parseFloat(a[m].replace(/,/g,"")), parseFloat(b[m].replace(/,/g,"")));
          }
          catch(err) {
            return d3.descending(parseFloat(a[m]), parseFloat(b[m]));
          }
    });

    var top50 = rankeddata.filter(function(d,i){
        return i < 50;
    });

    var y = d3.scaleBand().rangeRound([0,height]).domain(top50.map(function(d) { return d["Country"]; }))
    .paddingInner(0.15);
    var x = d3.scaleLinear()
    .domain([0, xdomain])
    .range([ 0, width]);
    
    var svg = d3.select("#chart").append("svg")
        .style("width", (width + margin.left + margin.right) + "px")
        .style("height", (height + margin.top + margin.bottom) + "px")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x))
    .selectAll("text").attr("transform", "translate(-10,0)rotate(-45)").style("text-anchor", "end");
    svg.append("g").call(d3.axisLeft(y));

    var Tooltip = d3.select("#detail").append("div").style("opacity", 0)
    .attr("class", "tooltip").style("background-color", "white").style("border", "solid")
    .style("border-width", "2px").style("border-radius", "5px").style("padding", "5px");
    var mouseover = function(event,d) {
        Tooltip.style("opacity", 1);
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1);
    };
    var mousemove = function(event,d) {
        Tooltip
          .html("<b>Country:</b> "+d["Country"]+"<br/>"+
          "<b>Region:</b> "+d["Region"]+"<br/>"+
          "<b>Rank:</b> "+d["Rank-"+year]+"<br/>"+
          "<b>Happiness Score:</b> "+d["Happiness-Score-"+year]+"<br/>"+
          "<b>GDP:</b> "+d["GDP-"+year]+"<br/>"+
          "<b>Social Support Score:</b> "+d["Social-Support-"+year]+"<br/>"+
          "<b>Healthy Life Expectancy Score:</b> "+d["Healthy-Life-Expectancy-"+year]+"<br/>"+
          "<b>Freedom Score:</b> "+d["Freedom-"+year]+"<br/>"+
          "<b>Trust Score:</b> "+d["Trust-"+year]+"<br/>"+
          "<b>Generosity Score:</b> "+d["Generosity-"+year]+"<br/>"+
          "<b>Dystopia Score:</b> "+d["Dystopia-"+year])
          .style("left", (d3.pointer(event,this)[0]) + "px")
          .style("top", (d3.pointer(event,this)[1]) + "px")
    };
    var mouseleave = function(event,d) {
        Tooltip
          .style("opacity", 0)
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 1)
    };
    svg.selectAll("bars")
        .data(top50)
        .enter()
        .append("rect")
        .attr("x", x(0) )
        .attr("y", function(d) { return y(d["Country"]); })
        .attr("width", function(d) { return x(d[m].replace(/,/g,"")); })
        .attr("height", y.bandwidth() )
        .attr("fill", function(d){return colors[parseInt((d["Rank-"+year]-1)/10)];})
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseleave);

        svg.append("text").attr("x", 900).attr("y", 130).text("Rank Ranges").style("font-size", "15px").attr("alignment-baseline","bottom right")
        for (let i = 0; i < colors.length; i++) {
            var start = i*10 + 1
            var end = (i + 1) *10
            var yloc = 130 + (i+1)*15
            svg.append("rect").attr("x",900).attr("y",yloc).attr("height", 10).attr("width", 10).style("fill", colors[i])
            svg.append("text").attr("x", 920).attr("y", yloc+10).text(start + "-" + end).style("font-size", "15px").attr("alignment-baseline","bottom right")
        }
        var idx = MTX_IDX.indexOf(metric);
        for (i = 0; i < DOTS.length; i++) {
            DOTS[i].className = DOTS[i].className.replace(" active", "");
        }
        DOTS[idx].className += " active";
        if (YEAR == 2022) {
            const makeAnnotations = d3.annotation().annotations(AN[idx]);
            svg.append('g').call(makeAnnotations);
        } else {
            var an = [
                {
                    note: {
                        label: "The scores' scale pre 2022 is 1000 times less than 2022's scale",
                      },
                      x: 660,
                      y: 500,
                      dy: -20,
                      dx: 100,
                }
            ]
            const makeAnnotations = d3.annotation().annotations(an);
            svg.append('g').call(makeAnnotations);
        }
}

function currentSlide(metric) {
    METRIC = metric;
    d3.selectAll("#chart > *").remove();
    d3.selectAll("#chart-text > *").remove();
    d3.selectAll("#detail > *").remove();
    d3.select("#chart-text").html(METRIC+'<br/>'+DESCRIPTIONS[MTX_IDX.indexOf(metric)]);
	d3.csv("https://raw.githubusercontent.com/maa-27/narrative-project/main/15-22-happiness-idx.csv").then(function(data){process(data, METRIC, YEAR)});
}

function nextSlide(){
    var idx = MTX_IDX.indexOf(METRIC);
    var newidx = idx+1;
    if (newidx >= MTX_IDX.length){
        newidx = 0;
    }
    currentSlide(MTX_IDX[newidx]);
}

function prevSlide(){
    var idx = MTX_IDX.indexOf(METRIC);
    var newidx = idx-1;
    if (newidx < 0){
        newidx = MTX_IDX.length-1;
    }
    currentSlide(MTX_IDX[newidx]);   
}

var slider = document.getElementById("myRange");
var rangetext = document.getElementById("range-text");

slider.oninput = function() {
    YEAR = this.value;
    rangetext.innerHTML = YEAR;
    currentSlide(METRIC);
}

currentSlide(METRIC, YEAR);