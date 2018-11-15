<template>
  <b-container>
    <div class="signin-form">
      <h3>Sign Up</h3>
      <hr>
      <b-form @submit="onSubmit" @reset="onReset">
        <b-form-group id="emailgroup" label="E-mail:" label-for="email" description="Your e-mail">
          <b-form-input id="email" type="email" v-model="form.email" required placeholder="Enter email">
          </b-form-input>
        </b-form-group>
        <b-form-group id="passwordgroup" label="Password:" label-for="password">
          <b-form-input id="password" type="password" v-model="form.password" required placeholder="Enter password">
          </b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </div>
  </b-container>
</template>
<script>

export default {
  data() {
    return {
      form: {
        password: "",
        email: ""
      }
    };
  },
  props: {
    path: {
      type: String,
      default: "/signup"
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();    
      this.$store.dispatch('signup', this.form);
    },
    onReset(evt) {
      evt.preventDefault();
      this.form.password = "";
      this.form.email = "";
    }
  }
};
</script>
