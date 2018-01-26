<template>
  <div class="wrapper">
    <div class="side-bar-container">

      <div class="header">
      <h1>VSOD</h1>
        <nav>
          <a href="#" class="btn btn-grouped icon-ui-search btn-half" v-on:click="switchMode('results')">SEARCH</a>
          <a href="#" class="btn btn-grouped icon-ui-applications btn-half" v-on:click="switchMode('train')">TRAIN</a>
        </nav>
      </div>
      <div>
        <input type="checkbox" id="ml_flag" name="ml_flag">
        <label for="ml_flag">ML flag</label>
      </div>
      <div v-if="mode === 'results'">
        <ul>
          <li v-for="(m, index) in modules" :key="index">
            {{ m }}
          </li>
        </ul>
      </div>
      <div v-else>
        <label>
          Object name
          <input type="text" placeholder="ie. storage_tank" id="object_name" required>
        </label>
        <label><input type="checkbox" id="is_positive">Is positive?</label>
      </div>
      <div class="esri-logo modifier-class"></div>
    </div>
    <div class="map-container">
      <div id="mapView">
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./style.scss"></style>
<script src="./app.js"></script>
