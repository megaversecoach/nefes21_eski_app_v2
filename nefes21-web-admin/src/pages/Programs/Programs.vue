<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex">
          <Button
            class="align-right"
            icon="pi pi-plus-circle"
            label="Add Program"
            @click="addProgramRoute"
          />
        </div>
      </base-card>
      <program-list
        :programs="publishedPrograms.programs"
        :state="publishedPrograms.state"
        :title="publishedPrograms.title"
      ></program-list>
      <program-list
        :programs="draftedPrograms.programs"
        :state="draftedPrograms.state"
        :title="draftedPrograms.title"
      ></program-list>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import ProgramList from '@/components/ProgramList'
export default {
  components: { ProgramList },
  computed: {
    publishedPrograms() {
      return {
        title: 'Programs (Published)',
        programs: this.$store.getters['programs/publishedPrograms'],
        state: 'publish'
      }
    },
    draftedPrograms() {
      return {
        title: 'Programs (Draft)',
        programs: this.$store.getters['programs/draftedPrograms'],
        state: 'draft'
      }
    }
  },
  methods: {
    ...mapActions({
      getAuthors: 'authors/getAuthors',
      getPublishedPrograms: 'programs/getPublishedPrograms',
      getDraftedPrograms: 'programs/getDraftedPrograms'
    }),
    addProgramRoute() {
      this.$router.push({
        name: 'ProgramEdit',
        params: {
          state: 'new'
        }
      })
    }
  },
  created() {
    this.getAuthors({ state: 'publish' })
    this.getPublishedPrograms()
    this.getDraftedPrograms()
  }
}
</script>
