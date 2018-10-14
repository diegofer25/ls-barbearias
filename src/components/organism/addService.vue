<template>
  <q-dialog
    v-model="dialog"
    @hide="cancel"
    @escape-key="cancel"
    @cancel="cancel"
  >
    <span slot="title">Cadastro de Serviço</span>

    <span slot="message">Preencha todas as informações</span>

    <div slot="body">
      <q-field>
        <q-input type="text" class="q-pb-md" v-model="service.name" float-label="Nome do Serviço" placeholder="..."/>
      </q-field>

      <q-field>
        <q-input type="textarea" class="q-pb-md" v-model="service.description" float-label="Descrição do serviço *" placeholder="..." />
      </q-field>

      <q-field>
        <q-input type="number" class="q-pb-md" v-model="service.price" float-label="Informe o Valor"
          numeric-keyboard-toggle prefix="R$ " align="right"/>
      </q-field>
      <q-inner-loading :visible="visible">
        <q-spinner-gears size="50px" color="teal"></q-spinner-gears>
      </q-inner-loading>
    </div>

    <template slot="buttons" slot-scope="props" v-if="!visible">
      <div class="q-pb-sm">
        <q-btn color="teal" label="Cancelar" @click="props.cancel" />
        <q-btn color="green" label="Cadastrar" @click="addService()" />
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
      'getServices'
    ])
  },
  data () {
    return {
      service: {
        name: '',
        description: '',
        price: 0
      },
      dialog: true,
      visible: false
    }
  },
  methods: {
    ...mapActions('application', [
      'toggleDialog',
      'setServices'
    ]),
    cancel () {
      this.dialog = false
      this.toggleDialog(this.dialog)
    },

    addService () {
      const vm = this
      if (vm.validateInputs()) {
        vm.visible = true
        db.pushService(vm.service)
          .then((res) => {
            vm.dialog = false
            vm.service.id = res.id
            vm.toggleDialog(vm.dialog)
            this.$q.notify({
              message: 'Serviço cadastrado',
              timeout: 5000,
              type: 'positive',
              color: 'positive',
              icon: 'done_all',
              position: 'bottom',
              actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
            })
            const { getServices } = vm
            getServices.push(vm.service)
            vm.setServices(getServices)
            vm.visible = false
          })
      } else {
        this.$q.notify({
          message: 'Por favor informe todos os campos',
          timeout: 5000,
          type: 'warning',
          color: 'warning',
          icon: 'warning',
          position: 'bottom',
          actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
        })
      }
    },

    validateInputs () {
      return this.service.name !== '' && this.service.description !== '' && this.service.price > 0
    }
  }
}
</script>
