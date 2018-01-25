<template>
  <div id="main">
    <div id="mainMap">
    </div>
  </div>
</template>

<style lang="scss" scoped>
#mainMap {
  height: 100%;
  width: 100%;
}
  
</style>

<script>
import { loadModules } from "esri-loader";
export default {
  data () {
    return {
      modules: ["esri/Map", "esri/views/MapView"]
    };
  },
  mounted () {
    loadModules(this.modules).then(this.createMap);
  },
  methods: {
    createMap ([Map, MapView]) {
      const map = new Map({
        basemap: "satellite"
      });
      const view = new MapView({
        map: map,
        container: "mainMap",
        center: [-117.19567090269645, 34.057266067316206],
        zoom: 16
      });
    }
  }
}
</script>