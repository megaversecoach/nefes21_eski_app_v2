<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card
        ><div class="p-d-flex p-jc-between">
          <Dropdown
            v-if="isLoaded"
            v-model="selectedDimension"
            :options="dimensions"
            :selection="selectedDimension"
            :disabled="editState"
            optionLabel="dimension_label"
            optionValue="dimension_id"
            placeholder="Select Dimension..."
            scrollHeight="100"
          />
          <div class="p-d-flex">
            <Button
              v-if="selectedDimension && editState"
              class="p-button-secondary p-mr-4"
              icon="pi pi-times"
              label="Discard"
              @click="confirmDiscard"
            />
            <Button
              v-else
              class="p-mr-4"
              icon="pi pi-sliders-h"
              label="Edit"
              :disabled="!selectedDimension"
              @click="changeEditState"
            />
            <Button
              :class="[editState ? 'p-button-success' : 'p-button-secondary']"
              icon="pi pi-check"
              label="Save & Publish"
              :disabled="!editState"
              @click="confirmPublish"
            />
          </div>
        </div>

        <dimension-layout-item-list
          :title="'Dimension Layout'"
          :layouts="layoutObjects"
          :showcase-types="showcaseTypes"
          :edit-state="editState"
          @addContent="addContentTapped"
          @deleteContent="confirmDelete"
        ></dimension-layout-item-list>
      </base-card>

      <Dialog
        :header="'Add Content to ' + selectedCategoryLabel"
        v-model:visible="displayModal"
        :style="{ width: '30rem' }"
        :modal="true"
        :closable="false"
        :closeOnEscape="false"
      >
        <div class="p-fluid p-grid">
          <div v-if="!isCategorySoundscape" class="p-field p-col-12 p-mb-0">
            <label class="dropdown-label">Content</label>
            <Dropdown
              v-model="v$.selectedContent.$model"
              :class="{ 'p-invalid': v$.selectedContent.$error }"
              :options="availableContents"
              optionLabel="content_title"
              optionValue="content_id"
              placeholder="Select Content..."
              @hide="v$.selectedContent.$touch()"
            >
              <template #option="slotProps">
                <span>
                  {{ slotProps.option.content_id }} -
                  {{ slotProps.option.content_title }}
                </span>
              </template>
            </Dropdown>
            <small
              class="p-error"
              v-for="error of v$.selectedContent.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </small>
          </div>

          <div v-if="isCategoryShowcase" class="p-field p-col-12">
            <label class="dropdown-label">Showcase Type</label>
            <Dropdown
              v-model="v$.selectedShowcaseTypeId.$model"
              :class="{ 'p-invalid': v$.selectedShowcaseTypeId.$error }"
              :options="showcaseTypes"
              optionLabel="showcase_label"
              optionValue="showcase_type_id"
              placeholder="Select Showcase Type..."
              @hide="v$.selectedShowcaseTypeId.$touch()"
            />

            <small
              class="p-error"
              v-for="error of v$.selectedShowcaseTypeId.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </small>
          </div>
          <div v-if="isCategorySoundscape" class="p-field p-col-12">
            <label class="dropdown-label">Soundscape</label>
            <Dropdown
              v-model="v$.selectedSoundscapeId.$model"
              :class="{ 'p-invalid': v$.selectedSoundscapeId.$error }"
              :options="availableSoundscapes"
              optionLabel="soundscape_title"
              optionValue="soundscape_id"
              placeholder="Select Soundscape..."
              @hide="v$.selectedSoundscapeId.$touch()"
            />
            <small
              class="p-error"
              v-for="error of v$.selectedSoundscapeId.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </small>
          </div>
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
  <ConfirmDialog :closable="false" :closeOnEscape="false" />
</template>
<script>
import DimensionLayoutItemList from '@/components/DimensionLayoutItemList'
import { requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      selectedSoundscapeId: '',
      selectedShowcaseTypeId: '',
      selectedContent: '',
      selectedCategoryId: '',
      selectedCategoryLabel: '',
      selectedDimension: '',

      availableContents: null,
      availableSoundscapes: null,
      displayModal: false,
      editState: false
    }
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
      selectedContent: {
        requiredIf: requiredIf(() => {
          return !this.isCategorySoundscape
        })
      },
      selectedSoundscapeId: {
        requiredIf: requiredIf(() => {
          return this.isCategorySoundscape
        })
      },
      selectedShowcaseTypeId: {
        requiredIf: requiredIf(() => {
          return this.isCategoryShowcase
        })
      }
    }
  },
  watch: {
    selectedDimension: {
      handler: function () {
        console.log('---')
        if (this.selectedDimension !== '') {
          this.$store.dispatch('layouts/filterDimensionLayoutByDimension', {
            dimensionId: this.selectedDimension
          })
        }
      }
    }
  },
  components: { DimensionLayoutItemList },
  computed: {
    ...mapGetters({
      dimensions: 'layouts/dimensions',
      soundscapes: 'soundScapes/getPublishedSoundscapes',
      showcaseTypes: 'layouts/showcaseTypes'
    }),
    isCategoryShowcase() {
      return this.selectedCategoryId === 'showcase'
    },
    isCategorySoundscape() {
      return (
        this.selectedCategoryId === 'sleep_soundscapes' ||
        this.selectedCategoryId === 'soundscapes'
      )
    },
    isLoaded() {
      const isDimensionsLoaded = this.$store.getters[
        'layouts/isDimensionsLoaded'
      ]
      const isDimensionLayoutsLoaded = this.$store.getters[
        'layouts/isDimensionLayoutLoaded'
      ]
      return isDimensionLayoutsLoaded && isDimensionsLoaded
    },
    layoutObjects: function () {
      return this.$store.getters['layouts/filteredDimensionLayouts']
    }
  },
  methods: {
    ...mapActions({
      getDimensions: 'layouts/getDimensions',
      getContents: 'content/getContents',
      getSoundscapes: 'soundScapes/getSoundScapes',
      getDimensionLayouts: 'layouts/getDimensionLayouts',
      getDimensionCategories: 'layouts/getDimensionCategories',
      getShowcaseTypes: 'layouts/getShowcaseTypes'
    }),
    async saveData() {
      this.$store.dispatch('changeUploadingState', { uploadingState: true })
      const data = this.$store.getters['layouts/filteredDimensionLayouts']
      const result = await this.$store.dispatch('layouts/saveDimensionLayout', {
        data: data,
        dimension_id: this.selectedDimension
      })
      if (result) {
        this.$store.dispatch('changeUploadingState', {
          uploadingState: false
        })
        this.changeEditState()
      }
    },
    changeEditState() {
      this.editState = !this.editState
    },
    confirmPublish(model) {
      this.$confirm.require({
        message: 'Are you sure you want to publish the new Dimension Layout?',
        header: 'Publish New Layout',
        icon: 'pi pi-check-circle',
        acceptLabel: 'Publish',
        rejectLabel: 'Cancel',
        accept: () => {
          this.saveData(model)
          this.$confirm.close()
        },
        reject: () => {
          this.$confirm.close()
        }
      })
    },
    addContentTapped(data) {
      this.v$.$touch()
      this.clearAddContentSelection()
      this.selectedCategoryLabel = data.category_label
      this.selectedCategoryId = data.category_id
      this.availableContents = this.$store.getters['content/findDifferences'](
        data.layoutItems
      )
      this.availableSoundscapes = this.$store.getters[
        'soundScapes/findDifferences'
      ](data.layoutItems)
      console.log(this.selectedCategoryId)
      this.displayModal = true
    },
    deleteContentTapped(data) {
      this.$store.dispatch('layouts/deleteContentFromDimensionLayout', {
        content_id: data.content_id,
        category_id: data.category_id,
        soundscape_id: data.soundscape_id,
        dimension_id: this.selectedDimension
      })
    },
    confirmDelete(model) {
      this.$confirm.require({
        message: 'Are you sure you want to remove the Content?',
        header: 'Remove Content from Layout',
        icon: 'pi pi-trash',
        acceptClass: 'p-button-danger',
        acceptLabel: 'Delete',
        rejectLabel: 'Cancel',
        accept: () => {
          this.deleteContentTapped(model)
          this.$confirm.close()
        },
        reject: () => {
          this.$confirm.close()
        }
      })
    },
    saveAndCloseModal() {
      this.v$.$touch()

      if (this.v$.$error) return
      else {
        this.$store.dispatch('layouts/addContentToDimensionLayout', {
          category_id: this.selectedCategoryId,
          content_id: this.selectedContent,
          dimension_id: this.selectedDimension,
          language: this.$store.getters.getCurrentLanguage,
          showcase_type_id: this.selectedShowcaseTypeId,
          soundscape_id: this.selectedSoundscapeId
        })
        this.displayModal = false
        this.v$.$reset()
      }
    },
    discardAndCloseModal() {
      this.v$.$reset()
      this.displayModal = false
    },
    confirmDiscard(model) {
      this.$confirm.require({
        message: 'Are you sure you want to discard all changes?',
        header: 'Discard Changes',
        icon: 'pi pi-trash',
        acceptClass: 'p-button-danger',
        acceptLabel: 'Discard',
        rejectLabel: 'Cancel',
        accept: () => {
          this.discardChanges(model)
          this.$confirm.close()
        },
        reject: () => {
          this.$confirm.close()
        }
      })
    },
    discardChanges() {
      this.selectedDimension = ''
      this.$store.dispatch('layouts/clearFilteredDimensionLayout')
      this.editState = !this.editState
      this.$store.dispatch('layouts/filterDimensionLayoutByDimension', {
        dimension_id: this.selectedDimension
      })
    },
    clearAddContentSelection() {
      this.selectedSoundscapeId = ''
      this.selectedShowcaseTypeId = ''
      this.selectedContent = ''
    }
  },
  beforeRouteLeave() {
    // this.$store.dispatch('layouts/clearFilteredDimensionLayout')
  },
  mounted() {
    this.$store.dispatch('layouts/clearFilteredDimensionLayout')
    this.selectedDimension = ''
    this.getDimensions()
    this.getShowcaseTypes()
    this.getContents({ state: 'publish' })
    this.getSoundscapes({ state: 'publish' })
    this.getDimensionLayouts()
    this.getDimensionCategories()
  }
}
</script>
<style scoped>
.p-dropdown {
  width: 20rem;
  font-weight: bold;
}
</style>
