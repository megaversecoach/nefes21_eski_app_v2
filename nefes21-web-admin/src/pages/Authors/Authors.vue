<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex">
          <Button
            class="align-right"
            icon="pi pi-plus-circle"
            label="Add Author"
            @click="addAuthorRoute"
          />
        </div>
      </base-card>
      <author-list
        :authors="publishedAuthors.authors"
        :state="publishedAuthors.state"
        :title="publishedAuthors.title"
      ></author-list>
      <author-list
        v-if="draftedAuthors.authors.length > 0"
        :authors="draftedAuthors.authors"
        :state="draftedAuthors.state"
        :title="draftedAuthors.title"
      >
      </author-list>
    </div>
  </div>
</template>

<script>
import AuthorList from '../../components/AuthorList.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    AuthorList
  },
  computed: {
    publishedAuthors() {
      const authors = this.$store.getters['authors/getPublishedAuthors']
      return {
        title: 'Authors (Published)',
        authors: authors,
        state: 'publish'
      }
    },
    draftedAuthors() {
      const authors = this.$store.getters['authors/getDraftedAuthors']
      return {
        title: 'Authors (Drafted)',
        authors: authors,
        state: 'draft'
      }
    }
  },
  methods: {
    ...mapActions({
      getAuthors: 'authors/getAuthors'
    }),

    addAuthorRoute() {
      this.$router.push({
        name: 'AuthorEdit',
        params: {
          state: 'new'
        }
      })
    }
  },
  created() {
    this.getAuthors({ state: 'draft' })
    this.getAuthors({ state: 'publish' })
  }
}
</script>
<style scoped></style>
