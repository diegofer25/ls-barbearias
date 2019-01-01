<template>
  <div class="row justify-around">
    <div class="col-12"  v-if="payments.length">
      <div id="chart">
        <div class="row justify-center">
          <span class="q-title">{{ textTitle }}</span>
        </div>
        <div class="row">
          <div class="col-12">
            <apexchart height="350px" :type="options.xaxis.categories.length === 1 ? 'bar' : 'area'" :options="options" :series="series"></apexchart>
          </div>
        </div>
        <div class="toolbar">
          <div class="row justify-end">
            <q-btn @click.stop="exportData(exportTitle)" color="secondary">EXPORTAR PARA EXEL</q-btn>
          </div>
        </div>
      </div>
    </div>
    <div class="col-sm-12" v-else>
      <div class="row justify-center">
        <span class="q-title">Não houveram recebimentos {{ exportTitle === 'Diário' ? 'neste dia' : exportTitle === 'Semanal' ? 'nesta semana' : 'neste mes' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'payments-chart',
  props: [
    'payments',
    'date',
    'exportTitle',
    'referer',
    'textTitle'
  ],
  data () {
    return {
      options: {
        chart: {
          id: 'mounth-total'
        },
        colors: ['#019688'],
        yaxis: {
          labels: {
            formatter: function (value) {
              return 'R$ ' + value.toFixed(2)
            }
          }
        },
        xaxis: {
          categories: this.formatData(this.date, 'x'),
          labels: {
            formatter: function (value) {
              return 'Dia ' + value
            }
          }
        }
      },
      series: [{
        name: 'Total do dia',
        data: this.formatData(this.date, 'y')
      }]
    }
  },
  methods: {
    formatData (date, XY) {
      const d = new Date(date)
      const days = Array.from({ length: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() })
      return days.map((day, index) => {
        return {
          x: (index + 1),
          y: this.getAmounthOfDay(index + 1)
        }
      }).filter(({ y }) => y !== 0).map(obj => XY ? obj[XY] : obj)
    },

    getAmounthOfDay (day) {
      return this.payments.filter(payment => {
        return new Date(payment.timestamp).toLocaleDateString() === new Date(String((new Date(this.date).getMonth() + 1) + '/' + day + '/' + new Date(this.date).getFullYear())).toLocaleDateString()
      })
        .reduce((acc, cur) => {
          return acc + cur.service.price
        }, 0.0)
    },

    exportData (title) {
      const { XLSX, saveAs } = this.$xlsx
      const wb = XLSX.utils.book_new()
      wb.Props = {
        Title: 'Relatório ' + title,
        Subject: 'Relatório ' + title,
        Author: 'LS Barbearias',
        CreatedDate: new Date()
      }
      wb.SheetNames.push('Relatório ' + title)
      var data = this.formatDataToSheet()
      var ws = XLSX.utils.aoa_to_sheet(data)
      wb.Sheets['Relatório ' + title] = ws
      var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })
      saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), 'Relatório ' + this.referer + '.xlsx')
    },

    formatDataToSheet () {
      const header = ['Data', 'Valor']
      const body = this.formatData(this.date).map(({ x, y }) => {
        return [`${x}/${new Date(this.date).getMonth() + 1}/${new Date(this.date).getFullYear()}`, 'R$ ' + y.toFixed(2)]
      })
      const sheet = [header, ...body]
      return sheet
    },

    s2ab (s) {
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF
      return buf
    }
  }
}
</script>

<style>
</style>
