<template>
  <q-dialog
    v-model="dialog"
    @hide="cancel"
    @escape-key="cancel"
    @cancel="cancel"
  >

    <span slot="title">Cadastrar Barbeiro</span>

    <span slot="message">Preencha todas as informações</span>

    <div slot="body">
      <q-field
        :count="50"
        :error="validation.name.error"
        :error-label="validation.name.message"
      >
        <q-input type="text" @keyup="nameValidator" class="q-pb-md" v-model="barber.name" float-label="Informe um nome" placeholder="Nome"/>
      </q-field>

      <q-field
        :count="11"
        :error="validation.cpf.error"
        :error-label="validation.cpf.message"
      >
        <q-input type="text" @keyup="cpfValidator" class="q-pb-md" v-model="barber.cpf" float-label="Informe o CPF" placeholder="CPF" />
      </q-field>

      <q-datetime class="q-pa-md" color="teal" placeholder="Data de Entrada" v-model="barber.date" type="date" />
      <q-inner-loading :visible="visible">
        <q-spinner-gears size="50px" color="teal"></q-spinner-gears>
      </q-inner-loading>
    </div>

    <template slot="buttons" slot-scope="props">
      <div class="q-pb-sm">
        <q-btn color="teal" label="Cancelar" @click="props.cancel" />
        <q-btn color="green" label="Cadastrar" @click="addBarber()" />
      </div>
    </template>
  </q-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import db from 'src/firestore'
import cache from 'src/cache'

export default {
  data () {
    return {
      barber: {
        name: '',
        cpf: '',
        date: undefined
      },
      dialog: true,
      validation: {
        name: {
          error: false,
          message: ''
        },
        cpf: {
          error: false,
          message: ''
        }
      },
      visible: false
    }
  },
  methods: {
    ...mapActions('application', [
      'toggleDialog',
      'setBarbers'
    ]),
    cancel () {
      this.dialog = false
      this.toggleDialog(this.dialog)
    },

    addBarber () {
      let vm = this
      if (vm.barber.name !== '' && vm.barber.cpf !== '') {
        if (!vm.validation.name.error && !vm.validation.cpf.error) {
          vm.visible = true
          db.pushBarber(vm.barber)
            .then((response) => {
              vm.barber.id = response.id
              vm.dialog = false
              vm.toggleDialog(vm.dialog)
              this.$q.notify({
                message: response.message,
                timeout: 5000,
                type: 'positive',
                color: 'positive',
                icon: 'done_all',
                position: 'top',
                actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
              })
              let barbers = cache.has('barbers') ? cache.get('barbers') : []
              barbers.push(vm.barber)
              cache.set('barbers', barbers)
              vm.setBarbers(barbers)
              vm.visible = false
            })
        } else {
          this.$q.notify({
            message: this.validation.name.message + ' ' + this.validation.cpf.message,
            timeout: 3000,
            type: 'negative',
            color: 'negative',
            icon: 'warning',
            position: 'top',
            actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
          })
        }
      } else {
        this.$q.notify({
          message: 'Por favor preencha todos os campos',
          timeout: 3000,
          type: 'negative',
          color: 'negative',
          icon: 'warning',
          position: 'top',
          actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
        })
      }
    },

    cpfValidator () {
      let cpf = this.validation.cpf
      if (this.barber.cpf.length === 11) {
        cpf.error = false
        cpf.message = ''
      } else {
        cpf.error = true
        cpf.message = 'Preencha os 11 digitos do CPF'
      }
    },

    nameValidator () {
      let name = this.validation.name
      let names = this.barber.name.split(' ')
      if (names.length > 1 && names[1].length > 2) {
        name.error = false
        name.message = ''
      } else {
        name.error = true
        name.message = 'Digite pelo menos um sobrenome'
      }
    }
  }
}
</script>
