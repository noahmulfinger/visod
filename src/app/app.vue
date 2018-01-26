<template>
  <div class="wrapper">
    <div class="side-bar-container">
      <div class="header">
        <nav class="leader-1">
          <a href="#" class="btn btn-grouped" v-on:click="switchMode('results')">SEARCH</a>
          <a href="#" class="btn btn-grouped" v-on:click="switchMode('train')">TRAIN</a>
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
        Training mode goes here
      </div>
    </div>
    <div class="map-container">
      <div id="mapView">
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./style.scss"></style>
<script src="./app.js"></script>
