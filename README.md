mapsJS
======

Wrapper for the Google Maps API 3 written only in Javascript

HOW TO USE
=========
<div id="mapID"></div>
<script type="text/javascript">
	var map = new Maps.Class("mapID", <START LATITUDE>, <START LONGITUDE>, <START ZOOM>);
</script>


The tags <START LATITUDE>, <START LONGITUDE> and <START ZOOM> are numbers.

After user click on the map, the class Maps will create and store into data attributes of the DOM element of map (with id "mapID") the locations retrieves from Google Maps API.

This class don't need any key or token...
