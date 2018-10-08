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
          <span class='q-display-2 text-weight-light' style="font-family: 'Fredericka the Great', cursive;">Clientes</span>
        </div>
      </div>
    </div>

    <div class="row">
      <clients-table />
    </div>

  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import clientsTable from 'src/components/organism/clientsTable'

export default {
  methods: {
    ...mapActions('application', [
      'toggleDialog'
    ])
  },
  components: {
    'clients-table': clientsTable
  }
}
</script>

<style>
</style>
