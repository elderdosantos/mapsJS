/**
 * Classe para manipular o mapa gerado pelo Google Maps
 * @type Maps 
 */
Maps = {
    Class : function(model){
        this.model     = model;
        this.div       = null;
        this.map       = null;
        this.ll        = null;
        var events     = null;
       
		
        this.init = function(eventType){
            this.div = document.getElementById(model.getMapid());
            this.ll = new google.maps.LatLng(model.getLatitude(), model.getLongitude());
            var map = new google.maps.Map(
                this.div,
                {
                    center: this.ll,
                    zoom: model.getZoom(),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
            );
            
            google.maps.event.addListener(
            	map,
            	'click',
            	function(event) {
            		if(events == null){
	                	events = new MapsEvents.Class(map, MapsEvents.LOCATE);
            		}
	                if(events.run(event)){
	                	var l = new MapLocation.Class(event.latLng);
	                	l.getAddress();
	                }
	            }
            );
        }
    }
}

/**
 * Classe de eventos da classe Maps
 * @type MapsEvents
 */
MapsEvents = {
    // Tipos de evento
    LOCATE    : 0,
    REMOVE    : 1,
    Class : function(map, eventType){
        var event     = null;
        var map       = map;
        var eventType = eventType;
        var marker    = null;
        var markers   = [];
        
        this.addMarker = function(){
        	try{
        		marker = new google.maps.Marker({
	        		position: event.latLng
	        	});
	        	marker.setMap(map);
	        	return true;
        	} catch(err){
        		console.log(err);
        		return false;
        	}
        }
        
        this.removeMarker = function(){
        	if(marker != null){
	    		marker.setMap(null);
	    		marker = 0;
        	}
        }
		
        this.run = function(evt){
        	event = evt;
        	switch(eventType){
        		case MapsEvents.LOCATE:
        			this.removeMarker();
        			return this.addMarker();
        			break;
        		case MapsEvents.REMOVE:
        			this.removeMarker();
        			break;
        	}
        }
    }
}

/**
 * Classe model dos Mapas
 * @type MapModel
 */

MapModel = {
    Class : function(vLatitude, vLongitude, vZoom, vMapid){
        var latitude  = vLatitude;
        var longitude = vLongitude;
        var zoom      = vZoom;
        var mapid     = vMapid;
		
        this.getLatitude = function(){
            return latitude;
        }
		
        this.getLongitude = function(){
            return longitude;
        }
		
        this.getZoom = function(){
            return zoom;
        }
		
        this.getMapid = function(){
            return mapid;
        }
    }
}

MapLocation = {
	Class : function(latlng){
		var latlng = latlng;
		
		this.logradouro = null;
		this.bairro     = null;
		
		this.getAddress = function(){
			geocoder = new google.maps.Geocoder();
			geocoder.geocode(
				{'latLng': latlng},
				function(results,status){
					if(status == google.maps.GeocoderStatus.OK){
						if(results[1]){
							this.logradouro = new MapLocationModel.Class();
							this.logradouro = results[1].address_components[1];
							this.bairro     = new MapLocationModel.Class();
							this.bairro     = results[1].address_components[2];
						}
					}
				}
			);
		}
	}
		
}

MapLocationModel = {
	Class : function(){
		this.long_name  = "";
		this.short_name = "";
		this.types      = "";
	}
}