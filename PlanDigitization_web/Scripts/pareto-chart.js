var ParetoChart = function(opts){  
    this.globalDataX = this.globalDataX || opts.globalDataX;
    this.oneDataY = this.oneDataY || opts.oneDataY;
    this.twoDataY = this.twoDataY || opts.twoDataY;
    this.element = opts.elem.querySelector('.plot-wrap.w-svg');
}

ParetoChart.prototype.setData = function(newData){
  this.data = newData;
  this.draw();
}

ParetoChart.prototype.draw = function(){
    this.margin = {
        top:40,
        left:20,
        right:20,
        bottom:80
    };    
    this.width = this.element.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.width / 3 - (this.margin.top - this.margin.bottom);

    this.element.innerHTML = '';

    var svg = d3.select(this.element).append('svg');
    svg.attr('width',  this.width + (this.margin.left + this.margin.right));
    svg.attr('height', (this.height + this.margin.top + this.margin.bottom));

    this.plot = svg.append('g')
        .attr('transform',`translate(${this.margin.left},${this.margin.top})`);

    this.createOneScales()
    this.createTwoScales()
    this.addGrey()
    this.addOneAxis()
    this.addTwoAxis()
    this.addRect();
    this.addLine()
    this.addDots()    
    this.addOneLabels()
    this.addTwoLabels()
    this.cleanUp()
    this.addMouseEvent()
	}

ParetoChart.prototype.createOneScales = function() {
    var self = this
    this.xScaleGlobal = d3.scaleBand()
      .rangeRound([0,this.width])
      .domain(this.data.map(function(d) { return d[self.globalDataX]; }))
      .paddingInner(0.15);
    this.yScaleOne = d3.scaleLinear()
      .domain([0, d3.max(this.data, function(d){ return d[self.oneDataY];})])
      .range([this.height,0]);
	}

ParetoChart.prototype.createTwoScales = function() {
    var self = this
    this.yScaleTwo = d3.scaleLinear()
      .domain([0, d3.max(this.data, function(d){ return d[self.twoDataY];})])
      .range([this.height,0]);
  }

ParetoChart.prototype.addOneAxis = function(){
    var self = this
    this.xAxisOne = d3.axisBottom(this.xScaleGlobal)
      .tickFormat(d3.timeFormat("%a %Y"));

    this.yAxisOne = d3.axisLeft()
      .scale(this.yScaleOne)
      .ticks(8)
      .tickFormat(d3.format(""))
      .tickSize(-this.width);
    this.plot.append("g.x-axis")
      .call(this.xAxisOne)
      .attr("transform","translate(0," + this.height + ")");
    this.plot.append("g.y-axis-bar")
      .call(this.yAxisOne); 
  }

ParetoChart.prototype.addTwoAxis = function(){
    var self = this
    this.yAxisTwo = d3.axisRight()
      .scale(this.yScaleTwo)
      .ticks(8)
      .tickFormat(d3.format(""))
      .tickSize(this.width);
    this.plot.append("g.y-axis-line")
      .call(this.yAxisTwo);
  }

ParetoChart.prototype.addDots = function() {    
    var self = this
    this.gDot = this.plot.selectAll('.g-comp-dot')
      .data(this.data)
      .enter()
      .append('g.g-comp-dot')
      .append("circle.comp-dot")
      .attr('fill','brown')
      .attr("r",3)
      .attr("cx",function(d){
        return self.xScaleGlobal(d[self.globalDataX])+(self.xScaleGlobal.bandwidth()/2);
      })
      .attr('cy', this.height)
      .transition().delay(function(d, i) { return i * 15; })
      .attr("cy",function(d){
        return self.yScaleTwo(d[self.twoDataY]);
      });
  }

ParetoChart.prototype.addLine = function() {
    var interpolateTypes = [
      d3.curveLinear, // 1
      d3.curveStepBefore, // 2
      d3.curveStepAfter, // 3
      d3.curveBasis, // 4
      d3.curveBasisOpen, // 5
      d3.curveBasisClosed, // 6
      d3.curveBundle, // 7
      d3.curveCardinal, // 8
      d3.curveCardinal, // 9
      d3.curveCardinalOpen, // 10
      d3.curveCardinalClosed, // 11
      d3.curveNatural // 12
      ];

    var self = this
    this.lineGen = d3.line()
        .x( function(d){ return self.xScaleGlobal(d[self.globalDataX])+(self.xScaleGlobal.bandwidth()/2); })
        .y( function(d){ return self.yScaleTwo(d[self.twoDataY]); })
        .curve(interpolateTypes[0]);

    this.gLine = this.plot
      .append("path.line-path")
      .attr("d", this.lineGen(this.data))
      .attr('fill','none')
      .attr('stroke','brown')
      .attr('stroke-width',1);
  }

ParetoChart.prototype.addRect = function() {    
    var self = this
    this.gRects = this.plot.selectAll('.g-comp-rect')
      .data(this.data)
      .enter()
      .append('g.g-comp-rect')
      .append('rect.comp-rect')
      .style('fill', this.lineColor || 'salmon')
      .attr("x",function(d){
        return self.xScaleGlobal(d[self.globalDataX]);
      })
      .attr('y', this.height)
      .transition().delay(function(d, i) { return i * 15; })
      .attr("y",function(d){
        return self.yScaleOne(d[self.oneDataY]);
      })      
      .attr('width',this.xScaleGlobal.bandwidth())     
      .attr('height', function(d){
        return self.height - self.yScaleOne(d[self.oneDataY]);
      });
	}

ParetoChart.prototype.addOneLabels = function(){    
    var self = this
    
    this.plot.selectAll('.g-comp-rect')
      .append("text.bar-label")
      .attr("x", function(d){
        return self.xScaleGlobal(d[self.globalDataX])+(self.xScaleGlobal.bandwidth()/2);
      })
      .attr("y",function(d){
        return self.yScaleOne(d[self.oneDataY]);
      })
      .attr("dy", "-10px")
      .attr("text-anchor","middle")
      .attr('fill','salmon')
      .attr('font-size','10px')
      .text(function(d) { return d[self.oneDataY]; });
  }

ParetoChart.prototype.addTwoLabels = function(){    
    var self = this
    this.plot.selectAll('.g-comp-rect')
      .append("text.line-label")
      .attr("x", function(d){
        return self.xScaleGlobal(d[self.globalDataX])+(self.xScaleGlobal.bandwidth()/2);
      })
      .attr("y",function(d){
        return self.yScaleTwo(d[self.twoDataY]);
      })
      .attr("dy", "-10px")
      .attr("text-anchor","middle")
      .attr('fill','brown')
      .attr('font-size','10px')
      .text(function(d) { return d[self.twoDataY]; });
  }

ParetoChart.prototype.addMouseEvent = function () {
    var self = this;
    this.plot.selectAll('rect.comp-rect')
      .on('mouseenter', function(d){
        var thisData = d;
        self.gLine.transition(50).style('opacity','.25');
        d3.selectAll('rect.comp-rect, .g-comp-dot').transition(50).style('opacity',function (d,i) {
            return (d === thisData) ? 1.0 : 0.25;
        });
      })
      .on('mouseleave', function(d){
        self.gLine.transition(50).style('opacity','1');
        d3.selectAll('rect.comp-rect, .g-comp-dot').transition(50).style('opacity',function () {
            return 1.0;
        });
      });
  }

ParetoChart.prototype.addGrey = function(){
    var self = this  
    this.plot.selectAll('.g-comp-rect')
      .data(this.data)
      .enter()
      .append('rect.bg-bar')
      .style('fill', this.lineColor || '#f3f3f3')
      .attr("x",function(d){
        return self.xScaleGlobal(d[self.globalDataX]);
      })
      .attr('y', 0)
      .attr('width',this.xScaleGlobal.bandwidth())     
      .attr('height', this.height);
  }

ParetoChart.prototype.cleanUp = function(){
    var self = this
    this.domain = this.plot.selectAll('.domain').style('display','none');
    this.yBarTick = this.plot.selectAll('.y-axis-bar .tick line')
      .attr('stroke','#e0e0e0')
      .attr('stroke-width',1);
    this.yLineTick = this.plot.selectAll('.y-axis-line .tick line').attr('display','none');
    this.xText = this.plot.selectAll('.x-axis .tick text')
      .attr('text-anchor','end')
      .attr('y', function(d) { return self.xScaleGlobal.bandwidth() - (self.xScaleGlobal.bandwidth()+3); })
      .attr('x',-10)
      .attr("transform", "rotate(-90)");
  }

ParetoChart.prototype.resize = function(){
  console.log('sdc')
  this.width = parseInt(d3.select(this.element).style('width'), 10);
  this.draw();
}