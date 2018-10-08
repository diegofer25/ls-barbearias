<template>
  <div id="q-app">
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Fredericka+the+Great');
  #loading {
    background-color: #009688;
    min-height: 100vh;
  }
</style>
