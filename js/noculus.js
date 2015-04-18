// noculus v0.1
// Ben Dale
// 15 Feburary 2015

var width = 1260,
    height = 640,
    shiftKey,
    nodeWidth = 30,
    nodeHeight = 10;

var svg = d3.select("body")
    .attr("tabindex", 1)
    .on("keydown.brush", keydown)
    .on("keyup.brush", keyup)
    .each(function() { this.focus(); })
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var link = svg.append("g")
    .attr("class", "link")
    .selectAll("line");


var brush = svg.append("g")
    .datum(function() { return {selected: false, previouslySelected: false}; })
    .attr("class", "brush");

var node = svg.append("g")
    .attr("class", "node")
    .selectAll("rect");

d3.json("js/topology.json", function(error, graph) {

  graph.links.forEach(function(d) {
    d.source = graph.nodes[d.source];
    d.target = graph.nodes[d.target];
  });

  link = link.data(graph.links).enter().append("line")
      .attr("x1", function(d) { return d.source.x+d.source.width/2; })
      .attr("y1", function(d) { return d.source.y+d.source.height/2; })
      .attr("x2", function(d) { return d.target.x+d.target.width/2; })
      .attr("y2", function(d) { return d.target.y+d.target.height/2; });

  brush.call(d3.svg.brush()
        .x(d3.scale.identity().domain([0, width]))
        .y(d3.scale.identity().domain([0, height]))
        .on("brushstart", function(d) {
         node.each(function(d) { d.previouslySelected = shiftKey && d.selected; });
        })
        .on("brush", function() {
          var extent = d3.event.target.extent();
          node.classed("selected", function(d) {
            return d.selected = d.previouslySelected ^
                (extent[0][0] <= d.x && d.x < extent[1][0]
                && extent[0][1] <= d.y && d.y < extent[1][1]);
          });
        })
        .on("brushend", function() {
          d3.event.target.clear();
          d3.select(this).call(d3.event.target);
        }));

  node = node.data(graph.nodes).enter().append("rect")
      .attr("width", function(d) { return d.width; })
      .attr("height", function(d) { return d.height; })
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .on("mousedown", function(d) {
        if (!d.selected) { // Don't deselect on shift-drag.
          if (!shiftKey) node.classed("selected", function(p) { return p.selected = d === p; });
          else d3.select(this).classed("selected", d.selected = true);
        }
      })
      .on("mouseup", function(d) {
        if (d.selected && shiftKey)
            d3.select(this).classed("selected", d.selected = false)
        else
            d3.select(this).classed("selected", d.selected = true); /* shift-click select/deselect */

        if (d.selected = false) d3.select(this).classed("selected", d.selected = true); /* click to select */

      })
      .call(d3.behavior.drag()
        .on("drag", function(d) { nudge(d3.event.dx, d3.event.dy); }));
});

function nudge(dx, dy) {
    // Use arrow keys to move elements
  node.filter(function(d) { return d.selected; })
      .attr("x", function(d) { return d.x += dx; })
      .attr("y", function(d) { return d.y += dy; })

  link.filter(function(d) { return d.source.selected; })
      .attr("x1", function(d) { return d.source.x+d.source.width/2; })
      .attr("y1", function(d) { return d.source.y+d.source.height/2; });

  link.filter(function(d) { return d.target.selected; })
      .attr("x2", function(d) { return d.target.x+d.target.width/2; })
      .attr("y2", function(d) { return d.target.y+d.target.height/2; });

  d3.event.preventDefault();
}

function keydown() {
  if (!d3.event.metaKey) switch (d3.event.keyCode) {
    case 38: nudge( 0, -1); break; // UP
    case 40: nudge( 0, +1); break; // DOWN
    case 37: nudge(-1,  0); break; // LEFT
    case 39: nudge(+1,  0); break; // RIGHT
  }
  shiftKey = d3.event.shiftKey || d3.event.metaKey;
}

function keyup() {
  shiftKey = d3.event.shiftKey || d3.event.metaKey;
}


