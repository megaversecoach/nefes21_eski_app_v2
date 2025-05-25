<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex p-jc-between">
          <h3>Today Starters</h3>
          <div>
            <Button
              class="p-mr-4"
              icon="pi pi-sliders-h"
              label="Edit"
              @click="changeEditState"
            />
            <Button
              :class="[editState ? 'p-button-success' : 'p-button-secondary']"
              icon="pi pi-check"
              label="Save & Publish"
              :disabled="!editState"
              @click="saveData"
            />
          </div>
        </div>

        <today-starter-item-list
          v-if="isContentsLoaded"
          :edit-state="editState"
          :layouts="starters"
          @addContent="addContentTapped"
          @deleteContent="deleteContentTapped"
        >
        </today-starter-item-list>
      </base-card>

      <Dialog
        header="Select content"
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
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import TodayStarterItemList from '../../components/TodayStarterItemList'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  data() {
    return {
      selectedContent: '',
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
  components: {
    TodayStarterItemList
  },
  computed: {
    ...mapGetters({
      publishedContents: 'content/publishedContents',
      starters: 'todays/starters'
    }),
    isContentsLoaded() {
      return this.publishedContents.length > 0
    }
  },
  methods: {
    ...mapActions({
      getStarters: 'todays/getTodayStarters',
      getContents: 'content/getContents'
    }),
    async saveData() {
      const result = await this.$store.dispatch('todays/saveStarters', {
        starters: this.starters
      })
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
        this.starters
      )
      this.displayModal = true
    },
    deleteContentTapped(data) {
      this.$store.dispatch('todays/deleteStarterItem', {
        content_id: data.content_id
      })
    },
    saveAndCloseModal() {
      this.v$.$touch()
      if (this.v$.$error) return
      else {
        this.$store.dispatch('todays/addContentToStarters', {
          content_id: this.selectedContent,
          language: this.$store.getters.getCurrentLanguage
        })
        this.displayModal = false
      }
    },
    discardAndCloseModal() {
      this.displayModal = false
    }
  },
  mounted() {
    this.getStarters()
    this.getContents({ state: 'publish' })
  }
}
</script>
