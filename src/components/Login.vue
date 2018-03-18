<template>
  <div>
    <!--<form novalidate class="md-layout md-alignment-center-center" @submit.prevent="validateRegister">-->
      <!--<md-card class="md-layout-item md-size-50 md-small-size-100">-->
        <!--<md-card-header>-->
          <!--<div class="md-title">Sign In</div>-->
        <!--</md-card-header>-->

        <!--<md-card-content>-->
          <!--<md-field :class="getValidationClass('email')">-->
            <!--<label for="email">Email</label>-->
            <!--<md-input name="email" id="email" v-model="form.email" :disabled="sending" @input="$v.$touch()"/>-->
            <!--<span class="md-error" v-if="!$v.form.email.required">Email is required</span>-->
            <!--<span class="md-error" v-else-if="!$v.form.email.email">Invalid email</span>-->
            <!--<span class="md-error" v-else-if="!$v.form.email.emailNotRegistered">This email has not been registered.</span>-->
          <!--</md-field>-->
          <!--<md-field :class="getValidationClass('password')">-->
            <!--<label for="password">Password</label>-->
            <!--<md-input name="password" id="password" type="password" v-model="form.password" :disabled="sending" @input="$v.$touch(); hideWrongPwdMsg = true"/>-->
            <!--<span class="md-error" v-if="!$v.form.password.required">Password is required.</span>-->
            <!--<span class="md-error" v-else-if="!$v.form.password.minLength">Password must have at least {{ $v.form.password.$params.minLength.min }} characters.</span>-->
            <!--<span class="md-error" v-else-if="!$v.form.password.wrongPassword">The password is incorrect.</span>-->
          <!--</md-field>-->

          <!--<router-link to="/register">Don't have an account?  Sign up here!</router-link>-->

        <!--</md-card-content>-->

        <!--<md-progress-bar md-mode="indeterminate" v-if="sending"></md-progress-bar>-->

        <!--<md-card-actions>-->
          <!--<md-button type="submit" class="md-primary" :disabled="sending">Sign In</md-button>-->
        <!--</md-card-actions>-->

      <!--</md-card>-->
    <!--</form>-->

    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import firebaseui from 'firebaseui'

  export default {
    name: 'register',
    mounted () {
      var uiConfig = {
        signInSuccessUrl: '/',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
      }
      var ui = new firebaseui.auth.AuthUI(firebase.auth())
      ui.start('#firebaseui-auth-container', uiConfig)
    }
  }
</script>

<style scoped>
  /*.md-progress-bar {*/
    /*position: absolute;*/
    /*top: 0;*/
    /*right: 0;*/
    /*left: 0;*/
  /*}*/
</style>
