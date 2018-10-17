<template>
  <div class="row">
    <div class="col-12">
      <apexcharts width="500" type="area" :options="options" :series="series"></apexcharts>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
  name: 'MounthSales',
  props: [
    'payments'
  ],
  components: {
    apexcharts: VueApexCharts
  },
  data () {
    return {
      options: {
        chart: {
          id: 'mounth-total'
        },
        title: {
          text: 'Total de Vendas do mes de outubro',
          align: 'left',
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: '16px',
            color: 'red'
          }
        },
        xaxis: {
          categories: Array.from(new Array(31)).map((item, index) => (index + 1) + '/10'),
          title: {
            text: 'Month'
          }
        }
      },
      series: [{
        name: 'High - 2013',
        data: [28, 29, 33, 36, 32, 32, 33]
      }]
    }
  }
}
</script>

<style>
</style>
