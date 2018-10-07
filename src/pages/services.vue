<template>
  <q-page padding>
    <q-page-sticky :position="$q.platform.is.mobile ? 'bottom-right' : 'top-left'" :offset="[20, 20]" style="z-index: 1">
      <q-btn
        push
        color="teal"
        @click="toggleDialog(true)"
        size="md"
        icon="assignment"
      ></q-btn>
    </q-page-sticky>
    <div class='row'>
      <div class='col-12'>
        <div class='row justify-center q-mb-md'>
          <span class='q-display-2 text-weight-light'>Serviços</span>
        </div>
      </div>
    </div>

    <div class="row">
      <services-table />
    </div>

    <add-service v-if="getDialog"/>

  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import servicesTable from 'src/components/organism/servicesTable'
import addService from 'src/components/organism/addService'

export default {
  computed: {
    ...mapGetters('application', [
      'getDialog'
    ])
  },
  methods: {
    ...mapActions('application', [
      'toggleDialog'
    ])
  },
  components: {
    'services-table': servicesTable,
    'add-service': addService
  }
}
</script>
