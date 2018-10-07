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
  #loading {
    background-color: #009688;
    min-height: 100vh;
  }
</style>
