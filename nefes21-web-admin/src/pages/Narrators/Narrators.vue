<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex">
          <Button
            class="align-right"
            icon="pi pi-plus-circle"
            label="Add Narrator"
            @click="addNarratorRoute"
          />
        </div>
      </base-card>
      <narrator-list
        :narrators="publishedNarrators.narrators"
        :title="publishedNarrators.title"
        :state="publishedNarrators.state"
      >
      </narrator-list>
      <narrator-list
        v-if="draftedNarrators.narrators.length > 0"
        :narrators="draftedNarrators.narrators"
        :title="draftedNarrators.title"
        :state="draftedNarrators.state"
      >
      </narrator-list>
    </div>
  </div>
</template>

<script>
import NarratorList from '../../components/NarratorList'
import { mapActions } from 'vuex'

export default {
  components: {
    NarratorList
  },
  computed: {
    publishedNarrators() {
      const narrators = this.$store.getters['narrators/getPublishedNarrators']
      return {
        title: 'Narrators (Published)',
        narrators: narrators,
        state: 'publish'
      }
    },
    draftedNarrators() {
      const narrators = this.$store.getters['narrators/getDraftedNarrators']
      return {
        title: 'Narrators (Drafted)',
        narrators: narrators,
        state: 'draft'
      }
    }
  },
  methods: {
    ...mapActions({
      getNarrators: 'narrators/getNarrators'
    }),
    addNarratorRoute() {
      this.$router.push({
        name: 'NarratorEdit',
        params: {
          state: 'new'
        }
      })
    }
  },
  mounted() {
    this.getNarrators({ state: 'draft' })
    this.getNarrators({ state: 'publish' })
  }
}
</script>
<style scoped>
.align-right {
  margin-left: auto;
  margin-right: 0;
}
</style>
