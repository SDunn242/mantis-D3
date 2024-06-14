// Set dimensions and margins for the chart
const margin = { top: 20, right: 30, bottom: 40, left: 40 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load JSON data
d3.json("data.json").then(data => {
    const inSituModel = data.fd_parameters.in_situ_model;

    // Define scales
    const x = d3.scaleBand()
        .domain(inSituModel.map(d => d.Layer_Number))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(inSituModel, d => d.Vp)])
        .nice()
        .range([height, 0]);

    // Add X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d => `Layer ${d}`));

    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add horizontal gridlines
    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat(''));
    
    console.log("hello")

    // Add vertical gridlines
    const verticalGridlines = d3.axisBottom(x)
        .tickSize(-height)
        .tickFormat('')
        .ticks(inSituModel.length * 2);  // Adjust the multiplication factor for more or fewer gridlines

    svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height})`)
        .call(verticalGridlines);

    // Create bars
    svg.selectAll(".bar")
        .data(inSituModel)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.Layer_Number))
        .attr("y", d => y(d.Vp))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.Vp))
        .attr("fill", "steelblue");
}).catch(error => {
    console.error('Error loading or parsing data:', error);
});