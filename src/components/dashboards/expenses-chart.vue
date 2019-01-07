<template>
  <div class="row justify-start">
    <div class="col-12"  v-if="expenses.length">
      <div id="expenses-chart">
        <div class="row">
          <div class="col-12">
            <q-card class="shadow-8 q-pa-sm q-mr-sm">
              <div class="row">
                <div class="col-md-12 col-lg-6">
                  <apexchart height="350px" type="donut" :options="options" :series="series"></apexchart>
                </div>
                <div class="col-md-12 col-lg-6">
                  <apexchart height="350px" type="pie" :options="deadLineOptions" :series="deadLineSeries"></apexchart>
                </div>
                <div class="col-md-12" v-if="expenses.filter(e => e.deadline).length">
                  <div class="row justify-center">
                    <div class="col-md-10 col-lg-6">
                      <apexchart height="350px" type="radialBar" :options="radialOpetions" :series="radialSeries"></apexchart>
                    </div>
                  </div>
                </div>
              </div>
              <div class="toolbar">
                <div class="row justify-end">
                  <q-btn @click.stop="exportData('Despesas')" color="secondary">EXPORTAR PARA EXEL</q-btn>
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </div>
    <div class="col-sm-12" v-else>
      <div class="row justify-center">
        <span class="q-title">Não há despesas cadastradas</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'expenses-chart',
  props: [
    'expenses',
    'date'
  ],
  computed: {
    ...mapGetters('application', ['getUser'])
  },
  data () {
    const vue = this
    return {
      series: this.expenses.map(expense => {
        return expense.value
      }),
      options: {
        chart: {
          id: 'expenses-total'
        },
        responsive: [{
          breakpoint: 600,
          options: {
            legend: {
              position: 'bottom'
            }
          }
        }],
        tooltip: {
          enabled: true,
          y: {
            formatter: (val) => 'R$ ' + (val ? val.toFixed(2) : val),
            title: {
              formatter: (seriesName, opt) => {
                const deadline = new Date(vue.expenses[opt.seriesIndex].deadline)
                return `<strong class="q-subheading">${seriesName}</strong >
                        <br>
                        <span>Paga: <b>${vue.expenses[opt.seriesIndex].payed ? 'Sim' : 'Não'}</b></span>
                        <br>
                        <span>Vencida: <b>${deadline.getTime() < new Date().getTime() ? 'Sim, dia ' + deadline.toLocaleDateString() : 'Não'}</b></span>
                        <br>
                        <span>Valor: </span>`
              }
            }
          }
        },
        legend: {
          show: true,
          floating: false,
          fontSize: '16px',
          position: 'left',
          offsetX: 0,
          offsetY: 20,
          labels: {
            useSeriesColors: true
          },
          markers: {
            size: 0
          },
          formatter: (val) => {
            return `<span class="text-truncate">${val}</span>`
          },
          itemMargin: {
            horizontal: 1
          }
        },
        labels: this.expenses.map(expense => {
          return expense.title
        }),
        title: {
          text: 'Total de despesas: R$ ' + this.expenses.reduce((acc, cur) => {
            return (acc + cur.value)
          }, 0.0).toFixed(2),
          align: 'left',
          margin: 0,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: '22px',
            color: '#263238'
          }
        }
      },
      radialOpetions: {
        chart: {
          type: 'radialBar'
        },
        responsive: [{
          breakpoint: 600,
          options: {
            legend: {
              position: 'bottom'
            }
          }
        }],
        title: {
          text: 'Despesas por status de pagamento',
          align: 'left',
          margin: 0,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: '22px',
            color: '#263238'
          }
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: '22px'
              },
              value: {
                fontSize: '16px'
              },
              total: {
                show: true,
                label: 'Total',
                formatter: function (w) {
                  return 'R$ ' + vue.expenses.reduce((acc, cur) => {
                    return (acc + cur.value)
                  }, 0.0).toFixed(2)
                }
              }
            }
          }
        },
        colors: ['#4CAF50', '#F44336'],
        labels: ['Pagas', 'A pagar'],
        legend: {
          show: true,
          floating: false,
          fontSize: '16px',
          position: 'left',
          offsetX: 0,
          offsetY: 20,
          labels: {
            useSeriesColors: true
          },
          markers: {
            size: 0
          },
          formatter: function (seriesName, opts) {
            return seriesName + ': R$ ' + vue.expenses.filter(e => seriesName === 'Pagas' ? e.payed : !e.payed).reduce((acc, cur) => {
              return (acc + cur.value)
            }, 0.0)
          },
          itemMargin: {
            horizontal: 1
          }
        }
      },
      radialSeries: [vue.getPercentOfTotal(true), vue.getPercentOfTotal(false)],
      deadLineOptions: {
        chart: {
          id: 'expenses-total'
        },
        responsive: [{
          breakpoint: 600,
          options: {
            legend: {
              position: 'bottom'
            }
          }
        }],
        tooltip: {
          enabled: true,
          y: {
            formatter: (val) => 'R$ ' + (val ? val.toFixed(2) : val),
            title: {
              formatter: (seriesName, opt) => {
                var list = []
                if (seriesName === 'A vencer') list = vue.expenses.filter(e => new Date(e.deadline).getTime() >= new Date().getTime())
                else list = vue.expenses.filter(e => new Date(e.deadline).getTime() < new Date().getTime())
                return `<b class="q-subheading">${seriesName}:</b>
                        <br>
                        <span>${list.map(i => i.title + ': <b>' + new Date(i.deadline).toLocaleDateString() + '</b>').join('<br>')}</span>
                        <br>
                        <span>Total: </span>`
              }
            }
          }
        },
        colors: ['#4CAF50', '#F44336'],
        legend: {
          show: true,
          floating: false,
          fontSize: '16px',
          position: 'left',
          offsetX: 0,
          offsetY: 20,
          labels: {
            useSeriesColors: true
          },
          markers: {
            size: 0
          },
          formatter: undefined,
          itemMargin: {
            horizontal: 1
          }
        },
        labels: ['A vencer', 'Vencida'],
        title: {
          text: 'Total de despesas com vencimento: R$ ' + this.expenses.filter(e => e.deadline).reduce((acc, cur) => {
            return (acc + cur.value)
          }, 0.0).toFixed(2),
          align: 'left',
          margin: 0,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: '22px',
            color: '#263238'
          }
        }
      },
      deadLineSeries: this.getDeadLineSeries()
    }
  },
  methods: {
    getPercentOfTotal (status) {
      const value = this.expenses.filter(e => e.payed === status).reduce((acc, cur) => {
        return (acc + cur.value)
      }, 0.0)
      const total = this.expenses.reduce((acc, cur) => {
        return (acc + cur.value)
      }, 0.0)
      return ((value / total) * 100).toFixed(1)
    },

    getDeadLineSeries () {
      const late = this.expenses.filter(e => new Date(e.deadline).getTime() < new Date().getTime()).reduce((acc, cur) => {
        return (acc + cur.value)
      }, 0.0)
      const inDay = this.expenses.filter(e => new Date(e.deadline).getTime() >= new Date().getTime()).reduce((acc, cur) => {
        return (acc + cur.value)
      }, 0.0)
      return [inDay, late]
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
      saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), 'Relatório ' + title + '.xlsx')
    },

    formatDataToSheet () {
      const { expenses } = this
      const header = ['Descrição', 'Valor', 'Paga', 'Vencimento']
      const body = expenses.map(e => {
        return [
          e.title,
          e.value,
          (e.payed ? 'Sim' : 'Não'),
          e.deadline ? new Date(e.deadline).toLocaleDateString() : 'ND'
        ]
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
