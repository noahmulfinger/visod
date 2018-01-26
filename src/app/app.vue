<template>
  <div class="wrapper">
    <div class="side-bar-container">
      <div class="header">
        <div v-on:click="switchMode('results')" class="results-header panel panel-dark panel-no-border">
          <h1 class="result-title trailer-0">Results</h1>
        </div>
        <div v-on:click="switchMode('train')" class="train-header panel panel-no-border">
          <h1 class="result-title trailer-0">Train</h1>
        </div>
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
        <div>
          <input type="checkbox" id="ml_flag" name="ml_flag">
          <label for="ml_flag">ML flag</label>
      </div>
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
