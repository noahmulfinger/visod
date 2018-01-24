<template>
  <div id="app" class="grid-container">
    <MiniMap class="column-6"/>
    <MainMap class="column-18"/>
  </div>
</template>

<style lang="scss" scoped>
@import url("https://js.arcgis.com/4.6/esri/css/main.css");
@import url("https://s3-us-west-1.amazonaws.com/patterns.esri.com/files/calcite-web/1.0.0-rc.8/css/calcite-web.min.css");
#app {
  height: 100%;
  width: 100%;
}
</style>

<script>
import MainMap from "./components/MainMap.vue";
import MiniMap from "./components/MiniMap.vue";
export default {
  components: {
    MainMap,
    MiniMap
  }
}
</script>
