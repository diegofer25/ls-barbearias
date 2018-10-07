<template>
  <q-layout dark class="bg-teal-5">
    <q-page-container>
      <q-page>
        <div class="row text-white" style="height: 100vh">
          <div class="self-center col-sm-10 offset-sm-1 col-md-6 offset-md-3 shadow-10">
            <q-card text-color="white" flat class="bg-teal-8">
              <q-card-main>
                <div class="row q-pa-sm text-center">
                  <div class="col-6 offset-3 col-md-4 offset-md-4 col-xl-2 offset-xl-5 text-center" v-html="getIcons.barberShop"></div>
                  <span class="q-display-3 col-12" style="font-family: 'Fredericka the Great', cursive;">LS Barbearias</span>
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
                          dark
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
                          dark
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
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'
import cache from 'src/cache'
import firebase from 'firebase'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      year: new Date().getFullYear(),
      loading: false,
      visible: true
    }
  },
  validations: {
    form: {
      email: { required, email },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(10)
      }
    }
  },
  mounted () {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyADpbhg0JXFh74zEhvEVNPgnu91NsdZLkE',
        authDomain: 'ls-saloon-login.firebaseapp.com',
        databaseURL: 'https://ls-saloon-login.firebaseio.com',
        projectId: 'ls-saloon-login'
      })
    }
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.push({ path: 'app' })
      }
    })
  },
  computed: {
    ...mapGetters('application', [
      'getIcons'
    ])
  },
  methods: {
    submit () {
      this.loading = true
      const notify = this.$q.notify
      const form = this.$v.form
      form.$touch()
      if (form.email.$error) {
        if (!form.email.required) notify('Campo Email é obrigatório')
        else notify('Campo Email inválido')
      } else if (form.password.$error) {
        if (!form.password.required) notify('Campo senha é obrigatório')
        else if (!form.password.minLength) notify('Campo senha é deve possui no mínimo 6 caracteres')
        else if (!form.password.maxLength) notify('Campo senha é deve possui no máximo 10 caracteres')
      } else {
        firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password)
          .then(user => {
            console.log(user)
            cache.set('user', user.email)
            this.loading = false
            notify({
              message: 'Atenticado com sucesso!',
              color: 'positive'
            })
            setTimeout(() => {
              this.$router.push({ path: 'app' })
            }, 1000)
          })
          .catch((error) => {
            console.log(error)
            if (error.code === 'auth/user-not-found') notify('Email não cadastrado')
            if (error.code === 'auth/wrong-password') notify('Senha incorreta!')
            this.loading = false
          })
      }
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Fredericka+the+Great');
</style>
