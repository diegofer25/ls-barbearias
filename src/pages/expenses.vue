<template>
  <q-page padding>
    <q-page-sticky :position="$q.platform.is.mobile ? 'bottom-right' : 'top-left'" :offset="[20, 20]" style="z-index: 1">
      <q-btn
        push
        color="teal"
        @click.stop="() => {
          dialog = true
          toggleDialog(true)
        }"
        size="md"
        icon="note_add"
      ></q-btn>
    </q-page-sticky>
    <div class="row">
      <div class="col-12">
        <div class='row justify-center q-mb-md'>
          <span class='q-display-2 text-weight-light' style="font-family: 'Fredericka the Great', cursive;">Despesas</span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-10 offset-md-1 animated fadeInUp">
        <div>
          <transition
            appear
            enter-active-class="animated fadeIn">
            <q-table
              v-if="getExpenses.length > 0"
              ref="table"
              title="Lista de Despesas"
              :filter="filter"
              :data="getExpenses"
              :columns="expensesColumns"
              row-key="id"
              selection="single"
              :selected.sync="selected"
              :loading="loading"
              :pagination.sync="pagination"
              :rows-per-page-options="[0]"
              rows-per-page-label="Linhas por página">
              <template slot="top-right" slot-scope="props">
                <q-search v-model="filter" placeholder="Buscar"/>
                <q-btn v-if="selected.length !== 0" color="positive" class="animated zoomIn" flat round delete icon="edit" @click="editing = true">
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn v-if="selected.length !== 0" color="negative" class="animated zoomIn" flat round delete icon="delete_forever" @click="deleteExpense">
                  <q-tooltip>Excluir</q-tooltip>
                </q-btn>
                <q-btn
                    flat round dense
                    :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                    @click="props.toggleFullscreen"
                  />
              </template>
            </q-table>

            <div v-else class="row justify-center">
              <span class="q-title text-grey">Não há despesas cadastradas</span>
            </div>
          </transition>

          <div v-if="editing">
            <q-dialog
              v-model="editing"
              @hide="editing = !editing"
              @escape-key="editing = !editing"
              @cancel="editing = !editing"
            >
              <span slot="title">Editar Despesa</span>

              <span slot="message">Edite as informações</span>

              <div slot="body">
                  <q-field>
                    <q-input type="number" class="q-pb-md" v-model="selected[0].value" float-label="Informe um valor *" />
                  </q-field>

                  <div class="q-mt-sm">
                    <q-toggle left-label v-model="selected[0].payed" label="Pago?" class="q-mr-sm" />{{ selected[0].payed ? 'Sim' : 'Não' }}
                  </div>

                  <q-datetime class="q-pa-md" color="teal" placeholder="Data de Vencimento" v-model="selected[0].deadline" type="date" />
              </div>

              <template slot="buttons" slot-scope="props">
                <div class="q-pb-sm">
                  <q-btn color="teal" label="Cancelar" @click="props.cancel" />
                  <q-btn color="green" label="Confirmar" @click="confirmExpense()" />
                </div>
              </template>
            </q-dialog>
          </div>
        </div>
      </div>
    </div>
    <div v-if="getDialog">
      <q-dialog
        v-model="dialog"
        @hide="cancel"
        @escape-key="cancel"
        @cancel="cancel"
      >

        <span slot="title">Cadastrar Despesa</span>

        <span slot="message">Preencha todas as informações</span>

        <div slot="body">
          <q-field
            :count="50"
          >
            <q-input type="text" class="q-pb-md" v-model="expense.title" float-label="Informe uma descrição *" placeholder="Ex: Aluguel"/>
          </q-field>

          <q-field
            :count="11"
          >
            <q-input type="number" class="q-pb-md" v-model="expense.value" float-label="Informe o valor da despesa *" />
          </q-field>

          <q-datetime class="q-pa-md" color="teal" placeholder="Data de Vencimento" v-model="expense.deadline" type="date" />
          <q-inner-loading :visible="visible">
            <q-spinner-gears size="50px" color="teal"></q-spinner-gears>
          </q-inner-loading>
        </div>

        <template slot="buttons" slot-scope="props">
          <div class="q-pb-sm">
            <q-btn color="teal" label="Cancelar" @click="props.cancel" />
            <q-btn color="green" label="Cadastrar" @click="addExpense()" />
          </div>
        </template>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import db from 'src/firestore'
import cache from 'src/cache'
export default {
  name: 'Expenses',
  computed: {
    ...mapGetters('application', [
      'getExpenses',
      'mounths',
      'getDialog'
    ])
  },
  data () {
    return {
      pagination: { sortBy: null, descending: false, page: 1, rowsPerPage: 0 },
      filter: '',
      selected: [],
      editing: false,
      loading: false,
      expense: {
        title: '',
        value: undefined,
        deadline: '',
        payed: false
      },
      dialog: true,
      visible: false,
      expensesColumns: [{
        name: 'title',
        required: true,
        label: 'Descrição',
        align: 'left',
        field: 'title',
        sortable: true
      }, {
        name: 'value',
        required: true,
        label: 'Valor',
        align: 'left',
        field: 'value',
        sortable: true,
        format: val => 'R$ ' + val
      }, {
        name: 'payed',
        required: true,
        label: 'Paga',
        align: 'left',
        field: 'payed',
        sortable: true,
        format: val => val ? 'Sim' : 'Não '
      }, {
        name: 'deadline',
        required: true,
        label: 'Vencimento',
        align: 'left',
        field: 'deadline',
        sortable: true,
        format: val => val ? new Date(val).toLocaleDateString() : 'ND'
      }, {
        name: 'deadline',
        required: true,
        label: 'Vencida?',
        align: 'left',
        field: 'deadline',
        sortable: true,
        format: val => (!val ? 'ND' : new Date(val).getTime() < new Date().getTime() ? 'Sim' : 'Não')
      }]
    }
  },
  methods: {
    ...mapActions('application', [
      'setExpenses',
      'toggleDialog'
    ]),

    cancel () {
      this.dialog = false
      this.expense = {
        title: '',
        value: undefined,
        deadline: '',
        payed: false
      }
      this.toggleDialog(false)
    },

    addExpense () {
      let vm = this
      if (vm.expense.title !== '' && vm.expense.value > 0) {
        if (vm.checkExistExpense(vm.expense.title)) {
          vm.visible = true
          vm.expense.createAt = new Date().getTime()
          db.pushExpense(vm.expense)
            .then((response) => {
              vm.expense.id = response.id
              vm.dialog = false
              vm.toggleDialog(vm.dialog)
              this.$q.notify({
                message: response.message,
                timeout: 5000,
                type: 'positive',
                color: 'positive',
                icon: 'done_all',
                position: 'bottom',
                actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
              })
              let expenses = cache.has('expenses') ? cache.get('expenses') : []
              expenses.push(vm.expense)
              cache.set('expenses', expenses)
              vm.setExpenses(expenses)
              vm.visible = false
              vm.cancel()
            })
        }
      } else {
        this.$q.notify({
          message: 'Por favor preencha todos os campos obrigatórios',
          timeout: 3000,
          type: 'negative',
          color: 'negative',
          icon: 'warning',
          position: 'bottom',
          actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
        })
      }
    },

    checkExistExpense (name) {
      if (this.getExpenses.some((expense) => {
        return expense.title.toLowerCase().trim() === name.toLowerCase().trim()
      })) {
        this.$q.notify({
          message: 'Esta despesa já está cadastrada',
          timeout: 3000,
          type: 'negative',
          color: 'negative',
          icon: 'warning',
          position: 'bottom',
          actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
        })
        return false
      }
      return true
    },

    confirmExpense () {
      const vm = this
      this.editing = false
      this.loading = true
      db.editExpense(vm.selected[0])
        .then((res) => {
          this.$q.notify({
            message: res.message,
            timeout: 5000,
            type: 'positive',
            color: 'positive',
            icon: 'done_all',
            position: 'bottom',
            actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
          })
          vm.setExpenses(vm.getExpenses.map((expense) => {
            return expense.id === vm.selected[0].id ? vm.selected[0] : expense
          }))
          vm.editing = false
          vm.loading = false
          vm.selected = []
        })
    },

    deleteExpense () {
      const vm = this
      this.loading = true
      if (confirm('Deseja mesmo excluir esta despesa?')) {
        db.deleteExpense(vm.selected[0].id)
          .then((res) => {
            this.$q.notify({
              message: res.message,
              timeout: 5000,
              type: 'positive',
              color: 'positive',
              icon: 'done_all',
              position: 'bottom',
              actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
            })
            vm.setExpenses(vm.getExpenses.filter((expense) => {
              return expense.id !== vm.selected[0].id
            }))
            vm.selected = []
          })
      }
      this.loading = false
    }
  }
}
</script>
