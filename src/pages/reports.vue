<template>
  <q-page padding>
    <div class='row'>
      <div class='col-12'>
        <div class='row justify-center q-mb-md'>
          <span class='q-display-2 text-weight-light' style="font-family: 'Fredericka the Great', cursive;">Relatórios</span>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <q-card class="row justify-around shadow-3">
              <q-field
                class="col-xs-12 col-sm-6 col-md-5 col-lg-4 col-xl-3 q-pa-md"
              >
                <q-select
                  v-model="selectedMounth"
                  float-label="Mês"
                  radio color="teal"
                  :options="mounthsOptions"
                />
              </q-field>
              <q-field
                class="col-xs-12 col-sm-6 col-md-5 col-lg-4 col-xl-3 q-pa-md"
              >
                <q-select
                  v-model="selectedYear"
                  float-label="Ano"
                  radio color="teal"
                  :options="yearsOptions"
                />
              </q-field>
            </q-card>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import cache from 'src/cache'
import { mapGetters } from 'vuex'

export default {
  name: 'Reports',
  computed: {
    ...mapGetters('application', [
      'mounths'
    ])
  },
  data () {
    return {
      createYear: new Date(cache.get('user').firstLoginDate).getFullYear(),
      selectedMounth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      mounthsOptions: [],
      yearsOptions: []
    }
  },
  mounted () {
    const yearsNumbers = new Date().getFullYear() - this.createYear
    for (let i = 0; i <= yearsNumbers + 1; i++) {
      this.yearsOptions.push({
        label: String(this.createYear + i),
        value: this.createYear + i
      })
    }
    this.mounthsOptions = this.mounths.map((mounth, index) => {
      return { label: mounth, value: index + 1 }
    })
  }
}
</script>

<style>
</style>
