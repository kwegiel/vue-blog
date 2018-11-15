<template>
    <b-modal size="lg" :id="id" :title="title" hide-footer>
        <div class="my-4" v-html="body"></div>
    </b-modal>
</template>
<script>
export default {
    props: ['body', 'title', 'id'],
    name: "Modal"
};
</script>
