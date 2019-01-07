<template>
  <q-page padding>
    <div class="row">
      <div class="col-12">
        <div class='row justify-center q-mb-md'>
          <span class='q-display-2 text-weight-light' style="font-family: 'Fredericka the Great', cursive;">Home</span>
        </div>
      </div>
    </div>
    <div class="row">
      <q-table
        :data="getUsers"
        :columns="columns"
        selection="single"
        :selected.sync="selected"
        row-key="username"
        class="col-12"
        no-data-label="Não há usuários cadastrados"
        :loading="loading"
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        title="Gerenciamento de Usuários"
      >
        <template slot="top-right" slot-scope="props">
          <q-btn color="teal" icon="add" label="CADASTRAR" @click="modal = !modal" />
          <q-search v-model="filter" placeholder="Buscar" v-if="getUsers.length" />
          <q-btn
            flat round dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
          />
        </template>
        <q-tr slot="header" slot-scope="props">
          <q-th auto-width>
            <q-checkbox
              v-if="props.multipleSelect"
              v-model="props.selected"
              indeterminate-value="some"
            />
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>

        <template slot="body" slot-scope="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-checkbox color="primary" v-model="props.selected" />
            </q-td>
            <q-td key="desc" :props="props">
              <q-checkbox color="primary" v-model="props.expand" checked-icon="remove" unchecked-icon="add" class="q-mr-md" />
              {{ props.row.name }}
            </q-td>
            <q-td key="calories" :props="props">{{ props.row.calories }}</q-td>
            <q-td key="fat" :props="props">{{ props.row.fat }}</q-td>
            <q-td key="carbs" :props="props">{{ props.row.carbs }}</q-td>
            <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>
            <q-td key="sodium" :props="props">{{ props.row.sodium }}</q-td>
            <q-td key="calcium" :props="props">{{ props.row.calcium }}</q-td>
            <q-td key="iron" :props="props">
              <q-chip small square color="amber">{{ props.row.iron }}</q-chip>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <q-modal v-model="modal" maximized>
      <add-user />
    </q-modal>
  </q-page>
</template>

<style>
</style>

<script>
import { mapGetters } from 'vuex'
import addUser from './../components/organism/addUser'
export default {
  name: 'PageIndex',
  components: {
    'add-user': addUser
  },
  computed: {
    ...mapGetters('application', ['getUser', 'getUsers'])
  },
  data () {
    return {
      pagination: { sortBy: null, descending: false, page: 1, rowsPerPage: 0 },
      filter: '',
      selected: [],
      editing: false,
      loading: false,
      modal: false,
      search: '',
      columns: [{
        name: 'username',
        required: true,
        label: 'Usuários',
        align: 'center',
        field: 'username',
        sortable: true,
        classes: '',
        style: ''
      }]
    }
  }
}
</script>
