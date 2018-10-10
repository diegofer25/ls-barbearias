<template>
  <q-layout dark class="bg-teal-5">
    <q-page-container>
      <q-page>
        <div class="row text-white q-px-sm" style="height: 100vh">
          <div class="self-center col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4 shadow-10">
            <q-card text-color="white" flat class="bg-teal-8">
              <q-card-main>
                <div class="row q-pa-sm text-center">
                  <span class="q-display-2 col-12" style="font-family: 'Fredericka the Great', cursive;">LS Barbearias</span>
                  <div class="col-6 offset-3 col-md-4 offset-md-4 col-xl-2 offset-xl-5 text-center q-my-md" v-html="getIcons.logo"></div>
                  <i class="col-12 q-subheading text-weight-light">Controle e Gestão de Barbearias</i>
                </div>
                <div class="row">
                  <div class="col-sm-12 col-md-10 offset-md-1 bg-teal q-pa-md shadow-1">
                    <div class="row">
                      <q-field
                        class="col-12"
                        :error="$v.form.email.$error"
                        error-label="Campo E-mail inválido"
                        icon="mail"
                        helper="Ex: meuemail@email.com">
                        <q-input
                          type="email"
                          v-model="form.email"
                          @blur="$v.form.email.$touch"
                          @keyup.enter="submit"
                          :error="$v.form.email.$error"
                          float-label="E-mail"
                          dark :loading="loading" :readonly="loading"
                        />
                      </q-field>
                      <q-field
                        class="col-12"
                        :error="$v.form.username.$error"
                        error-label="Campo Usuário inválido"
                        icon="person">
                        <q-input
                          type="text"
                          v-model="form.username"
                          @blur="$v.form.username.$touch"
                          @keyup.enter="submit"
                          :error="$v.form.username.$error"
                          float-label="Usuário"
                          dark :loading="loading" :readonly="loading"
                        />
                      </q-field>
                      <q-field
                        class="col-12"
                        :error="$v.form.password.$error"
                        error-label="Campo Senhal inválido"
                        icon="lock">
                        <q-input
                          type="password"
                          v-model="form.password"
                          @blur="$v.form.password.$touch"
                          @keyup.enter="submit"
                          :error="$v.form.password.$error"
                          float-label="Senha"
                          dark :loading="loading" :readonly="loading"
                        />
                      </q-field>
                      <div class="col-12">
                        <q-btn
                          color="teal-8"
                          @click.stop="logout"
                          class="q-mt-md float-left"
                          outline
                          text-color="white"
                        >Esqueceu ?</q-btn>
                        <q-btn
                          color="teal-8"
                          @click.stop="submit"
                          class="q-mt-md float-right"
                          round
                          push
                          icon="send"
                          :loading="loading"
                        ></q-btn>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row q-mt-md text-right">
                  <div class="col-12">
                    <i class="q-caption">&copy; Lamarão Softwares - {{ year }}</i>
                  </div>
                </div>
              </q-card-main>
            </q-card>
          </div>
        </div>
        <q-modal
          v-model="modal"
          @hide="closeModal()"
          @escape-key="closeModal()"
          position="right"
        >
          <div class="layout-padding bg-teal-9 text-white">
            <div class="row">
              <div class="col-12">
                <div class="row">
                  <span class="q-headline col-12 text-right">Primeiro Login Detectado</span>
                  <span class="q-subtitle col-12 text-right">Informe o campo abaixo</span>
                </div>
                <div class="row q-py-md">
                  <q-input
                    type="text"
                    class="col-12 q-mb-md"
                    v-model="storeName"
                    float-label="Qual o nome da sua barbearia?"
                    color="teal-2"
                    dark
                  />
                </div>
                <div class="row">
                  <div class="col-12">
                    <q-btn
                      class="col-10 offset-1 float-right"
                      color="teal"
                      round
                      icon="save"
                      @click.stop="updateUser()"
                    />
                  </div>
                </div>
              </div>
              <q-inner-loading :visible="visible">
                <q-spinner-gears size="50px" color="teal"></q-spinner-gears>
              </q-inner-loading>
            </div>
          </div>
        </q-modal>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'
import cache from 'src/cache'
import firebase from 'firebase'
import 'firebase/firestore'
import firebaseAuth from 'src/firestore/firebaseAuth.js'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        email: '',
        username: '',
        password: ''
      },
      year: new Date().getFullYear(),
      loading: false,
      visible: false,
      modal: false,
      storeName: ''
    }
  },
  validations: {
    form: {
      email: { required, email },
      username: {
        required,
        maxLength: maxLength(10)
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(10)
      }
    }
  },
  mounted () {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseAuth)
    }
  },
  computed: {
    ...mapGetters('application', [
      'getIcons'
    ])
  },
  methods: {
    submit () {
      const vm = this
      if (!vm.hasErro()) {
        vm.loading = true
        firebase.auth().signInWithEmailAndPassword(vm.form.email, vm.form.email)
          .then((fbUser) => {
            const db = firebase.firestore()
            db.settings(({ timestampsInSnapshots: true }))
            db.collection('users').doc(fbUser.email)
              .get().then(doc => {
                const license = doc.data()
                if (license.users[vm.form.username]) {
                  if (license.users[vm.form.username].pass === vm.form.password) {
                    delete license.users
                    license.currentUser = vm.form.username
                    cache.set('user', license)
                    if (license.storeName) vm.$router.push({ path: '/app' })
                    else vm.firstLogin(license)
                  } else {
                    vm.negativeResponse('Senha incorreta')
                  }
                } else {
                  vm.negativeResponse('Usuário não encontrado')
                }
              }).catch(error => {
                console.log(error)
                vm.negativeResponse('Erro na comunicação com o servidor')
              })
          })
          .catch((error) => {
            if (error.code === 'user-disabled') vm.negativeResponse('Usuário Bloqueado')
            if (error.code === 'auth/user-not-found') vm.negativeResponse('Email não cadastrado')
          })
      }
    },

    negativeResponse (message) {
      firebase.auth().signOut()
      this.$q.notify(message)
      this.loading = false
    },

    hasErro () {
      const vm = this
      const notify = vm.$q.notify
      const form = vm.$v.form
      form.$touch()
      if (form.email.$error) {
        if (!form.email.required) notify('Campo Email é obrigatório')
        else notify('Campo Email inválido')
        return true
      } else if (form.username.$error) {
        if (!form.password.required) notify('Campo usuário é obrigatório')
        else if (!form.password.maxLength) notify('Campo usuário é deve possui no máximo 10 caracteres')
        return true
      } else if (form.password.$error) {
        if (!form.password.required) notify('Campo senha é obrigatório')
        else if (!form.password.minLength) notify('Campo senha é deve possui no mínimo 6 caracteres')
        else if (!form.password.maxLength) notify('Campo senha é deve possui no máximo 10 caracteres')
        return true
      }
      return false
    },

    updateUser () {
      const vm = this
      vm.visible = true
      vm.user.storeName = vm.storeName
      vm.user.firstLoginDate = new Date().getTime()
      const db = firebase.firestore()
      db.settings(({ timestampsInSnapshots: true }))
      db.collection('users').doc(vm.user.email).update(vm.user)
        .then(() => {
          cache.set('user', vm.user)
          vm.modal = false
          vm.loading = false
          vm.visible = false
          vm.$router.push({ path: '/app' })
        })
    },

    closeModal () {
      const vm = this
      vm.modal = false
      vm.loading = false
      vm.$router.push({ path: '/app' })
    },

    firstLogin (user) {
      this.user = user
      this.modal = true
    }
  }
}
</script>
