<template>
  <b-navbar toggleable="md" type="dark" variant="info">
    <b-container>
      <router-link class="navbar-brand" to="/">VueBlog</router-link>
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <router-link class="nav-link" exact active-class="active" to="/">Home</router-link>
          <router-link v-if="!loggedin" class="nav-link" active-class="active" to="/signin">Sign In</router-link>
          <router-link v-if="!loggedin" class="nav-link" active-class="active" to="/signup">Sign Up</router-link>
          <b-nav-item v-if="loggedin" @click="onSignOut">Log Out</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Navbar",
  mounted() {
    this.$store.dispatch("tryAutoLogin");
  },
  computed: {
    ...mapState(["loggedin"])
  },
  methods: {
    onSignOut() {
      this.$store.dispatch('tryLogout');
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
nav {
  margin-bottom: 30px;
}
</style>
