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

<style lang="scss" src="./style.scss"></style>
<script src="./app.js"></script>
