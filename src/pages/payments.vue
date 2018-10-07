<template>
  <q-page padding>
    <div class='row'>
      <div class='col-12'>
        <div class='row justify-center q-mb-md'>
          <span class='q-display-2 text-weight-light'>Pagamentos</span>
        </div>
        <div class="row">
          <payment v-if="paying" @onfinish="finishAdding" />
        </div>
        <div class="row" v-if="!paying">
          <q-btn
            class="col-sm-12 col-md-8 offset-md-2 animated fadeIn"
            color="teal"
            @click="startPaying"
            size="lg"
            icon="attach_money"
          ><span class="q-pa-md">Receber</span></q-btn>
        </div>
        <div class="row q-py-md" v-if="lastPayment">
          <div class="col-sm-12 col-md-8 offset-md-2 animated fadeIn">
            <div class="row">
              <div class="col-sm-12 col-md-6 offset-md-3" v-html="getIcons.payment"></div>
            </div>
            <div class="row text-center">
              <span class="q-title col-12">Pagamento Realizado com Sucesso!</span>
            </div>
          </div>
        </div>
        <div class="row" v-if="!paying && lastfivePayments.length">
          <span class="q-pa-sm q-mt-lg text-grey text-weight-light q-title col-sm-12 col-md-8 offset-md-2 animated fadeInUp">
            Ultimos 5 pagamentos
          </span>
          <div class="col-sm-12">
            <div class="row" v-for='(payment) in lastfivePayments' :key='payment.id'>
              <q-card
                inline class='q-mb-md shadow-5 col-sm-12 col-md-8 offset-md-2 animated fadeInUp'>
                <q-card-title class="text-center">
                  <span slot='subtitle'>
                    <q-collapsible :label="new Date(payment.timestamp).toLocaleDateString() + ' - ' + new Date(payment.timestamp).toLocaleTimeString()">
                      <div>
                        <transition
                          appear
                          enter-active-class="animated fadeIn"
                        >
                          <div class="row">
                            <p class="col-12">
                               Serviço:
                              <strong>
                                {{ formatTitle(payment.service.name) }}
                              </strong> <br>
                              Cliente: <strong>{{ payment.client.name }}</strong> <br>
                              Pagamento: <strong>{{ payment.type.name + showFlag(payment.type) }}</strong> <br>
                              Valor do Serviço: R$ <strong>{{ payment.service.price.toFixed(2) }}</strong> <br>
                              <span v-if="payment.type.id === 'money'">
                                Recebido: R$ <strong>{{ payment.type.received.toFixed(2) }}</strong> <br>
                              </span>
                              Barbeiro: <strong>{{ payment.barber.name }}</strong>
                            </p>
                          </div>
                        </transition>
                      </div>
                    </q-collapsible>
                  </span>
                </q-card-title>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import payment from 'src/components/organism/payment'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('application', [
      'getPayments',
      'getIcons'
    ])
  },
  data () {
    return {
      paying: false,
      lastfivePayments: [],
      lastPayment: ''
    }
  },
  mounted () {
    this.getLastFivePayments()
  },
  components: {
    payment
  },
  methods: {
    getLastFivePayments () {
      this.lastfivePayments = this.getPayments
        .sort((a, b) => b.timestamp - a.timestamp)
        .filter((p, i) => i < 5)
    },

    startPaying () {
      this.lastPayment = ''
      this.paying = !this.paying
    },

    finishAdding (service) {
      this.paying = false
      this.getLastFivePayments()
      this.lastPayment = service
    },

    showFlag (type) {
      if (type.id !== 'money') return ' ' + type.flag
      else return ''
    },

    formatTitle (string) {
      if (string.length > 30) {
        return string.split('').filter((letter, index) => {
          return index < 30
        }).join('') + '...'
      } else {
        return string
      }
    }
  }
}
</script>
