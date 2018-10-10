<template>
  <q-page padding>
    <div class='row'>
      <div class='col-12'>
        <div class='row justify-center q-mb-md'>
          <span class='q-display-2 text-weight-light' style="font-family: 'Fredericka the Great', cursive;">Despesas</span>
        </div>
        <div class="row justify-around q-py-sm">
          <q-field
            class="col-xs-12 col-sm-6 col-md-5 col-lg-4 col-xl-3 q-mb-md"
          >
            <q-select
              v-model="selectedMounth"
              float-label="Mês"
              radio color="teal"
              :options="mounthsOptions"
            />
          </q-field>
          <q-select
            v-model="selectedYear"
            float-label="Ano"
            radio color="teal"
            :options="yearsOptions"
            class="col-xs-12 col-sm-6 col-md-5 col-lg-4 col-xl-3 q-mb-md"
          />
        </div>
        <div class="row animated fadeInDown" v-if="filterPerMounthAndYear(getExpenses).length === 0 && (selectedMounth + '/' + selectedYear !== formatDateToCompare(new Date()))">
          <span class="col-12 text-center q-mb-md q-pa-sm bg-red text-white">
            {{ 'Não há despesas cadastradas para o mês de ' + mounths[selectedMounth -1] + ' de ' + selectedYear }}
          </span>
        </div>
        <div class="row">
            <div class="col-12 shadow-5">
              <q-tabs color="teal" v-model="selectedTab">
                <q-tab
                  v-for="(cat, index) in filterPerMounthAndYear(getExpenses)"
                  :key="index"
                  slot="title"
                  :name="'tab-' + (index + 1)"
                  :label="cat.label"
                  :default="index === 0" style="font-family: 'Fredericka the Great', cursive;"
                  :count="cat.expenses ? cat.expenses.length : 0"
                />
                <q-tab slot="title" name="tab-add" icon="add_circle_outline" :default="filterPerMounthAndYear(getExpenses).length === 0"/>
                <q-tab-pane
                  v-for="(cat, index) in filterPerMounthAndYear(getExpenses)" :key="index"
                  :name="'tab-' + (index + 1)" class="animated fadeIn"
                >
                  <div class="row q-pb-md justify-end">
                    <q-btn color="teal" class="q-mr-sm" @click.stop="actionSheet = true">
                      <q-icon name="settings" /> Ações de {{ cat.label }}
                    </q-btn>
                    <q-action-sheet
                      v-model="actionSheet"
                      @ok="onOk" :grid="!$q.platform.is.mobile"
                      :title="'Ações da categoria ' + cat.label"
                      :actions="[
                        {
                          label: 'Cadastrar despesa',
                          icon: 'add',
                          color: 'positive',
                          handler: {
                            func: addExpense,
                            payload: index
                          }
                        }, {
                          label: 'Editar despesas',
                          icon: 'edit',
                          color: 'teal',
                          handler: {
                            func: editExpense,
                            payload: cat
                          }
                        }, {
                          label: 'Deletar despesas',
                          icon: 'delete',
                          color: 'negative',
                          handler: {
                            func: deleteExpense,
                            payload: cat
                          }
                        }, {},
                        {
                          label: 'Excluir Categoria',
                          icon: 'delete_forever',
                          color: 'negative',
                          handler: {
                            func: deleteCategory,
                            payload: cat
                          }
                        }
                      ]"
                    />
                  </div>
                  <div class="row">
                    <div class="col-sm-12 col-md-10 offset-md-1">
                      <div v-if="cat.expenses.length">
                        <q-list highlight>
                          <q-list-header>Despesas de {{ cat.label }}</q-list-header>
                          <q-item v-for="(expense, index) in cat.expenses" :key="index">
                            <q-item-main :label="expense.deadline ? expense.deadline : ''">
                              <span class="q-title">{{ expense.name }}</span>
                              <p>{{ 'R$ ' + expense.value.toFixed(2).toLocaleString() }}</p>
                            </q-item-main>
                            <q-item-side right>
                              <q-btn class="q-mx-sm animated fadeInLeft" round icon="edit" color="positive" v-if="editing"></q-btn>
                              <q-btn class="q-mx-sm animated fadeInLeft" round icon="delete" color="red" v-if="deleting"></q-btn>
                              <q-btn class="q-mx-sm animated fadeInLeft" round icon="close" color="grey" v-if="editing || deleting"
                                @click.stop="cancelAction"></q-btn>
                              <q-item-tile color="teal" />
                            </q-item-side>
                          </q-item>
                        </q-list>
                        <div class="row q-pa-md text-right">
                          <div class="col-12 text-orange"><span class="q-subtitle">
                            <span class="q-pa-sm">Total de {{ cat.label }}: R$ -{{ totalize(cat.expenses).toFixed(2) }}</span>
                          </span></div>
                        </div>
                      </div>
                      <div v-else>
                        Voce ainda não possui despesas para esta categoria cadastre uma clicando
                        <q-btn color="positive" @click.stop="addExpense(index)">Aqui</q-btn>
                      </div>
                    </div>
                  </div>
                </q-tab-pane>
                <q-tab-pane
                  name="tab-add"
                >
                  <div class="row">
                    <div class="col-sm-12 col-md-8 offset-md-2">
                      <div class="row">
                        <div class="col-12">
                          <q-field
                            icon="money_off"
                            label="Nome da categoria de despesa"
                            helper="Informe um nome para a nova categoria de despesa"
                            :count="10"
                          >
                            <q-input :max-length="10" v-model="newCategory" />
                          </q-field>
                        </div>
                      </div>
                      <div class="row justify-end">
                        <div class="col-12">
                          <q-btn
                            class="q-my-md" color="teal"
                            @click.stop="pushExpensesCategory"
                          >
                            Cadastrar
                          </q-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-pane>
                <q-inner-loading :visible="loading">
                  <q-spinner-gears size="100px" color="teal"></q-spinner-gears>
                </q-inner-loading>
              </q-tabs>
              <div class="row text-center q-ma-sm" v-if="totalizeAll(filterPerMounthAndYear(getExpenses)) > 0">
                <div class="col-12">
                  <span class="q-pa-md text-red q-title">Total Geral: R$ -{{ totalizeAll(filterPerMounthAndYear(getExpenses)) }}</span>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
    <q-dialog
      v-model="dialog"
      @hide="cancel"
      @escape-key="cancel"
      @cancel="cancel"
    >
      <span slot="title">{{ editing ? 'Editar ' : 'Cadastrar ' }} despesa</span>
      <span slot="message">Preencha pelo menos um nome e valor</span>
      <div slot="body">
        <div class="row">
          <q-input class="col-12 q-my-sm" type="text" v-model="expense.name" placeholder="Nome da Despesa" />
          <q-input class="col-12 q-my-sm" type="number" v-model="expense.value" placeholder="Valor da Despesa" />
          <q-field class="col-sm-12 q-my-sm" label="Vencimento"
            helper="Data de vencimento, não obrigatório">
            <q-datetime color="teal" v-model="expense.deadline" type="datetime" />
          </q-field>
        </div>
        <q-inner-loading :visible="loading">
          <q-spinner-gears size="50px" color="teal"></q-spinner-gears>
        </q-inner-loading>
      </div>

      <template slot="buttons" slot-scope="props" :visible="!visible">
        <div class="q-pb-sm">
          <q-btn color="teal" label="Cancelar" @click="cancel()" />
          <q-btn color="green" label="Salvar" @click="pushExpense(expense)" />
        </div>
      </template>
    </q-dialog>
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
      'mounths'
    ])
  },
  data () {
    return {
      createYear: new Date(cache.get('user').firstLoginDate).getFullYear(),
      selectedTab: 'tab-1',
      newCategory: '',
      actionSheet: false,
      loading: false,
      dialog: false,
      handCategory: '',
      deleting: false,
      editing: false,
      selectedMounth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      mounthsOptions: [],
      yearsOptions: [],
      expense: {
        name: '',
        value: '',
        deadline: ''
      }
    }
  },
  mounted () {
    const yearsNumbers = new Date().getFullYear() - this.createYear
    for (let i = 0; i <= yearsNumbers; i++) {
      this.yearsOptions.push({
        label: String(this.createYear + i),
        value: this.createYear + i
      })
    }
    this.mounthsOptions = this.mounths.map((mounth, index) => {
      return { label: mounth, value: index + 1 }
    })
  },
  methods: {
    ...mapActions('application', [
      'setExpenses'
    ]),
    pushExpensesCategory () {
      const vm = this
      if (!vm.newCategory) return vm.$q.notify('Informe um nome válido')
      if (!(vm.newCategory.length <= 10)) return vm.$q.notify('A categoria deve ter no máximo 10 caracteres')
      if (vm.getExpenses.some(cat => cat.label.toLowerCase() === vm.newCategory.toLowerCase())) return vm.$q.notify('Essa categoria já foi cadastrada')
      vm.loading = true
      const expense = {
        label: vm.newCategory,
        timestamp: new Date().getTime(),
        creatorUser: cache.get('user').currentUser,
        expenses: []
      }
      db.pushExpense(expense).then(res => {
        expense.id = res.id
        vm.$q.notify({
          message: `Categoria ${vm.newCategory} Salva com sucesso`,
          timeout: 5000,
          type: 'positive',
          color: 'positive',
          icon: 'done_all',
          position: 'top',
          actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
        })
        const { getExpenses } = vm
        getExpenses.push(expense)
        this.setExpenses(getExpenses)
        vm.loading = false
        vm.newCategory = ''
        vm.selectedTab = 'tab-' + vm.getExpenses.length
      })
    },

    filterPerMounthAndYear (list) {
      const vm = this
      return list.filter(item => {
        return vm.formatDateToCompare(item.timestamp) === (vm.selectedMounth + '/' + vm.selectedYear)
      })
    },

    formatDateToCompare (date) {
      return (new Date(date).getMonth() + 1) + '/' + new Date(date).getFullYear()
    },

    cancelAction () {
      this.deleting = false
      this.editing = false
    },

    cancel () {
      this.dialog = false
      this.handCategory = ''
    },

    totalizeAll (list) {
      return list.reduce((total, current) => {
        return parseInt(total) + this.totalize(current.expenses)
      }, 0).toFixed(2)
    },

    totalize (list) {
      return list.reduce((total, current) => {
        return parseInt(total) + parseInt(current.value)
      }, 0)
    },

    onOk (item) {
      const { handler } = item
      handler.func(handler.payload)
    },

    deleteCategory (cat) {
      const vm = this
      if (cat.id) {
        vm.loading = true
        db.deleteExpense(cat.id).then(res => {
          vm.$q.notify({
            message: `Categoria ${cat.label} excluída com sucesso`,
            timeout: 5000,
            type: 'positive',
            color: 'positive',
            icon: 'done_all',
            position: 'top',
            actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
          })
          var { getExpenses } = vm
          getExpenses = getExpenses.filter(item => {
            return item.id !== cat.id
          })
          this.setExpenses(getExpenses)
          vm.loading = false
          if (!vm.filterPerMounthAndYear(vm.getExpenses).length) vm.selectedTab = 'tab-add'
        })
      } else {
        vm.$q.notify('Não há categoria para exclusão, cadastre uma.')
      }
    },

    addExpense (index) {
      this.handCategory = index
      this.dialog = true
    },

    pushExpense (expense) {
      const vm = this
      if (vm.expense.name && vm.expense.value) {
        vm.loading = true
        const { getExpenses } = vm
        const category = getExpenses[vm.handCategory]
        vm.expense.timestamp = new Date().getTime()
        category.expenses.push(vm.expense)
        db.editExpense(category).then(res => {
          vm.$q.notify({
            message: res.message,
            timeout: 5000,
            type: 'positive',
            color: 'positive',
            icon: 'done_all',
            position: 'top',
            actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
          })
          this.setExpenses(cache.get('expenses').map(expense => {
            return expense.label === category.label ? category : expense
          }))
          vm.handCategory = ''
          vm.loading = false
          this.dialog = false
          vm.expense = {
            name: '',
            value: '',
            deadline: ''
          }
        })
      } else {
        vm.$q.notify('Preencha as informações necessárias')
      }
    },

    editExpense (category) {
      if (category.expenses.length) {
        if (this.deleting) this.deleting = false
        this.editing = true
      } else {
        this.$q.notify('Não há despesas para exclusão, cadastre uma.')
      }
    },

    deleteExpense (category) {
      if (category.expenses.length) {
        if (this.editing) this.editing = false
        this.deleting = true
      } else {
        this.$q.notify('Não há despesas para exclusão, cadastre uma.')
      }
    }
  }
}
</script>
