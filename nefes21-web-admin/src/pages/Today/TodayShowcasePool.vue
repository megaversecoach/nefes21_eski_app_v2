<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card
        ><div class="p-d-flex p-jc-between">
          <Dropdown
            v-model="selectedDimensionId"
            :options="dimensions"
            :selection="selectedDimensionId"
            optionLabel="dimension_label"
            optionValue="dimension_id"
            placeholder="Select Dimension..."
          />
          <div class="p-d-flex">
            <Button
              v-if="selectedDimensionId"
              style="margin-right: 2rem"
              icon="pi pi-sliders-h"
              label="Edit"
              @click="changeEditState"
            />
            <Button
              v-else
              style="margin-right: 2rem"
              disabled
              icon="pi pi-sliders-h"
              label="Edit"
            />
            <Button v-if="editState" @click="saveData" class="p-button-success"
              >Save and Publish</Button
            >
            <Button v-else disabled class="p-button-secondary"
              >Save and Publish</Button
            >
          </div>
        </div>
        <h3>
          {{ selectedDimensionLabel }}
        </h3>
        <today-series-pool-list
          :edit-state="editState"
          :layouts="layoutObjects"
          :title="selectedDimensionLabel"
          @addContent="addContentTapped"
          @deleteContent="deleteContentTapped"
        >
        </today-series-pool-list>
      </base-card>

      <Dialog
        :header="selectedDimensionLabel"
        v-model:visible="displayModal"
        :style="{ width: '50vw' }"
        :modal="true"
      >
        <div>
          <p class="p-m-0">Contents</p>
          <Dropdown
            v-model="v$.selectedContent.$model"
            :class="{ 'p-invalid': v$.selectedContent.$error }"
            :options="availableContents"
            optionLabel="content_title"
            optionValue="content_id"
            placeholder="Select content"
          >
            <template #option="slotProps">
              <span
                >{{ slotProps.option.content_id }} -
                {{ slotProps.option.content_title }}</span
              >
            </template>
          </Dropdown>
          <small
            class="p-grid p-ml-2 p-mt-2 p-error"
            v-for="error of v$.selectedContent.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </small>
        </div>

        <template #footer>
          <Button
            label="Cancel"
            icon="pi pi-times"
            @click="discardAndCloseModal"
            class="p-button-text"
          />
          <Button
            label="Add Content"
            icon="pi pi-check"
            @click="saveAndCloseModal"
            autofocus
          />
        </template>
      </Dialog>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import TodaySeriesPoolList from '../../components/TodaySeriesPoolList'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  data() {
    return {
      selectedContent: '',
      selectedDimensionLabel: '',
      selectedDimensionId: '',

      availableContents: null,
      displayModal: false,
      editState: false
    }
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
      selectedContent: { required }
    }
  },
  watch: {
    selectedDimensionId: {
      handler: function () {
        if (this.selectedDimensionId !== '') {
          this.selectedDimensionLabel = this.dimensions.find(
            (item) => item.dimension_id === this.selectedDimensionId
          ).dimension_label
          this.$store.dispatch('todays/filterPersonalizedShowcasePool', {
            dimension_id: this.selectedDimensionId
          })
        }
      }
    }
  },
  components: { TodaySeriesPoolList },
  computed: {
    ...mapGetters({
      dimensions: 'layouts/dimensions'
    }),
    layoutObjects: function () {
      return this.$store.getters['todays/filteredPersonalizedShowcasePool']
    }
  },
  methods: {
    ...mapActions({
      getPersonalizedShowcasePool: 'todays/getPersonalizedShowcasePool',
      getDimensions: 'layouts/getDimensions',
      getContents: 'content/getContents'
    }),
    async saveData() {
      const result = await this.$store.dispatch(
        'todays/savePersonalizedShowcasePool',
        {
          data: this.layoutObjects,
          dimension_id: this.selectedDimensionId
        }
      )
      if (result) {
        this.changeEditState()
      }
    },
    changeEditState() {
      this.editState = !this.editState
    },
    addContentTapped() {
      this.v$.$reset()
      this.selectedContent = ''
      this.availableContents = this.$store.getters['content/findDifferences'](
        this.layoutObjects
      )
      this.displayModal = true
    },
    deleteContentTapped(data) {
      this.$store.dispatch('todays/deleteFromPersonalizedShowcasePool', {
        content_id: data.content_id,
        dimension_id: this.selectedDimensionId
      })
    },
    saveAndCloseModal() {
      this.v$.$touch()
      if (this.v$.$error) return
      else {
        this.$store.dispatch('todays/addContentToPersonalizedShowcasePool', {
          content_id: this.selectedContent,
          language: this.$store.getters.getCurrentLanguage,
          dimension_id: this.selectedDimensionId
        })
        this.displayModal = false
      }
    },
    discardAndCloseModal() {
      this.displayModal = false
    }
  },
  beforeRouteLeave() {
    this.$store.dispatch('todays/clearFilteredPersonalizedShowcasePool')
  },
  mounted() {
    this.getPersonalizedShowcasePool()
    this.getDimensions()
    this.getContents({ state: 'publish' })
  }
}
</script>
