<template>
  <b-card :title="title" tag="article" class="portfolio-item fade-in" :img-src="image" :img-alt="title" img-top>
    <div class="card-info">
      <small>Added {{ date }} by {{ author }}</small>
    </div>
    <p class="card-text">
      {{ body.substring(0,150) + '...' }}
    </p>
    <b-button v-b-modal="id">Read more</b-button>
    <span class="card-options" v-if="loggedin">
      <b-button @click="edit = !edit" variant="primary">Edit</b-button>
      <b-button @click="deleteConfirm = !deleteConfirm" variant="danger">Delete</b-button>
    </span>
    <div class="edit-form" v-if="edit">
      <b-form @submit="onEdit" @reset="onReset">
        <b-form-group id="titlegroup" label="Date:" label-for="title" description="Write title of blog post">
          <b-form-input id="title" type="text" v-model="blogItem.editTitle" required placeholder="Enter title">
          </b-form-input>
        </b-form-group>
        <b-form-group id="dategroup" label="Date:" label-for="date">
          <b-form-input id="date" type="date" v-model="blogItem.editDate" required placeholder="Enter date">
          </b-form-input>
        </b-form-group>
        <b-form-group id="bodygroup" label="Text:" label-for="body">
          <b-form-textarea id="body" v-model="blogItem.editBody" required rows="3" placeholder="Enter text">
          </b-form-textarea>
        </b-form-group>
        <div class="form-options">
          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </div>
      </b-form>
    </div>
    <div v-if="deleteConfirm">
      <b-modal v-model="deleteConfirm" title="Are you sure?" hide-footer>
        <h4>Delete</h4>
        <p>{{ title }}</p>
        <div class="form-options">
          <b-button @click="deleteConfirm = false">Cancel</b-button>
          <b-button @click="onDelete" variant="danger">Delete</b-button>
        </div>
      </b-modal>
    </div>
  </b-card>
</template>
<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      edit: false,
      deleteConfirm: false,
      blogItem: {
        editTitle: this.title,
        editBody: this.body,
        editDate: this.date,
        editAuthor: this.author,
        editImage: this.image,
        editId: this.id
      }
    };
  },
  props: ["title", "body", "id", "date", "author", "image"],
  name: "Card",
  methods: {
    onDelete() {
      this.deleteConfirm = false;
      this.$store.dispatch("onDelete", this.id);
    },
    onEdit(evt) {
      evt.preventDefault();      
      this.$store.dispatch("onEdit", this.blogItem);
      this.edit = false;
    },
    onReset(evt) {
      evt.preventDefault();
      this.blogItem.editTitle = this.title;
      this.blogItem.editBody = this.body;
      this.blogItem.editDate = this.date;
    }
  },
  computed: {
    ...mapState(["loggedin"])
  },
};
</script>
<style>
.card-info {
  color: #ccc;
  font-style: italic;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

.portfolio-item {
  margin-bottom: 30px;
}

.portfolio-item--tag {
  color: grey;
  opacity: 1;
  transition: opacity 0.3s ease;
  margin: 0 0 20px;
  cursor: pointer;
  display: inline-block;
}

.portfolio-item--tag:hover {
  opacity: 0.5;
}

.edit-form {
  position: absolute;
  top: calc(100% - 10px);
  left: 0;
  width: 100%;
  padding: 20px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.3);
  z-index: 400;
  background: white;
}

.card-options button {
  margin-left: 10px;
}

.form-options button {
  margin-right: 10px;
}

.form-options button:last-child {
  margin-right: 0;
}
</style>

