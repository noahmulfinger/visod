<template>
  <div class="wrapper">
    <MiniMap class="minimap"/>
    <MainMap class="mainmap"/>
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

.mainmap {
  flex: 1 100%;
}

.minimap {
  flex: 1 50%;
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
