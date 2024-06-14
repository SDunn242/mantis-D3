// create data
var data = [{x: 0, y: 20}, {x: 150, y: 150}, {x: 300, y: 100}, {x: 450, y: 20}, {x: 600, y: 130}]

// create svg element:
var svg = d3.select("#line").append("svg").attr("width", 800).attr("height", 200)

// prepare a helper function
var lineFunc = d3.line()
  .x(function(d) { return d.x })
  .y(function(d) { return d.y })

// Add the path using this helper function
svg.append('path')
  .attr('d', lineFunc(data))
  .attr('stroke', 'black')
  .attr('fill', 'none');
