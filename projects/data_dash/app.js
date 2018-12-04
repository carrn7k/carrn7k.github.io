

/*
d3.csv('./API_VC.IHR.PSRC.P5_DS2_en_csv_v2.csv', function(err, data) {
	if (err) throw err;

	console.log("World Bank Data");
	console.log(data);
})
*/

/*
d3.xml('./API_VC.IHR.PSRC.P5_DS2_en_xml_v2.xml', function(err, xml) {
	if (err) throw err;

	var data = [...xml.querySelectorAll("record")];
	var formattedXMLData = data.map(function(record) {
		let fields = record.querySelectorAll("field")
		return {
			name: fields[0].textContent,
			year: fields[2].textContent,
			value: fields[3].textContent
		}
	})
	console.log(formattedXMLData);
})
*/


// ******************* Initial Map View ********************************* //
d3.queue()
  .defer(d3.json, '//unpkg.com/world-atlas@1.1.4/world/50m.json')
  .defer(d3.json, './countryCodes.json')
  .defer(d3.csv, './crime_data.csv')
  .defer(d3.xml, './API_VC.IHR.PSRC.P5_DS2_en_xml_v2.xml')
  .await(function(error, mapData, countryCodes, crimeData, xmlData) {

  if (error) throw error;

  // *********** Data Set Up ***************
	var geoData = topojson.feature(mapData, mapData.objects.countries).features

  var countries = {};
  var countryArray = [];

  // ************ Format XML Data ************
  var data = [...xmlData.querySelectorAll("record")];
	var formattedXMLData = data.map(function(record) {
			let fields = record.querySelectorAll("field")
			return {
				name: fields[0].textContent,
				year: fields[2].textContent,
				value: fields[3].textContent
			}
	})

  // format crime data 
	crimeData.forEach(function(row) {

		var name = row['Country or Area'];
		var year = +row['Year'];
		var count = +row['Count'];
		var rate = +row['Rate'];

		if (countryArray.includes(name) === false) {

			countryArray.push(name);
			var countryCode = countryCodes.filter(country => country.name === name);
			countries[name] = {};

			if (countryCode[0])
				countries[name] = {code: countryCode[0]['country-code']};
		}
		countries[name][year] = {count: count, rate: rate};
	});	

	formattedXMLData.forEach(function(row) {
		if (row.name in countries) {

			if (row.value !== "" && !(row.year in countries[row.name])) {
				countries[row.name][+row.year] = {count: "", rate: +row.value};
			}

		}
	})

	// add crime data to geoData properties
	for (var key in countries) {
		var country = countries[key];
		geoData.forEach(function(row) {
			if (row.id === country.code) {
				row.properties[key] = country;
			}
		})
	}
	

	// ******** Map Set Up ************
	var width = 1000;
	var height = 650;
	var maxYear = 0;
	var minYear = 3000;

	for (var key in countries) {
		var years = Object.keys(countries[key]);
		years.forEach(function(year) {
			if (+year > maxYear) {
				maxYear = year;
			}
			if (+year < minYear) {
				minYear = year;
			}
		})
	}

	var projection = d3.geoMercator()
					   .scale(125) 
					   .translate([width / 1.8, height / 1.4])

	var path = d3.geoPath()
				 .projection(projection)

	var tooltip = d3.select("body")
					.append("div")
					  .classed("tooltip", true);

	d3.select("input")
	    .property("min", minYear)
	    .property("max", maxYear)
	    .property("value", minYear)
	    .on("input", () => updateYear(+d3.event.target.value));

	var select = d3.select("select");
	
	select
	  .on("change", function(d) {
	  	if($("#bar-container").hasClass("show-chart")) {
	  		showBarChart(currentChart, true);
	  	} else {
	  		setColor(d3.event.target.value);
	  	}
	  })

	updateYear(minYear);
	setColor(select.property("value"));

	function updateYear(newYear) {

		var chart = d3.select("#bar-chart");
		console.log("Chart:", chart);

		testYear = newYear;
			
		var map = d3.select("#map")
		  .attr("width", width)
		  .attr("height", height)

		map
		  .append("text")
		  .attr("x", width / 2)
		  .attr("y", 0)
		  .text("Test Title");

		var update = map
		  	.selectAll(".country")
		    .data(geoData)
		

		update
		  .exit()
		  .remove()

		update
		  .enter()
		  .append("path")
		  	.on("mousemove", showToolTip)
		  	.on("mouseout", hideToolTip)
		  	.on("click", showBarChart)
		    .classed("country", true)
		    .attr("d", path);

		d3.select(".year-display")
	      .text(`Year: ${testYear}`)

	    setColor(select.property("value"));
	}

	function setColor(val) {

		if (val === 'murderRate')
			val = 'Rate';
		else
			val = 'Count';

		var colorRanges = {
			Count: ["white", "brown"],
			Rate: ["white", "red"]
		}

		var scale = d3.scaleLinear()
			  .domain([0, d3.max(crimeData, d => +d[val])])
			  .range(colorRanges[val]);

		d3.selectAll(".country")
		    .transition()
		    .duration(750)
		    .ease(d3.easeBackIn)
		    .attr("fill", d => {
		    	var country = Object.keys(d.properties);
		    	if (country.length > 0) {
		    		var data = d.properties[country[0]][testYear];
		    		if (data) {
		    			return scale(data[val.toLowerCase()]);
		    		} else {
		    			return "#e2e2e2";
		    		} 
		    	} else {
		    		return "#e2e2e2";
		    	}
		})
	}

	function showToolTip(d) {

		var country = Object.keys(d.properties)[0]
		
		if (d.properties[country][testYear]) {
	    	tooltip
	    	  .style("opacity", 1)
	    	  .style("left", d3.event.x + 12 + 'px')
	    	  .style("top", d => {
	    	  	let height = tooltip.node().getBoundingClientRect().height;
	    	  	return (d3.event.y - (height / 2)) + "px"}
	    	  )
	    	  .html(`<p>Country: ${Object.keys(d.properties)[0]}</p>
	    	  		 <p>Murder Count for ${testYear}: ${d.properties[country][testYear].count}</p>
	    	  		 <p>Murder Rate for ${testYear}: ${d.properties[country][testYear].rate}</p>
	    	  		 <p id="tip-info">*Click to See Country Details</p>
	    	  		 `)
	    	} else {
		    	tooltip
		    	  .style("opacity", 1)
		    	  .style('left', d3.event.x + 12 + 'px')
		    	  .style("top", d => {
		    	  	let height = tooltip.node().getBoundingClientRect().height;
		    	  	return (d3.event.y - (height / 2)) + "px"}
		    	  )
		    	  .html(`<p>No Data for ${testYear}</p>`)
	    	}
	}

	function hideToolTip(d) {
    	tooltip
    	  .style("opacity", 0);
	}



	/*********** Test Bar Chart ***********/


	
	var barWidth = 650;
	var barHeight = 450;
	var barPadding = 40;

	var countExtent = d3.extent(geoData, d => {
		var years = Object.values(d.properties);
		if (years.length > 0) {
			for (var key in years[0]) {
				return years[0][key].count;
			}
		}
	})
	countExtent[1] = countExtent[1] + 5000;

	var rateExtent = d3.extent(geoData, d => {
		var years = Object.values(d.properties);
		if (years.length > 0) {
			for (var key in years[0]) {
				return years[0][key].rate;
			}
		}
	})


	var barChart = d3.select("#bar-chart")
		.attr("width", barWidth)
		.attr("height", barHeight)


	barChart.append('g')
        .attr('transform', 'translate(' + -barPadding + ',' + barHeight + ')')
        .classed('x-axis', true);

	barChart.append('g')
        .attr('transform', 'translate(' + -30 + ',0)')
        .classed('y-axis', true);


    /*
    barChart.append("text")
		.attr("x", (barWidth / 2) - barPadding - 30)
		.attr("y", -10)
		.text("Murder Count");
	*/
	var currentChart = null;
   
    function showBarChart(d, showing) {

    	currentChart = d;

    	var extent;
    	var title;
    	var tickFormat;
    	var val = select.property("value");

    	if (val === 'murderCount') {
			extent = countExtent;
			val = 'count';
			title = 'Murder Count';
			tickFormat = d3.format(".2s");
			barChart.classed("murder-rate", false);
			barChart.classed("murder-count", true);
    	}
		else {
			extent = rateExtent;
			val = 'rate';
			title = 'Murder Rates';
			tickFormat = d3.format(".1f");
			barChart.classed("murder-rate", true);
			barChart.classed("murder-count", false);
		}




		var countryName = Object.keys(d.properties)[0];

		var country = Object.entries(countries[countryName]);
		country.pop();

		var xScale = d3.scaleBand()
					   .domain(country.map(d => +d[0]))
					   .rangeRound([barPadding, barWidth - barPadding])
					   .padding(0.2);

		var yScale = d3.scaleLinear()
					   .domain(extent)
					   .rangeRound([barHeight, 0]);
		
		// needs to be changed to remove old title
		d3.select(".title").remove();

		barChart.append("text")
		  .classed("title", true)

		d3.select(".title")
		  .attr("x", -40)
		  .attr("y", -30)
		  .text(`${title} for ${countryName}`);

		d3.select(".x-axis")
			.call(d3.axisBottom(xScale));

		d3.select(".y-axis")
			.call(d3.axisLeft(yScale)
				    .tickSize(-barWidth + 2)
				    .tickSizeOuter(0)
					.tickFormat(d3.format(tickFormat)))


		var update = barChart
		  .selectAll(".bar")
		  .data(country)

		update
		  .exit()
		  .remove()

		update
		  .enter()
		  .append("rect")
		    .classed("bar", true)
		  .merge(update)
		    .transition()
            .duration(600)
            .ease(d3.easeLinear)
		    .attr("x", d => xScale(d[0]) - barPadding)
		    .attr("y", d => yScale(d[1][val]))
		    .attr("width", xScale.bandwidth())
		    .attr("height", d => (barHeight - yScale(d[1][val])))
		    .attr("fill", "blue");

		if (showing !== true) {
			$("#rmv-chart").show();
			$("#map").toggleClass("hide");
			$("#bar-container").toggleClass("show-chart").toggleClass("hide-chart");
		}


		/*
		barChart.selectAll(".bar")
		  .data(country)
		  .enter()
		  .append("rect")
		    .classed("bar", true)
		    .attr("x", d => xScale(d[0]) - barPadding)
		    .attr("y", d => yScale(d[1].count))
		    .attr("width", xScale.bandwidth())
		    .attr("height", d => (barHeight - yScale(d[1].count)))
		    .attr("fill", "blue");
		*/
	}
})

$("#rmv-chart").on("click", function() {
	$( this ).hide();
	$("#map").toggleClass("hide");
	$("#bar-container").toggleClass("show-chart").toggleClass("hide-chart");
	//$("#map").css({'transform' : 'translate(-1000px)'});
})

$("#test2").on("click", function() {
	
	$("#map").toggleClass("hide");
	$("#bar-container").toggleClass("show-chart").toggleClass("hide-chart");
	//$("#map").css({'transform' : 'translate(-1000px)'});
})

    // test country USA
    /*
	var testCountry = Object.entries(countries['United States of America']);
	testCountry.pop();

	var xScale = d3.scaleBand()
				   .domain(testCountry.map(d => +d[0]))
				   .rangeRound([barPadding, barWidth - barPadding])
				   .padding(0.2);


	var yScale = d3.scaleLinear()
				   .domain(countExtent)
				   .rangeRound([barHeight, 0]);
	

	d3.select(".x-axis")
		.call(d3.axisBottom(xScale));

	d3.select(".y-axis")
		.call(d3.axisLeft(yScale)
			    .tickSize(-barWidth + 2)
			    .tickSizeOuter(0));


	barChart.selectAll(".bar")
	  .data(testCountry)
	  .enter()
	  .append("rect")
	    .classed("bar", true)
	    .attr("x", d => xScale(d[0]) - barPadding)
	    .attr("y", d => yScale(d[1].count))
	    .attr("width", xScale.bandwidth())
	    .attr("height", d => (barHeight - yScale(d[1].count)))
	    .attr("fill", "blue");





	// console.log('countries', countries);
	// console.log('geo data', geoData);

  })

  */

/* Data Mapping 

var test = {
	Albania: {
		code: 101,
		2008: {count: 100, rate: 4.0},
		2009: {count: 120, rate: 4.5}
	},
	Afghanistan: {
		code: 102,
		2008: {count: 200, rate: 5.5},
		2009: {count: 270, rate: 6.1},
	}
}

*/

