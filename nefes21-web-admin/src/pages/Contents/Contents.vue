<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex">
          <Button
            class="align-right"
            icon="pi pi-plus-circle"
            label="Add Content"
            @click="addContentRoute"
          />
        </div>
      </base-card>

      <content-list
        v-if="isPublishedContentsLoaded"
        :authors="authors"
        :content-types="contentTypes"
        :contents="publishedContents.contents"
        :state="publishedContents.state"
        :title="publishedContents.title"
      ></content-list>
      <content-list
        v-if="isDraftedContentsLoaded"
        :authors="authors"
        :content-types="contentTypes"
        :contents="draftedContents.contents"
        :state="draftedContents.state"
        :title="draftedContents.title"
      ></content-list>
    </div>
  </div>
</template>
<script>
import ContentList from '@/components/ContentList'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: { ContentList },
  computed: {
    ...mapGetters({
      authors: 'authors/getPublishedAuthors',
      contentTypes: 'content/contentTypes'
    }),
    isPublishedContentsLoaded() {
      const isAuthorLoaded = this.$store.getters[
        'authors/isPublishedAuthorsLoaded'
      ]
      const isPublishedLoaded = this.$store.getters[
        'content/isPublishedContentsLoaded'
      ]
      return isAuthorLoaded && isPublishedLoaded
    },
    isDraftedContentsLoaded() {
      const isAuthorLoaded = this.$store.getters[
        'authors/isPublishedAuthorsLoaded'
      ]
      const isDraftedContentLoaded = this.$store.getters[
        'content/isDraftedContentsLoaded'
      ]
      return isAuthorLoaded && isDraftedContentLoaded
    },
    publishedContents() {
      const data = this.$store.getters['content/publishedContents']
      return {
        title: 'Contents (Published)',
        contents: data,
        state: 'publish'
      }
    },
    draftedContents() {
      const data = this.$store.getters['content/draftedContents']
      return {
        title: 'Contents (Draft)',
        contents: data,
        state: 'draft'
      }
    }
  },
  methods: {
    ...mapActions({
      getAuthors: 'authors/getAuthors',
      getContents: 'content/getContents',
      getContentTypes: 'content/getContentTypes'
    }),
    addContentRoute() {
      this.$router.push({
        name: 'ContentEdit',
        params: {
          state: 'new'
        }
      })
    }
  },

  created() {
    this.getAuthors({ state: 'publish' })
    this.getContentTypes()

    this.getContents({ state: 'draft' })
    this.getContents({ state: 'publish' })
  }
}
</script>
