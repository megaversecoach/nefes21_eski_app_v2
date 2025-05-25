<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card id="base-card">
        <Button class="p-button-danger" @click="addShowcaseItemTapped">
          Add Showcase Item
        </Button>
      </base-card>
      <base-card>
        <today-non-personalized-showcase-list
          :pool="nonPersonalizedShowcasePool"
        >
        </today-non-personalized-showcase-list>
      </base-card>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import TodayNonPersonalizedShowcaseList from '../../components/TodayNonPersonalizedShowcaseList'

export default {
  components: { TodayNonPersonalizedShowcaseList },
  computed: {
    ...mapGetters({
      nonPersonalizedShowcasePool: 'todays/nonPersonalizedShowcases'
    })
  },
  methods: {
    ...mapActions({
      getNonPersonalizedShowcasePool: 'todays/getNonPersonalizedShowcasePool'
    }),
    addShowcaseItemTapped() {
      this.$router.push({
        name: 'TodayShowcaseNewItem',
        params: {
          state: 'new'
        }
      })
    }
  },
  mounted() {
    this.getNonPersonalizedShowcasePool()
  }
}
</script>
