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

    L.GridLayer.GridDebug = L.GridLayer.extend({
      createTile: function (coords) {
        const tile = document.createElement('div');
        tile.classList.add("tile");
        var coords_id = [coords.z, coords.x, coords.y].join('_');
        tile.setAttribute("id", "tile_"+coords_id);
        tile.innerHTML = coords_id
        //console.log([coords.z, coords.y, coords.x].join('/'));
        return tile;
      },
    });

    L.gridLayer.gridDebug = function (opts) {
      return new L.GridLayer.GridDebug(opts);
    };

    var opts = {
      zIndex: 2
    }
    var grid_layer = L.gridLayer.gridDebug(opts);
    map.addLayer(grid_layer);

    const app = new Clarifai.App({
     apiKey: env.CLARIFAI_TOKEN
    });

    const self = this;
    $('#mapView').on('click', '.tile', function () {
      var tile_coords = ($(this).attr('id')).split('_');
      if (!$('#ml_flag').is(":checked")) {
        return;
      }
      if (self.mode === "results") {
        getRelatedTiles(tile_coords[1],tile_coords[3],tile_coords[2]);
      } else {
        // TODO: get concept name from user text field
        // is_positive from a checkbox
        var concept_name = $("#object_name").val();
        var is_positive = $('#is_positive').is(":checked");
        addConcept(concept_name,is_positive,tile_coords[1],tile_coords[3],tile_coords[2]);
      }
    });

    $(document).keypress(function(e) {
      if(e.which === 13) { 
        $('#ml_flag').prop('checked', !$('#ml_flag').prop("checked"));
      } 
    });

    function getRelatedTiles (z,y,x) {
      console.log('fetching related tiles for tile z:'+z+' y:'+y+' x:'+x);
      var image_url = 'https://tiledbasemaps.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/'+z+'/'+y+'/'+x+'/current.jpg?token='+env.ESRI_APP_TOKEN
      console.log(image_url);
      app.inputs.search(
        {
          input: {
            url: image_url,
          },
          perPage: 50
        }
      ).then(
        function(data) {
          // console.log(JSON.stringify(data));

          data.hits.forEach(function(hit, i) {
            console.log('---HIT '+i);
            console.log(hit.input.data.metadata.id);
            $("#"+hit.input.data.metadata.id).addClass("tile_active");
            // TODO: iterate thru hits and display only those with >= 0.70 score

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
    // getRelatedTiles (z,y,x) {
    //   console.log('fetching related tiles for tile z:'+z+' y:'+y+' x:'+x);
    //   var image_url = 'https://tiledbasemaps.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/'+z+'/'+y+'/'+x+'/current.jpg?token='+env.ESRI_APP_TOKEN
    //   console.log(image_url);
    //   app.inputs.search(
    //     {
    //       input: {
    //         url: image_url
    //       }
    //     }
    //   ).then(
    //     function(data) {
    //       // console.log(JSON.stringify(data));

    //       data.hits.forEach(function(hit, i) {
    //         console.log('---HIT '+i);
    //         console.log(hit);
    //       });
    //     },
    //     function(err) {
    //       console.error(err);
    //     }
    //   );
    // }
    // createMap ([Map, MapView, TileLayer, IdentityManager]) {
    //   IdentityManager.registerToken({
    //     token: "hJwledWh1hzk0Ywy6QDzgmVTyszRJfu0Gl9EAY2DFGcUlHr13PAsi3i1GxSbE4W6bNT9trKPJuo008iTaNLeq2gJs2xIU5Kaiw4dX4vMEjpMHeIxtPr1PpcSKu6PNriYQwrAdrOK1DHrx4N0feQp3A..",
    //     server: "https://www.arcgis.com/sharing/rest"
    //   })
    //   const layer = new TileLayer({
    //     url: "https://tiledbasemaps.arcgis.com/arcgis/rest/services/World_Imagery/MapServer"
    //   });
    //   const map = new Map({
    //     layers: [layer],
    //   });


    //   const view = new MapView({
    //     map: map,
    //     container: "mapView",
    //     center: [-117.19567090269645, 34.057266067316206],
    //     zoom: 16
    //   });

    //   // view.on("click", event => {
    //   //   console.log(event.mapPoint);
    //   // });

    //   // view.when(() => {
    //   //   console.log(layer);
    //   // })
    // }
  }
}


// // LAX: [33.9416, -118.4085], 18
//   // Pivot Irrigation: [22.6903733, 28.3971836], 16
//   // Garyville storage tank: [30.0546231,-90.6018915], 18
//   var map = L.map('map').setView([30.0546231,-90.6018915], 18);
//   // note make sure to renew app token if map not displaying
//   // https://tiledbasemaps.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/18/108108/65096/current.jpg?token=
//   L.esri.tiledMapLayer({
//     url: "https://tiledbasemaps.arcgis.com/arcgis/rest/services/World_Imagery/MapServer?token="+env.ESRI_APP_TOKEN
//   }).addTo(map);

//   L.GridLayer.GridDebug = L.GridLayer.extend({
//     createTile: function (coords) {
//       const tile = document.createElement('div');
//       tile.classList.add("tile");
//       var coords_id = [coords.z, coords.x, coords.y].join('_');
//       tile.setAttribute("id", "tile_"+coords_id);
//       tile.innerHTML = coords_id
//       //console.log([coords.z, coords.y, coords.x].join('/'));
//       return tile;
//     },
//   });

//   L.gridLayer.gridDebug = function (opts) {
//     return new L.GridLayer.GridDebug(opts);
//   };

//   opts = {
//     zIndex: 2
//   }
//   var grid_layer = L.gridLayer.gridDebug(opts);
//   map.addLayer(grid_layer);

//   const app = new Clarifai.App({
//    apiKey: env.CLARIFAI_TOKEN
//   });

//   $('#map').on('click', '.tile', function(){
//     tile_coords = ($(this).attr('id')).split('_');
//     getRelatedTiles(tile_coords[1],tile_coords[3],tile_coords[2]);
//   });

//   function getRelatedTiles(z,y,x) {
//     console.log('fetching related tiles for tile z:'+z+' y:'+y+' x:'+x);
//     var image_url = 'https://tiledbasemaps.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/'+z+'/'+y+'/'+x+'/current.jpg?token='+env.ESRI_APP_TOKEN
//     console.log(image_url);
//     app.inputs.search(
//       {
//         input: {
//           url: image_url
//         }
//       }
//     ).then(
//       function(data) {
//         // console.log(JSON.stringify(data));

//         data.hits.forEach(function(hit, i) {
//           console.log('---HIT '+i);
//           console.log(hit);
//         });
//       },
//       function(err) {
//         console.error(err);
//       }
//     );
//   }
