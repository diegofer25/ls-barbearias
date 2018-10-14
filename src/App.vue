<template>
  <div id="q-app">
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>
import cache from 'src/cache'

export default {
  name: 'App',
  mounted () {
    if (cache.has('version')) {
      const { version } = cache.get('version')
      if (version > (new Date().getTime() + 99999)) {
        cache.set('version', { version: new Date().getTime() })
        setTimeout(() => {
          location.reload(true)
        }, 10)
      }
    } else {
      cache.set('version', { version: new Date().getTime() })
      setTimeout(() => {
        location.reload(true)
      }, 10)
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Fredericka+the+Great');
  #loading {
    background-color: #009688;
    min-height: 100vh;
  }
</style>
