<template>
  <q-dialog
    v-model="dialog"
    @hide="cancel"
    @escape-key="cancel"
    @cancel="cancel"
  >
    <span slot="title">Cadastrar Cliente</span>

    <span slot="message">Preencha todas as informações</span>

    <div slot="body">
        <q-field>
          <q-input type="text" class="q-pb-md" v-model="client.name" float-label="Informe um nome *" placeholder="Nome"/>
        </q-field>

        <q-field>
          <q-input type="number" class="q-pb-md" v-model="client.phone" float-label="Informe o Telefone *" placeholder="Ex: 21-99999-9999" />
        </q-field>

        <q-field>
          <q-input type="email" class="q-pb-md" v-model="client.email" float-label="Informe o E-mail" placeholder="E-mail" />
        </q-field>

        <q-datetime class="q-pa-md" color="teal" placeholder="Data de Nascimento" v-model="client.birthday" type="date" />
        <q-inner-loading :visible="visible">
          <q-spinner-gears size="50px" color="teal"></q-spinner-gears>
        </q-inner-loading>
    </div>

    <template slot="buttons" slot-scope="props">
      <div class="q-pb-sm">
        <q-btn color="teal" label="Cancelar" @click="props.cancel" />
        <q-btn color="green" label="Cadastrar" @click="processAddClient()" />
      </div>
    </template>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import db from 'src/firestore'

export default {
  computed: {
    ...mapGetters('application', [
      'getClients'
    ])
  },
  data () {
    return {
      client: {
        name: '',
        email: '',
        createDate: new Date().getTime(),
        phone: '',
        birthday: ''
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
      'setClients'
    ]),
    cancel () {
      this.dialog = false
      this.toggleDialog(this.dialog)
    },

    processAddClient () {
      if (this.client.name) {
        this.addClient()
      } else {
        this.$q.notify('Informe pelo menos um nome para o cliente')
      }
    },

    addClient () {
      const vm = this
      vm.visible = true
      vm.toggleDialog(vm.dialog)
      vm.$emit('toggle-loading', true)
      if (vm.client.birthday) vm.client.birthday = new Date(vm.client.birthday).getTime()
      db.pushClient(vm.client)
        .then((res) => {
          vm.$emit('toggle-loading', false)
          vm.client.id = res.id
          vm.$q.notify({
            message: res.message,
            timeout: 5000,
            type: 'positive',
            color: 'positive',
            icon: 'done_all',
            position: 'bottom',
            actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
          })
          const { getClients } = vm
          getClients.push(vm.client)
          vm.setClients(getClients)
          vm.dialog = false
          vm.visible = false
        })
    }
  }
}
</script>
