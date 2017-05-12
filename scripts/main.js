;

$('.tool').on('click', function ()  {
	$('#properties').children().hide();
	$('#' + $(this).data('props')).show();
});



(function($) {    
	$.widget('pws.pill', {
		options : {
			color: 'red',
			link: '',
			text: 'Test',
			x: 0,
			y: 0
		},		
		_create : function () {},
		_init : function() {},
		draw : function (svg) {			
			var svg = d3.select(svg),
				group = svg.append("g").attr("transform", "translate(0,0)")					
			
			var theLink = group.append("svg:a")
			.attr("xlink:href", '#' );
			
			var oval = theLink.append("ellipse")
            .attr("cx", 50)
            .attr("cy", 25)
            .attr("rx", 50)
            .attr("ry", 25)
            .style("stroke", "#BCBBB6")
            .style("stroke-width", "1px")
            .style("fill", this.options.color);
		
			var text = theLink.append("text");
			text.attr("x", 0).attr("y",50).style('fill', '#ffffff').text(this.options.text);			
			var x = 50 - (text._groups[0][0].getBBox().width / 2);
			text.attr("x", x).attr("y",30)
			
			svg.attr('data-from', "toolbox");
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
			var x = 50 - (label.getBBox().width / 2);
			textContainer.attr("x", x).attr("y",30)			
		},		
		setLink : function (svg, link) {		
			var textContainer = d3.select(svg + ' a');
			this.options.link = link;
			textContainer.attr("xlink:href", link);			
		}
	});	
	
	$.widget('pws.arrow', {
		options : {
			x1: 0,
			y1: 0,
			x2: 0,
			y2: 0,
			cx: 0,
			cy: 0,
			style: '',
			head: '',
			drag: null,
			point: {},
			dPoint: null
		},		
		create : function (svg) {	
			var svg = d3.select(svg);
			svg.attr('data-from', "toolbox");
			var group = svg.append("g");
			group.attr("id", "g1");
			group.attr("transform", "translate(0,0)")		
			
			var o = this.options;
			var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
			path.setAttributeNS(null, "id", "curve");  
			path.setAttributeNS(null, "d", "M"+o.x1+','+o.y1+' Q'+o.cx+','+o.cy+' '+o.x2+','+o.y2);  
			path.setAttributeNS(null, "stroke", "black"); 
			path.setAttributeNS(null, "stroke-width", 3);  
			path.setAttributeNS(null, "opacity", 1);  
			path.setAttributeNS(null, "fill", "none");

			group._groups[0][0].appendChild(path);				
		},
		draw : function (clickedThingy) {
			var o = this.options;		
			
			// curve
			var d = 
				"M"+o.point.p1.x+","+o.point.p1.y+" Q"+
				o.point.c1.x+","+o.point.c1.y+" "+
				(o.point.c2 ? o.point.c2.x+","+o.point.c2.y+" " : "")+
				o.point.p2.x+","+o.point.p2.y;
			var curve = $(clickedThingy.parentElement).find("#curve")[0];
			curve.setAttributeNS(null, "d", d);		
		},	
	
	// define initial points
	Init: function(svg) {

		var c = svg.getElementsByTagName("circle");		
		var line = {};
		for (var i = 0; i < c.length; i++) {
			this.options.point[c[i].getAttributeNS(null,"id")] = {
				x: parseInt(c[i].getAttributeNS(null,"cx"),10),
				y: parseInt(c[i].getAttributeNS(null,"cy"),10)
			};
		}			
		// event handlers
		svg.onmousedown = svg.onmousemove = svg.onmouseup = svg.onmouseout = $.proxy(this.Drag, this);
		svg.ontouchstart = svg.ontouchmove = svg.ontouchend = $.proxy(this.Drag, this);		
	},
	
	// drag event handler	
	Drag: function (e) {		
		e.stopPropagation();
		var o = this.options;
		var t = e.target, id = t.id, et = e.type, m = this.MousePos(e);
	
		// start drag
		if (!o.drag && typeof(o.point[id]) != "undefined" && (et == "mousedown" || et == "touchstart")) {
			o.drag = t;
			o.dPoint = m;
		}
		
		// drag
		if (o.drag && (et == "mousemove" || et == "touchmove")) {
			id = o.drag.id;
			o.point[id].x += m.x - o.dPoint.x;
			o.point[id].y += m.y - o.dPoint.y;
			o.dPoint = m;
			o.drag.setAttributeNS(null, "cx", o.point[id].x);
			o.drag.setAttributeNS(null, "cy", o.point[id].y);
			this.draw(e.target);
		}
		
		// stop drag
		if (o.drag && (et == "mouseup" || et == "touchend")) {
			o.drag = null;
		}
	
	},
	// // mouse position
	MousePos: function (event) {
		return {
			x: Math.max(0, Math.min(200, event.pageX - this.element.offset().left)),
			y: Math.max(0, Math.min(100, event.pageY - this.element.offset().top))
		}
	},	
	// start
	setupForEdit: function (elem, svg) {
		var o = this.options;
		
		var container = $(elem);
		if (container) {
			// Setup points for circles and lines
			var curve = $(elem).find("#curve")[0];
			var points = curve.getAttribute('d').split(" ");
			var start = points[0];
			o.x1 = start.split(",")[0].match(/\d+$/g)[0];
			o.y1 = start.split(",")[1];
			
			var middle = points[1];
			o.cx = middle.split(",")[0].match(/\d+$/g)[0];
			o.cy = middle.split(",")[1];
			
			var end = points[2];
			o.x2 = end.split(",")[0];
			o.y2 = end.split(",")[1];
			
			// Draw circles and lines
			var group = d3.select(elem);
			
			group.append("line").attr("x1", o.x1).attr("y1", o.y1).attr("x2", o.cx).attr("y2", o.cy).attr("id", "l1");
			group.append("line").attr("x1", o.x2).attr("y1", o.y2).attr("x2", o.cx).attr("y2", o.cy).attr("id", "l2");
			
			group.append("circle").attr("cx", o.x1).attr("cy", o.y1).attr("r", 5).attr("id", "p1");
			group.append("circle").attr("cx", o.cx).attr("cy", o.cy).attr("r", 5).attr("id", "c1");
			group.append("circle").attr("cx", o.x2).attr("cy", o.y2).attr("r", 5).attr("id", "p2");
			
			this.Init(svg);
		}
	}
		
	});
	
	
})(jQuery);

$( document ).ready(function(){
	$('#pill-mock').pill({color: 'red', text: 'Text', link: 'http://www.google.com'});
	$('#pill-mock').pill('draw', $('#pill-mock')[0]);
	
	$('#arrow-mock').arrow({x1:5,y1:60,cx:50,cy:20,x2:100,y2:60,style:'',head:''});
	$('#arrow-mock').arrow('create', $('#arrow-mock')[0]);
	
	$('#arrow-mock').arrow('setupForEdit', $('#g1')[0], $('#arrow-mock')[0]);
	
});
////////////////////////////////////////////////////////////////
//
//  set up the controlls for pill properties
//
////////////////////////////////////////////////////////////////

$('#pill-properties-color').on('change', function (ev) {
	$('#pill-mock').pill('setColor', '#pill-mock', ev.target.value);
});
$('#pill-properties-text').on('keyup', function (ev) {
	$('#pill-mock').pill('setText', '#pill-mock', ev.target.value);
});
$('#pill-properties-link').on('keyup', function (ev) {
	$('#pill-mock').pill('setLink', '#pill-mock', ev.target.value);
});






    var currentCloneElemet = 0; 

    function dragStart(e) {
	  var dataTransfer = e.originalEvent.dataTransfer;
      dataTransfer.effectAllowed = 'copyMove';
      dataTransfer.setData("Data", e.target.id);
      dataTransfer.setDragImage(e.target, 0, 0); 
      e.target.style.opacity = '0.3'; 

    }

    function dragEnd(e){
	  var dataTransfer = e.originalEvent.dataTransfer;
      e.target.style.opacity = '';
	  if(dataTransfer.clearData)
	  {
		dataTransfer.clearData("Data");
	  }
    }

    function dragRelease(e) {
      e.target.style.border = '';
    }

    function dragOver(e) {
	  var dataTransfer = e.originalEvent.dataTransfer;
      var dragElement = dataTransfer.getData("Data"); 
      var id = e.target.id;
      e.preventDefault();
      if (id == 'toolbox'){
        return false;        // You can not drop the toolbox
      }

      if (id == 'workspace'){
        return false; 
      } 
  
      if (id == 'litter')
        return false;         
    }

    function remove(e){
	  var dataTransfer = e.originalEvent.dataTransfer;
      var dragElement = document.getElementById(dataTransfer.getData("Data")); 
      var from = $(dragElement).attr("data-from");
      
      if (from == 'workspace')
        dragElement.parentNode.removeChild(dragElement); 
    }

    function clone(e){
		var dataTransfer = e.originalEvent.dataTransfer;
        var data = dataTransfer.getData("Data");
        var dragElement = document.getElementById(data);		
		
        var from = $(dragElement).attr("data-from");
        if (from == "toolbox")
        {
          dragElement.style.opacity = '';
          var newElement = $(dragElement).children().first()[0].cloneNode(true);
		  
		  if(dragElement.id == "arrow-mock")
		  {
			 var group = newElement.children;
			 $(group).remove("circle");
		  }
		
          newElement.id = "CloneElem" + currentCloneElemet;
          currentCloneElemet ++;

          e.target.appendChild(newElement);
          newElement.setAttribute("data-from", "workspace");
		  
		  newElement.setAttribute("ondragstart", "selectElement(evt)");
		  $(newElement).draggable();
        }
    }

    var selectedElement = 0;
        var currentX = 0;
        var currentY = 0;
		
	var selectedSVGElement = null;
		
	function moveElement(evt) {	  		  
		  var dx = evt.clientX - currentX;
		  var dy = evt.clientY - currentY;
			  
		  var currentDx =  parseInt(selectedElement.getAttributeNS(null, "transform").match(/\d+/g)[0]) + dx;
		  var currentDy =  parseInt(selectedElement.getAttributeNS(null, "transform").match(/\d+/g)[1]) + dy;
		  selectedElement.setAttributeNS(null, "transform", "translate("+currentDx+","+currentDy+")");
		  currentX = evt.clientX;
		  currentY = evt.clientY;	  
	}
	
	function selectElement(evt) {
		if($('#deleteEnabled')[0].checked)
		{
			evt.originalEvent.target.parentElement.remove(evt.originalEvent.target)
		}
	  else{
		  selectedElement = evt.target;
		  currentX = evt.clientX;
		  currentY = evt.clientY;
		  
		  selectedElement.setAttributeNS(null, "onmousemove", "moveElement(evt)");
		  selectedElement.setAttributeNS(null, "onmouseout", "deselectElement(evt)");
		  selectedElement.setAttributeNS(null, "onmouseup", "deselectElement(evt)");
	  }
	}
		
	function deselectElement(evt) {
	  if(selectedElement != 0){
		  selectedElement.removeAttributeNS(null, "onmousemove");
		  selectedElement.removeAttributeNS(null, "onmouseout");
		  selectedElement.removeAttributeNS(null, "onmouseup");
		  selectedElement = 0;
	  }

	}

$('#pill-mock').on('dragstart', function(event) {dragStart(event)}).on('dragend', function(event) {dragEnd(event)});
$('#arrow-mock').on('dragstart', function(event) {dragStart(event)}).on('dragend', function(event) {
	dragEnd(event)});
$('#workspace').on('dragover', function(event) {
	dragOver(event)}).on('dragenter', function(event){ }).on('dragleave', function (event) {dragRelease(event)}).on('drop', function(event) {	
		clone(event)});



////////////////////////////////////////////////////////////////
//
//  set up the controlls for arrow properties
//
////////////////////////////////////////////////////////////////
