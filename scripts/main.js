;

$('.tool').on('click', function ()  {
	$('#properties').children().hide();
	$('#' + $(this).data('props')).show();
});
(function($) {    
	$.widget('pws.pill', {
		options : {
			color: '#ff0000',
			link: '',
			text: 'I`m so Cool',
			x: 0,
			y: 0
		},		
		_create : function () {},		
		_init : function() {},	
		draw : function (svg) {			
			var svg = d3.select(svg),
				group = svg.append("g");//.attr("transform", "translate(0,0)")			
			
			var theLink = group.append("svg:a")
			.attr("xlink:href", this.options.link );
			
			var oval = theLink.append("ellipse")
            .attr("cx", 100)
            .attr("cy", 40)
            .attr("rx", 99)
            .attr("ry", 39)
            .style("stroke", "#BCBBB6")
            .style("stroke-width", "3px")
            .style("fill", this.options.color);
			
			var text = theLink.append("text");
			text.attr("x", 0).attr("y",50).style('fill', '#ffffff').text(this.options.text);			
			var x = 100 - (text._groups[0][0].getBBox().width / 2);
			text.attr("x", x).attr("y",47)
		},		
		setColor : function (svg, color) {
			var svgContainer = d3.select(svg + ' ellipse');
			this.options.color = color;
			svgContainer._groups[0][0].style.fill = this.options.color;			 
		},		
		setText : function (svg, text) {		
			var textContainer = d3.select(svg + ' text');
			this.options.text = text;
			var label = textContainer._groups[0][0];
			label.innerHTML = this.options.text;	
			var x = 100 - (label.getBBox().width / 2);
			textContainer.attr("x", x).attr("y",47)			
		},		
		setLink : function (svg, link) {		
			var textContainer = d3.select(svg + ' a');
			this.options.link = link;
			textContainer.attr("xlink:href", link);			
		}
	});
	
})(jQuery);

$( document ).ready(function(){
	$('#pill-mock').pill({color: '#00ff00', text: 'KPI', link: 'http://www.google.com'});
	$('#pill-mock').pill('draw', $('#pill-mock')[0]);
	$('#pill-mock').draggable();
});

$('#pill-properties-color').on('change', function (ev) {
	$('#pill-mock').pill('setColor', '#pill-mock', ev.target.value);
});
$('#pill-properties-text').on('keyup', function (ev) {
	$('#pill-mock').pill('setText', '#pill-mock', ev.target.value);
});
$('#pill-properties-link').on('keyup', function (ev) {
	$('#pill-mock').pill('setLink', '#pill-mock', ev.target.value);
});