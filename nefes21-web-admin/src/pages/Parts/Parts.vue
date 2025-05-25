<template>
  <part-list
    :section-items="sectionItems"
    title="Part List"
    :state="state"
    :program-id="programId"
    @delete-part="partDeleted"
  ></part-list>
</template>
<script>
import PartList from '@/components/PartList'
import { mapGetters, mapActions } from 'vuex'
export default {
  props: ['programId', 'state'],
  components: { PartList },
  data() {
    return {
      programData: {},
      sectionItems: []
    }
  },
  computed: {
    ...mapGetters({
      getDraftedProgramByProgramId: 'programs/getDraftedProgramById',
      getPublishedProgramByProgramId: 'programs/getPublishedProgramById',
      draftedPartsByProgramId: 'parts/draftedParts',
      publishedPartsByProgramId: 'parts/publishedParts'
    }),
    parts() {
      if (this.isStatePublished) {
        return this.publishedPartsByProgramId
      } else {
        return this.draftedPartsByProgramId
      }
    },
    isStatePublished() {
      return this.state === 'publish'
    }
  },
  methods: {
    ...mapActions({
      getPublishedPartsByProgramId: 'parts/getPublishedPartsByProgramId',
      getDraftedPartsByProgramId: 'parts/getDraftedPartsByProgramId',
      getSoundscapes: 'soundScapes/getSoundScapes'
    }),
    partDeleted() {
      this.initSectionItems()
    },
    initSectionItems() {
      this.sectionItems = []
      const sections = this.programData.program_sections.sort(
        (a, b) => a.order - b.order
      )
      console.log('Sections: ', sections)
      sections.forEach((section) => {
        const sectionData = {}
        sectionData.section_id = section.section_id
        sectionData.section_title = section.section_title
        const sectionParts = this.parts.filter(
          (part) => part.section_id === section.section_id
        )
        sectionParts.sort((a, b) => a.orderInSection - b.orderInSection)
        sectionData.parts = sectionParts
        console.log('SectionData: ', sectionData)
        this.sectionItems.push(sectionData)
      })
    }
  },
  async created() {
    await this.getSoundscapes({ state: 'publish' })
    await this.getPublishedPartsByProgramId({ program_id: this.programId })
    await this.getDraftedPartsByProgramId({ program_id: this.programId })
    if (this.isStatePublished) {
      this.programData = this.getPublishedProgramByProgramId(this.programId)
    } else {
      this.programData = this.getDraftedProgramByProgramId(this.programId)
    }
    this.initSectionItems()
    console.log('SectionItems', this.sectionItems)
  }
}
</script>
