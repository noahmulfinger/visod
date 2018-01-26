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
        <ul>
          <li v-for="(m, index) in modules" :key="index">
            {{ m }}
          </li>
        </ul>
        <h5>Sample locations:</h5>
        <ul>
          <li v-for="(loc, index) in sample_locations" :key="index">
            <a v-on:click="panMap(loc)">{{ loc.name }}</a>
          </li>
        </ul>
      </div>
      <div v-else>
        <label> Current zoom: {{map_curr_zoom}} </label>
        <label>
          Object name
          <input type="text" placeholder="ie. storage_tank" id="object_name" required>
        </label>
        <label><input type="checkbox" id="is_positive">Is positive?</label>
      </div>

      <h5>
        <input type="checkbox" id="view_mode" name="view_mode" checked>
        <label for="view_mode">View mode</label>
      </h5>
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
