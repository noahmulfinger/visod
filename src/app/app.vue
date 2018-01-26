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
      <div v-if="mode === 'results'">
        <h5>Sample locations:</h5>
        <ul>
          <li v-for="(loc, index) in sample_locations" :key="index">
            <a v-on:click="panMap(loc)">{{ loc.name }}</a>
          </li>
        </ul>
        <h5>Search results: {{searchResults.length}}</h5>
        <div class="block-group block-group-3-up">
          <div class="column-1" v-for="(m, index) in searchResults" :key="index">
            <img :src="m.image_url" height="50" width="50">
          </div>
        </div>
        <a href="#" class="btn icon-ui-documentation btn-fill" v-on:click="createGeojson()">Export GeoJSON</a>
      </div>
      <div v-else>
        <label>
          Object name
          <input type="text" placeholder="ie. storage_tank" id="object_name" required>
        </label>
        <label><input type="checkbox" id="is_positive">Is positive?</label>
      </div>
      <hr />
      <h5>
        <input type="checkbox" id="view_mode" name="view_mode" checked>
        <label for="view_mode">View mode</label>
      </h5>
      <label> Current zoom: {{map_curr_zoom}} </label>
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
