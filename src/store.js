import Vue from 'vue'
import Vuex from 'vuex'
import axios from "./axios"
import VueAxios from 'vue-axios'
import router from './router'

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";

var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};
firebase.initializeApp(config);

Vue.use(Vuex)
Vue.use(VueAxios, axios)

export default new Vuex.Store({
  state: {
    blog: [],
    loading: true,
    error: null,
    errorShow: false,
    showInfo: false,
    loggedin: null,
    modalInfo: {
      title: "",
      body: ""
    }
  },
  actions: {
    fetchBlogPosts({ commit }) {
      axios
        .get('/blog.json')
        .then(res => {
          const data = res.data;
          const blogs = [];
          for (let key in data) {
            const blog = data[key];
            blog.id = key;
            blogs.push(blog);
          }
          return blogs;
        })
        .then(blog => {
          commit('FETCH_BLOG', blog);
          commit('SET_LOADING', false);
        })
        .catch(error => {
          commit('FETCH_FAILED', error);
        })
    },
    signup({ commit, dispatch }, authData) {

      firebase
        .auth()
        .createUserWithEmailAndPassword(authData.email, authData.password)
        .catch(function (error) {
          commit('FETCH_FAILED', error);
        });
      dispatch('tryAutoLogin')
    },
    signin({ commit, dispatch }, authData) {
      firebase
        .auth()
        .signInWithEmailAndPassword(authData.email, authData.password)
        .catch(function (error) {
          commit('FETCH_FAILED', error);
        });
      dispatch('tryAutoLogin')
    },
    tryAutoLogin({ commit }) {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {                    
          firebase
            .auth()
            .currentUser.getIdToken(/* forceRefresh */ true)
            .then(function (idToken) {
              commit('LOG_IN', idToken);
            })
            .catch(function (error) {
              commit('FETCH_FAILED', error);
            });
          router.push('/');
        }
      });
    },

    tryLogout({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(function () {
          router.push('/');
        })
        .catch(function (error) {
          commit('FETCH_FAILED', error);
        });
      commit('LOG_IN', null);
    },
    onSubmit({ commit, dispatch, state }, formData) {
      let form = {
        title: formData.title,
        date: formData.date,
        body: formData.body,
        user: formData.user
      }
      let key;      
      axios
        .post('/blog.json' + '?auth=' + state.loggedin, formData)
        .then(res => {
          key = res.data.name;
          commit('SET_SHOWINFO', true);  
          commit('SET_MODALINFO', { title: "Uploading image.." });       
          return key;
        })
        .then(key => {
          const filename = formData.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          return firebase.storage().ref('blogs/' + key + ext).put(formData.image)
        })
        .then(uploadTaskSnapshot => {
          return uploadTaskSnapshot.ref.getDownloadURL()
        })
        .then(imageUrl => {         
          axios.put("/blog/" + key + ".json" + "?auth=" + state.loggedin, { ...form, image: imageUrl })
            .then(() => {
              commit('SET_SHOWINFO', false);
              dispatch("fetchBlogPosts");
            })
            .catch(error => {
              commit('FETCH_FAILED', error);
            });
        })
        .catch(error => {
          commit('FETCH_FAILED', error);
        });
    },
    onEdit({ commit, dispatch, state }, blogItem) {
      axios
        .put("/blog/" + blogItem.editId + ".json" + "?auth=" + state.loggedin, { body: blogItem.editBody, date: blogItem.editDate, title: blogItem.editTitle, image: blogItem.editImage, user: blogItem.editAuthor })
        .then(() => {
          commit('SET_SHOWINFO', true);
          commit('SET_MODALINFO', { title: "Edit", body: "Your post was saved." });
          dispatch("fetchBlogPosts");
        })
        .catch(error => {
          commit('FETCH_FAILED', error);
        });
    },
    onDelete({ commit, dispatch, state }, id) {
      axios
        .delete("/blog/" + id + ".json" + "?auth=" + state.loggedin)
        .then(() => {
          dispatch("fetchBlogPosts");
          commit('SET_SHOWINFO', true);
          commit('SET_MODALINFO', { title: "Delete", body: "Selected post was deleted." });
        })
        .catch(error => {
          commit('FETCH_FAILED', error);
        });
    }
  },
  mutations: {
    FETCH_BLOG(state, blog) {
      state.blog = blog
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_SHOWINFO(state, show) {
      state.showInfo = show
    },
    SET_MODALINFO(state, modal) {
      state.modalInfo = modal
    },
    FETCH_FAILED(state, error) {
      state.errorShow = true;
      state.error = error.toString()
    },
    LOG_IN(state, loggedin) {
      state.loggedin = loggedin;
    },
  }
});
