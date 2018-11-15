<template>
  <div class="home">
    <b-container>
      <b-row>
        <b-col>
          <h1>Blog</h1>
        </b-col>
        <b-col v-if="loggedin" class="add-form--wrapper">
          <b-button v-if="!add" @click="showForm" class="float-right" variant="primary">Add item</b-button>
          <b-button v-if="add" @click="hideForm" class="float-right" variant="danger">Cancel</b-button>
          <div class="add-form" v-if="add">
            <b-form @submit="onSubmit" @reset="onReset">
              <b-form-group id="titlegroup" label="Title:" label-for="title" description="Write title of blog post">
                <b-form-input id="title" type="text" v-model="form.title" required placeholder="Enter title">
                </b-form-input>
              </b-form-group>
              <b-form-group id="dategroup" label="Date:" label-for="date">
                <b-form-input id="date" type="date" v-model="form.date" required placeholder="Enter date">
                </b-form-input>
              </b-form-group>
              <b-form-group id="filegroup" label="Image:" label-for="file">
                <b-form-file v-model="file" id="file" :state="Boolean(file)" placeholder="Choose an image..." @change="onFilePicked" accept="image/*"></b-form-file>
                <div><img :src="imageUrl" height="150" class="img-preview"></div>
              </b-form-group>
              <b-form-group id="bodygroup" label="Text:" label-for="body">
                <b-form-textarea id="body" v-model="form.body" required rows="3" placeholder="Enter text">
                </b-form-textarea>
              </b-form-group>
              <b-button type="submit" variant="primary">Submit</b-button>
              <b-button type="reset" variant="danger">Reset</b-button>
            </b-form>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <div v-if="loading" class="loading">
          <app-spinner />
        </div>
        <b-col v-else sm="4" v-for="item in orderedBlog" :key="item.id">
          <app-card :title="item.title" :body="item.body" :id="item.id" :date="item.date" :author="item.user" @onDelete="onDelete(item.id)" :image="item.image" />
          <app-modal :title="item.title" :id="item.id" :body="item.body" />
        </b-col>
      </b-row>
    </b-container>
    <b-modal size="sm" ref="confirmModal" :title="modalTitle" hide-footer>
      <div class="my-4">{{ modalBody }}</div>
    </b-modal>
    <div v-if="error">
      <b-modal v-model="showError" title="Error..." hide-footer>
        <h4>Something went wrong</h4> {{ error }}</b-modal>
    </div>
    <div v-if="showInfoComputed">
      <b-modal v-model="showInfoComputed" :title="modalInfo.title" hide-footer>
        <div v-if="modalInfo.body">
          {{ modalInfo.body }}
        </div>
        <div v-else>
          <h4>Please wait...</h4>
          <app-spinner />
        </div>
      </b-modal>
    </div>
    <div v-if="addError">
      <b-modal v-model="showError" title="Error..." hide-footer>
        <h4>Something went wrong</h4> {{ addError }}</b-modal>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from "vuex";
import Spinner from "@/components/Spinner.vue";
import Card from "@/components/Card.vue";
import Modal from "@/components/Modal.vue";
import _ from "lodash";

export default {
  data() {
    return {
      add: false,
      addError: null,
      file: null,
      imageUrl: "",
      form: {
        title: "",
        date: "",
        body: "",
        image: null,
        user: "Admin"
      },
      modalTitle: "",
      modalBody: "",
      showError: true
    };
  },
  name: "home",
  components: {
    appSpinner: Spinner,
    appCard: Card,
    appModal: Modal
  },
  mounted() {
    if (this.$store.state.loading) {
      this.$store.dispatch("fetchBlogPosts");
    }
  },
  computed: {
    ...mapState(["blog", "error", "loading", "errorShow", "loggedin", "showInfo", "modalInfo"]),
    orderedBlog: function() {
      return _.orderBy(this.blog, "date", "desc");
    },
    showInfoComputed: {
      set(showInfo) {
        this.$store.commit("SET_SHOWINFO", showInfo);
      },
      get() {
        return this.showInfo;
      }
    }
  },
  methods: {
    showForm() {
      this.add = true;
      this.form.title = "";
      this.form.date = "";
      this.form.body = "";
    },
    hideForm() {
      this.add = false;
    },
    onSubmit(evt) {
      evt.preventDefault();
      if (this.file) {
        this.form.image = this.file;
      }
      this.$store.dispatch("onSubmit", this.form);
      this.add = false;
      this.file = null;
    },
    onReset(evt) {
      evt.preventDefault();
      /* Reset our form values */
      this.form.title = "";
      this.form.date = "";
      this.form.body = "";
      this.file = null;
      this.imageUrl = "";
      this.add = false;
      this.$nextTick(() => {
        this.add = true;
      });
    },
    onFilePicked(event) {
      const files = event.target.files
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Please add a valid file!')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.file = files[0]      
    }
  }
};
</script>
<style>
.add-form--wrapper {
  position: relative;
}

.add-form {
  position: absolute;
  top: 100%;
  left: 15px;
  width: calc(100% - 30px);
  padding: 20px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.3);
  z-index: 400;
  background: white;
}

.loading {
  text-align: center;
  margin: auto;
}

.img-preview {
  margin-top: 10px;
}
</style>
