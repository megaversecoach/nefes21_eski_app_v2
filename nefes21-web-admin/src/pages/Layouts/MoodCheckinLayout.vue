<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex p-jc-between p-mb-4">
          <Dropdown
            v-model="selectedMoodId"
            :options="moods"
            :selection="selectedMoodId"
            :disabled="editState"
            optionLabel="mood_label"
            optionValue="mood_id"
            placeholder="Select Mood..."
            scrollHeight="100"
          />
          <div class="p-d-flex">
            <Button
              v-if="selectedMoodId && editState"
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
              :disabled="!selectedMoodId"
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

        <mood-check-in-layout-item-list
          :edit-state="editState"
          :layouts="layoutObjects"
          :title="selectedMoodLabel"
          @addContent="addContentTapped"
          @deleteContent="confirmDelete"
        >
        </mood-check-in-layout-item-list>
      </base-card>

      <Dialog
        :header="'Add Content to ' + selectedMoodLabel + ' Mood'"
        v-model:visible="displayModal"
        :style="{ width: '30rem' }"
        :closable="false"
        :closeOnEscape="false"
        :modal="true"
      >
        <div class="p-mb-4">
          <Dropdown
            v-model="v$.selectedContent.$model"
            :class="{ 'p-invalid': v$.selectedContent.$error }"
            :options="availableContents"
            optionLabel="content_title"
            optionValue="content_id"
            placeholder="Select a Content..."
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
  <ConfirmDialog :closable="false" :closeOnEscape="false" />
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import MoodCheckInLayoutItemList from '../../components/MoodCheckInLayoutItemList'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
export default {
  data() {
    return {
      selectedContent: '',

      selectedMoodLabel: '',
      selectedMoodId: '',

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
    selectedMoodId: {
      handler: function () {
        if (this.selectedMoodId !== '') {
          this.selectedMoodLabel = this.moods.find(
            (moodItem) => moodItem.mood_id === this.selectedMoodId
          ).mood_label
          this.$store.dispatch('layouts/filterMoodLayoutByMood', {
            mood_id: this.selectedMoodId
          })
        }
      }
    }
  },
  components: { MoodCheckInLayoutItemList },
  computed: {
    ...mapGetters({
      moods: 'layouts/moods'
    }),
    layoutObjects: function () {
      return this.$store.getters['layouts/filteredMoodLayouts']
    }
  },
  methods: {
    ...mapActions({
      getMoodLayouts: 'layouts/getMoodLayouts',
      getContents: 'content/getContents'
    }),
    async saveData() {
      const result = await this.$store.dispatch('layouts/saveMoodLayout', {
        data: this.layoutObjects,
        mood_id: this.selectedMoodId
      })
      if (result) {
        await this.getMoodLayouts()
        this.changeEditState()
      }
    },
    changeEditState() {
      this.editState = !this.editState
    },
    discardChanges() {
      this.editState = !this.editState
      this.$store.dispatch('layouts/filterMoodLayoutByMood', {
        mood_id: this.selectedMoodId
      })
    },
    addContentTapped() {
      this.availableContents = this.$store.getters['content/findDifferences'](
        this.layoutObjects
      )
      this.displayModal = true
    },
    deleteContentTapped(data) {
      this.$store.dispatch('layouts/deleteContentFromMoodLayout', {
        content_id: data.content_id,
        mood_id: this.selectedMoodId
      })
    },
    saveAndCloseModal() {
      this.v$.$touch()
      if (this.v$.$error) return
      else {
        this.$store.dispatch('layouts/addContentToMoodLayout', {
          content_id: this.selectedContent,
          language: this.$store.getters.getCurrentLanguage,
          mood_id: this.selectedMoodId
        })
        this.selectedContent = ''
        this.v$.$reset()
        this.displayModal = false
      }
    },
    discardAndCloseModal() {
      this.selectedContent = ''
      this.v$.$reset()
      this.displayModal = false
    },
    confirmPublish(model) {
      this.$confirm.require({
        message:
          'Are you sure you want to publish the new Mood Checkin Layout?',
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
    }
  },
  beforeRouteLeave() {
    // this.$store.dispatch('layouts/clearFilteredMoodLayout')
  },
  created() {
    this.$store.dispatch('layouts/clearFilteredMoodLayout')
    this.selectedMoodLabel = ''
    this.selectedMoodId = ''
    this.getContents({ state: 'publish' })
    this.getMoodLayouts()
  }
}
</script>
<style scoped>
.p-dropdown {
  width: 20rem;
  font-weight: bold;
}
</style>
