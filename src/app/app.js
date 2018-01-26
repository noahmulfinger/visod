import { loadModules } from "esri-loader";
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';
import { env } from "../env.js";
import * as Clarifai from "clarifai";
import * as $ from "jquery";

export default {
  data () {
    return {
      mode: "results",
      modules: ["esri/Map", "esri/views/MapView", "esri/layers/TileLayer", "esri/identity/IdentityManager"]
    };
  },
  mounted () {
    // loadModules(this.modules).then(this.createMap);
    var map = L.map('mapView').setView([22.3041396,114.1255438,576], 18);
    esri.tiledMapLayer({
      url: "https://tiledbasemaps.arcgis.com/arcgis/rest/services/World_Imagery/MapServer?token="+env.ESRI_APP_TOKEN
    }).addTo(map);

    var active_tile_cache = []

    // create & add gridlayer
    L.GridLayer.GridDebug = L.GridLayer.extend({
      createTile: function (coords) {
        const tile = document.createElement('div');
        tile.classList.add("tile");
        var coords_id = [coords.z, coords.x, coords.y].join('_');
        var tile_id = "tile_"+coords_id;
        tile.setAttribute("id", tile_id);
        tile.innerHTML = coords_id

        if (active_tile_cache.includes(tile_id)) {
          tile.classList.add("tile_active");
        }
        //console.log([coords.z, coords.y, coords.x].join('/'));
        return tile;
      },
    });
    L.gridLayer.gridDebug = function (opts) {
      return new L.GridLayer.GridDebug(opts);
    };
    var grid_layer = L.gridLayer.gridDebug();
    map.addLayer(grid_layer);

    const app = new Clarifai.App({
     apiKey: env.CLARIFAI_TOKEN
    });

    const self = this;
    $('#mapView').on('click', '.tile', function () {
      var tile_coords = ($(this).attr('id')).split('_');
      if ($('#view_mode').is(":checked")) {
        return;
      }
      if (self.mode === "results") {
        getRelatedTiles(tile_coords[1],tile_coords[3],tile_coords[2]);
      } else {
        var concept_name = $("#object_name").val();
        var is_positive = $('#is_positive').is(":checked");
        addConcept(concept_name,is_positive,tile_coords[1],tile_coords[3],tile_coords[2]);
      }
    });

    $(document).keypress(function(e) {
      if(e.which == 13) { 
        $('#view_mode').prop('checked', !$('#view_mode').prop("checked"));
      } 
    });

    function getRelatedTiles (z,y,x) {
      // enable view mode
      $('#view_mode').prop('checked', true);

      // clear the cache as we get results for a new root tile
      active_tile_cache = []
      $('.tile').removeClass('tile_active');

      var image_url = 'https://tiledbasemaps.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/'+z+'/'+y+'/'+x+'/current.jpg?token='+env.ESRI_APP_TOKEN
      console.log(image_url);
      
      // fetch visually similar tiles
      app.inputs.search(
        {
          input: {
            url: image_url,
          },
        },
        { page: 1, perPage: 50 }
      ).then(
        function(data) {
          // console.log(JSON.stringify(data));

          data.hits.forEach(function(hit, i) {
            console.log('---HIT '+i);
            console.log(hit.input.data.metadata.id);
            
            // highlight the hit tiles & cache them
            $("#"+hit.input.data.metadata.id).addClass("tile_active");
            active_tile_cache.push(hit.input.data.metadata.id)
          });
        },
        function(err) {
          console.error(err);
        }
      );
    }

    function addConcept(concept_name,is_positive,z,y,x) {
      console.log('adding input tile z:'+z+' y:'+y+' x:'+x);
      var image_url = 'https://tiledbasemaps.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/'+z+'/'+y+'/'+x+'/current.jpg?token='+env.ESRI_APP_TOKEN

      app.inputs.create({
        url: image_url,
        concepts: [
          {
            id: concept_name,
            value: is_positive
          }
        ],
        metadata: {id: 'tile_'+z+'_'+x+'_'+y, type: 'ags', stage: env.STAGE, size: 256, src:image_url}
      }).then(
        function(response) {
          console.log(response);
          // TODO: update view with success indicator
        },
        function(err) {
          console.error(err);
        }
      );
    }
  },
  methods: {
    switchMode: function (m) {
      this.mode = m;
    }
  }
}