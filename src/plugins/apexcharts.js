import VueApexCharts from 'vue-apexcharts'

export default ({ app, router, Vue }) => {
  Vue.use(VueApexCharts)
  Vue.component('apexchart', VueApexCharts)
}
