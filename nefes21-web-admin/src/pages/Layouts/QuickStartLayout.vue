<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex p-jc-between p-mb-4">
          <Dropdown
            v-model="selectedQsCategory"
            :options="qsCategories"
            :selection="selectedQsCategory"
            :disabled="editState"
            optionLabel="qs_category_label"
            optionValue="qs_category_id"
            placeholder="Select QuickStart Category..."
            scrollHeight="100"
          />
          <div class="p-d-flex">
            <Button
              v-if="selectedQsCategory && editState"
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
              :disabled="!selectedQsCategory"
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
        <quick-start-layout-item-list
          :edit-state="editState"
          :layouts="layoutObjects"
          :title="selectedQsCategoryLabel"
          @addContent="addContentTapped"
          @deleteContent="confirmDelete"
        >
        </quick-start-layout-item-list>
      </base-card>

      <Dialog
        :header="'Add Content to ' + selectedQsCategoryLabel + ' Category'"
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
import QuickStartLayoutItemList from '../../components/QuickStartLayoutItemList'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  data() {
    return {
      selectedContent: '',

      selectedQsCategoryLabel: '',
      selectedQsCategory: '',

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
    selectedQsCategory: {
      handler: function () {
        if (this.selectedQsCategory !== '') {
          this.selectedQsCategoryLabel = this.qsCategories.find(
            (qsCategoryItem) =>
              qsCategoryItem.qs_category_id === this.selectedQsCategory
          ).qs_category_label
          this.$store.dispatch('layouts/filterQsLayoutByQsCategory', {
            qs_category_id: this.selectedQsCategory
          })
        }
      }
    }
  },
  components: { QuickStartLayoutItemList },
  computed: {
    ...mapGetters({
      qsCategories: 'layouts/quickStartCategories'
    }),
    layoutObjects: function () {
      return this.$store.getters['layouts/filteredQuickStartLayouts']
    }
  },
  methods: {
    ...mapActions({
      getQuickStartCategories: 'layouts/getQuickStartCategories',
      getQuickStartLayouts: 'layouts/getQuickStartLayout',
      getContents: 'content/getContents'
    }),
    async saveData() {
      const result = await this.$store.dispatch(
        'layouts/saveQuickStartLayout',
        {
          data: this.layoutObjects,
          qs_category_id: this.selectedQsCategory
        }
      )
      if (result) {
        await this.getQuickStartLayouts()
        this.changeEditState()
      }
    },
    changeEditState() {
      this.editState = !this.editState
    },
    addContentTapped() {
      this.availableContents = this.$store.getters['content/findDifferences'](
        this.layoutObjects
      )
      this.displayModal = true
    },
    deleteContentTapped(data) {
      this.$store.dispatch('layouts/deleteContentFromQsLayout', {
        content_id: data.content_id,
        qs_category_id: this.selectedQsCategory
      })
    },
    saveAndCloseModal() {
      this.v$.$touch()
      if (this.v$.$error) return
      else {
        this.$store.dispatch('layouts/addContentToQsLayout', {
          content_id: this.selectedContent,
          language: this.$store.getters.getCurrentLanguage,
          qs_category_id: this.selectedQsCategory
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
    discardChanges() {
      this.editState = !this.editState

      this.$store.dispatch('layouts/filterQsLayoutByQsCategory', {
        qs_category_id: this.selectedQsCategory
      })

      // Düzeltilmeli !!

      this.$store.dispatch('layouts/reOrderQsLayout', {
        data: this.layoutObjects
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
    },
    confirmPublish(model) {
      this.$confirm.require({
        message: 'Are you sure you want to publish the new Quick-Start Layout?',
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
    }
  },
  created() {
    this.$store.dispatch('layouts/clearFilteredQuickstartLayout')
    this.selectedQsCategory = ''
    this.selectedQsCategoryLabel = ''
    this.getQuickStartCategories()
    this.getContents({ state: 'publish' })
    this.getQuickStartLayouts()
  }
}
</script>
<style scoped>
.p-dropdown {
  width: 20rem;
  font-weight: bold;
}
</style>
