document.addEventListener('DOMContentLoaded', function() {
    const data = [10, 20, 30, 40, 50];

    const margin = {top: 20, right: 30, bottom: 40, left: 40};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart").append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
                .domain(data.map((d, i) => i))
                .range([0, width])
                .padding(0.1);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data)])
                .nice()
                .range([height, 0]);

    svg.selectAll(".bar")
       .data(data)
       .enter().append("rect")
       .attr("class", "bar")
       .attr("x", (d, i) => x(i))
       .attr("y", d => y(d))
       .attr("width", x.bandwidth())
       .attr("height", d => height - y(d));

    svg.append("g")
       .attr("class", "x-axis")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x).tickFormat(i => `Item ${i+1}`));

    svg.append("g")
       .attr("class", "y-axis")
       .call(d3.axisLeft(y));
});
