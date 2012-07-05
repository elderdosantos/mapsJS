/**
 * Classe Maps
 * 
 * @type Maps 
 * @argument id:String, lat:Number, lng:Number, zoom:Number
 */
Maps = {
	div: null,
	Class: function(id, lat, lng, zoom){
		//atributos
		var id   = id;
		var lat  = lat;
		var lng  = lng;
		var zoom = zoom;
		var div;
		var latLng;
		
		// Método construtor da classe
		/**
		 * Populando MapModel
		 */
		var model = new MapModel.Class();
		model.setLatitude(lat);
		model.setLongitude(lng);
		model.setMapid(id);
		model.setZoom(zoom);
		
		/**
		 * Identificando elemento DOM
		 */
		div = document.getElementById(id);
		Maps.div = div;
		
		/**
		 * Instanciando elemento google LatLng
		 */
		latLng = new google.maps.LatLng(model.getLatitude(), model.getLongitude());
		
		/**
		 * Criando objeto mapa com a classe MapsGoogle
		 */
		
		new MapGoogle.Class(div,latLng,model.getZoom());
		
		/**
		 * Adicionando listener de click ao mapa
		 */
		google.maps.event.addListener(
    		MapGoogle.map,
        	'click',
        	function(event) {
        		var mark = new MapMarker.Class();
        		mark.remove();
        		mark.add(event.latLng);
	    		new MapLocation.Class(event.latLng);
	    		var info = new MapInfo.Class();
	    		info.getInfo(MapInfo.PAIS_SIGLA, MapInfo.LATLNG, event.latLng);
            }
        );
		// Fim do construtor
	}
}

/**
 * Classe model dos Mapas
 * @type MapModel
 */

MapModel = {
    Class : function(){
        var latitude;
        var longitude;
        var zoom = 10;
        var mapid;
		
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
        
        this.setLatitude = function(lat){
        	latitude = lat;
        }
        
        this.setLongitude = function (lng){
        	longitude = lng;
        }
        
        this.setZoom = function(z){
        	zoom = z;
        }
        
        this.setMapid = function(id){
        	mapid = id;
        }
    }
}

/**
 * Classe MapGoogle armazena uma instância da classe google.maps.Map estaticamente
 * @type MapGoogle
 */
MapGoogle = {
	map: null,
	Class: function(div, latLng, zoom){
		MapGoogle.map = new google.maps.Map(
	        div,
			{
				center: latLng,
				zoom: zoom,
				mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        );
	}
}

/**
 * Class MapMarker controla a marcação de pontos no mapa
 * @type MapMarker
 */
MapMarker = {
	mark: null,
	Class: function(){
		this.add = function(latLng){
			MapMarker.mark = new google.maps.Marker({
				position: latLng
			});
			MapMarker.mark.setMap(MapGoogle.map);
		}
		this.remove = function(){
			if(MapMarker.mark != null){
				MapMarker.mark.setMap(null);
				MapMarker.mark = null;
			}
		
		}
	}
}



/**
 * Classe que cuida das localizações
 * @type 
 */
MapLocation = {
	Class : function(latlng){
		var latlng = latlng;
		
		this.r = null;
		
		this.geocoder = new google.maps.Geocoder();
		this.geocoder.geocode(
			{'latLng': latlng},
			function(results,status){
				if(status == google.maps.GeocoderStatus.OK){
					MapLocationResults.results = new Array();
					MapLocationResults.add(results[1].address_components[0]);
					MapLocationResults.add(results[1].address_components[1]);
					MapLocationResults.add(results[1].address_components[2]);
					MapLocationResults.add(results[1].address_components[3]);
					MapLocationResults.add(results[1].address_components[4]);
					
					this.r = results[1].address_components[0];
				}
			}
		);
	}
}

/**
 * Resultado das localizações
 * @type 
 */
MapLocationResults = {
	results: null,
	add: function (obj){
		this.results.push(obj);
	},
	start: function(){
		this.results = new Array();
	},
	getResults: function(i){
		return MapLocationResults.results[i];
	}
}

MapInfo = {
	FULL:       0,
	ENDERECO:   1,
	BAIRRO:     2,
	CIDADE:     3,
	ESTADO:     4,
	UF:         5,
	PAIS:       6,
	PAIS_SIGLA: 7,
	LATLNG:     'latLng',
	ADDRESS:    'address',
	CEP:        'address',
	
	Class: function(){
		
		this.data = new Array();
		this.geocoder = new google.maps.Geocoder();
		
		var getData = function(info, obj){
			switch(info){
				case MapInfo.FULL:
					console.log("Não implementado");
					break;
				case MapInfo.ENDERECO:
					for(i in obj.results){
						if(obj.results[i] != undefined){
							for(t in obj.results[i].types){
								if(obj.results[i].types[t] == "bus_station" || obj.results[i].types[t] == "transit_station" || obj.results[i].types[t] == "establishment" ){
									jQuery.data(Maps.div, "ENDERECO",obj.results[i].long_name);
								}
							}
						}
					}
					break;
				case MapInfo.BAIRRO:
					for(i in obj.results){
						if(obj.results[i] != undefined){
							for(t in obj.results[i].types){
								if(obj.results[i].types[t] == "sublocality"){
									jQuery.data(Maps.div, "BAIRRO",obj.results[i].long_name);
								}
							}
						}
					}
					break;
				case MapInfo.CIDADE:
					for(i in obj.results){
						if(obj.results[i] != undefined){
							for(t in obj.results[i].types){
								if(obj.results[i].types[t] == "locality"){
									jQuery.data(Maps.div, "CIDADE",obj.results[i].long_name);
								}
							}
						}
					}
					break;
				case MapInfo.ESTADO:
					for(i in obj.results){
						if(obj.results[i] != undefined){
							for(t in obj.results[i].types){
								if(obj.results[i].types[t] == "administrative_area_level_1"){
									jQuery.data(Maps.div, "ESTADO",obj.results[i].long_name);
								}
							}
						}
					}
					break;
				case MapInfo.UF:
					for(i in obj.results){
						if(obj.results[i] != undefined){
							for(t in obj.results[i].types){
								if(obj.results[i].types[t] == "administrative_area_level_1"){
									jQuery.data(Maps.div, "UF",obj.results[i].short_name);
								}
							}
						}
					}
					break;
				case MapInfo.PAIS:
					for(i in obj.results){
						if(obj.results[i] != undefined){
							for(t in obj.results[i].types){
								if(obj.results[i].types[t] == "country"){
									jQuery.data(Maps.div, "PAIS",obj.results[i].long_name);
								}
							}
						}
					}
					break;
				case MapInfo.PAIS_SIGLA:
					for(i in obj.results){
						if(obj.results[i] != undefined){
							for(t in obj.results[i].types){
								if(obj.results[i].types[t] == "country"){
									jQuery.data(Maps.div, "PAIS_SIGLA",obj.results[i].short_name);
								}
							}
						}
					}
					break;
			}
		}
		
		this.getInfo = function(info, type, value){
			this.geocoder.geocode(
				{'latLng': value},
				function(results,status){
					if(status == google.maps.GeocoderStatus.OK){
						MapLocationResults.start();
						MapLocationResults.add(results[1].address_components[0]);
						MapLocationResults.add(results[1].address_components[1]);
						MapLocationResults.add(results[1].address_components[2]);
						MapLocationResults.add(results[1].address_components[3]);
						MapLocationResults.add(results[1].address_components[4]);
						getData(info, MapLocationResults);
					}
				}
			);
		}
		
	}
}

MapsConsulta = {
	consulta : function(type, value){
		var info = new MapInfo.Class();
		info.getInfo(MapInfo.BAIRRO, type, value);
		info.getInfo(MapInfo.CIDADE, type, value);
		info.getInfo(MapInfo.ENDERECO, type, value);
		info.getInfo(MapInfo.ESTADO, type, value);
		info.getInfo(MapInfo.FULL, type, value);
		info.getInfo(MapInfo.PAIS, type, value);
		info.getInfo(MapInfo.PAIS_SIGLA, type, value);
		info.getInfo(MapInfo.UF, type, value);
	}
}