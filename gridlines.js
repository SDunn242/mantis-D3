
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


// Load JSON data
d3.json("data.json").then(data => {
    const inSituModel = data.fd_parameters.in_situ_model;
    const inputParameters = data.fd_parameters.input_parameters;

    console.log(inputParameters); 
  
  // set the ranges and domains of x axis
  var x = d3.scaleLinear().range([0, width]).domain([0,((inputParameters.nxtot-1) * inputParameters.dl)]);
  
  // set the range and domains of y axis (note these are inverted due to [0,0] being top left)
  var y = d3.scaleLinear().range([height,0]).domain([((inputParameters.nztot-1) * inputParameters.dl), 0]);

  // gridlines in x axis function
  function make_x_gridlines() {		
      return d3.axisBottom(x)
          .ticks(inputParameters.nxtot/inputParameters.dl)
  }

  // gridlines in y axis function
  function make_y_gridlines() {		
      return d3.axisLeft(y)
          .ticks(inputParameters.nztot/inputParameters.dl)
  }

  // add the X gridlines
  svg.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        )

  // add the Y gridlines
  svg.append("g")			
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )

  // add the X axis
  svg.append("g")
        .attr("transform", "translate(0,0)")
        .call(d3.axisTop(x));

  // add the Y Axis
  svg.append("g")
        .call(d3.axisLeft(y));

  // Add input source
  svg.selectAll("circle")
        .data([data])
        .enter()
        .append("circle")
        .attr("cx", function(d){
                   return x(d.fd_parameters.input_parameters.x_source);})
        .attr("cy", function(d){return y(d.fd_parameters.input_parameters.z_source);})
        .attr("r", function(d) {return 8;})
        .style("fill", "rgb(255, 255, 0)")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("opacity", 0.5);

// add horizontal receivers
//generate array of x values
const arrayRange = (start, stop, step) =>
    Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
    );

//generate arrays of y values for vertical receivers


let m = 'verticalArray';
var x_array = [];
var y_array = [];
var len_y_array = [0];

for (let a = 0; a < inputParameters.vsp_x.length; a++) {
    y_array = y_array.concat(arrayRange(inputParameters.vsp_sz[a], inputParameters.vsp_ez[a], inputParameters.del_vsp[a]));
    //generate list of the lengths of each vertical array
    console.log(y_array.length);
    len_y_array = len_y_array.concat(y_array.length);
    console.log(len_y_array);
    console.log(len_y_array[a]);
} 

for (let i = 0; i < len_y_array.length; i++) {
    for (let j = len_y_array[i]; j < len_y_array[i+1]; j++) {
    x_array = x_array.concat(inputParameters.vsp_x[i]);
    console.log(inputParameters.vsp_x[i]);
    }
}

console.log(y_array);
console.log(len_y_array);
console.log(x_array);



// add the vertical arrays
svg.selectAll("rect")
        .data([data])
        .enter()
        .append("g")
        .each(function(d){
            d3.select(this).selectAll("rect")
            .data(d.fd_parameters.input_parameters.vsp_x)
            .enter()
            .append("rect")
            //i refers to the array with the x coordinates of the rect vsp_x
            .attr("x", function(i){
                console.log(x(i));
                console.log(d.fd_parameters);
                console.log("len_y_array:");
                console.log(len_y_array);
                console.log(i);
                return x(i);})
            .attr("y", function(d,i){ 
                console.log("y is");
                console.log(inputParameters.vsp_sz[i]);
                return y(inputParameters.vsp_sz[i]);})
            .attr("height", function(d,i){return y(inputParameters.vsp_ez[i] - inputParameters.vsp_sz[i]);})
            .attr("width", function(){return 50;})
            .style("fill", "rgb(255, 255, 0)")
            .style("stroke", "black")
            .style("stroke-width", 1)
            .style("opacity", 0.5);
})

//make horizontal receivers array
rec_array = arrayRange(inputParameters.start_rcvr, inputParameters.end_rcvr,inputParameters.del_rcvr, 1); // [1,2,3,4,5]

svg.selectAll("rect.horzArray")
    .data(rec_array)
    .enter()
        .append("rect")
           .attr("class", "horzArray")
           .attr("x", function(d){
            console.log(arrayRange)
            return x(d-2.5);})
           .attr("y", function(){return (-2.5);})
           .attr("width", function(){return 5;})
           .attr("height", function(){return 5;})
           .style("fill", "rgb(255, 0, 255)")
           .style("stroke", "black")
           .style("stroke-width", 1)
           .style("opacity", 0.5)

    //make vertical receivers array

    const combinedArray = x_array.map((value, index) => {
        return { x: value, y: y_array[index] };
      });
      
      console.log(combinedArray);

    svg.selectAll("rect.verArray")
        .data(combinedArray)
        .enter()
        .append("rect")
           .attr("class", "verArray")
           .attr("x", function(d){
             return x(d.x);})
           .attr("y", function(d){return y(d.y);})
           .attr("width", function(){return 5;})
           .attr("height", function(){return 5;})
           .style("fill", "rgb(255, 0, 255)")
           .style("stroke", "black")
           .style("stroke-width", 1)
           .style("opacity", 0.5)







  
});