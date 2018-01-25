<template>
  <div class="wrapper">
    <div class="side-bar-container">
      <div class="header panel-dark">
        <h1 class="result-title trailer-0">Results</h1>
      </div>
      <ul>
        <li v-for="(module, index) in modules" :key="index">
          {{ module }}
        </li>
      </ul>
    </div>
    <div class="map-container">
      <div id="mapView">
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import url("https://js.arcgis.com/4.6/esri/css/main.css");
@import url("https://s3-us-west-1.amazonaws.com/patterns.esri.com/files/calcite-web/1.0.0-rc.8/css/calcite-web.min.css");
.wrapper {
  min-height: 100vh;
  display: flex;
  flex-flow: row;
}

.side-bar-container {
  flex: 1 50%;
}

.map-container {
  flex: 1 100%;
}

#mapView {
  height: 100%;
  width: 100%;
}

.header {
  text-align: left;
  padding: 10px;
}
</style>

<script>
import { loadModules } from "esri-loader";
export default {
  data () {
    return {
      modules: ["esri/Map", "esri/views/MapView", "esri/layers/TileLayer", "esri/identity/IdentityManager"],

    };
  },
  mounted () {
    loadModules(this.modules).then(this.createMap);
  },
  methods: {
    createMap ([Map, MapView, TileLayer, IdentityManager]) {
      IdentityManager.registerToken({
        token: "hJwledWh1hzk0Ywy6QDzgmVTyszRJfu0Gl9EAY2DFGcUlHr13PAsi3i1GxSbE4W6bNT9trKPJuo008iTaNLeq2gJs2xIU5Kaiw4dX4vMEjpMHeIxtPr1PpcSKu6PNriYQwrAdrOK1DHrx4N0feQp3A..",
        server: "https://www.arcgis.com/sharing/rest"
      })
      const layer = new TileLayer({
        url: "https://tiledbasemaps.arcgis.com/arcgis/rest/services/World_Imagery/MapServer"
      });
      const map = new Map({
        layers: [layer],
      });


      const view = new MapView({
        map: map,
        container: "mapView",
        center: [-117.19567090269645, 34.057266067316206],
        zoom: 16
      });

      // view.on("click", event => {
      //   console.log(event.mapPoint);
      // });

      // view.when(() => {
      //   console.log(layer);
      // })
    }
  }
}
</script>
