<template>
  <q-page padding>
    <q-page-sticky :position="$q.platform.is.mobile ? 'bottom-right' : 'top-left'" :offset="[20, 20]" style="z-index: 1">
      <q-btn
        push
        color="teal"
        @click="toggleDialog(true)"
        size="md"
        icon="person_add"
      ></q-btn>
    </q-page-sticky>
    <div class='row'>
      <div class='col-12'>
        <div class='row justify-center q-mb-md'>
          <span class='q-display-2 text-weight-light'>Barbeiros</span>
        </div>
        <div class="row">
          <router-view />
        </div>
      </div>
    </div>

    <add-barber v-if="getDialog"/>

  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import addBarber from './../components/organism/addbarber'

export default {
  computed: { ...mapGetters('application', ['getDialog']) },
  methods: {
    ...mapActions('application', ['toggleDialog'])
  },
  components: {
    'add-barber': addBarber
  }
}
</script>

<style>
  .slide-fade-enter-active {
    transition: .4s ease-out;
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(-1000px);
    opacity: 0.5;
  }
</style>
