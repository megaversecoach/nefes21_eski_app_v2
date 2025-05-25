<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex p-jc-between p-mb-4">
          <Dropdown
            v-model="selectedDimension"
            :options="dimensions"
            :selection="selectedDimension"
            optionLabel="dimension_label"
            optionValue="dimension_id"
            placeholder="Select Dimension..."
            :disabled="editState"
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
      </base-card>
      <base-card>
        <category-list
          :edit-state="editState"
          :categories="filteredCategories"
          @addCategory="addCategory"
          @deleteCategory="deleteCategory"
          @editCategory="editCategory"
        >
        </category-list>
      </base-card>
    </div>
  </div>
  <Dialog
    header="Category Detail"
    :style="{ width: '50vw' }"
    :modal="true"
    :closable="false"
    :closeOnEscape="false"
    v-model:visible="displayModal"
  >
    <div class="p-fluid p-grid">
      <div class="p-col-12">
        <div class="p-field">
          <span class="p-float-label">
            <InputText
              class="disabled-input"
              v-model="model.category_id"
              disabled
            />
            <label>Category Id</label>
          </span>
        </div>
      </div>
      <div class="p-col-12">
        <div class="p-field">
          <span class="p-float-label">
            <InputText
              v-model="v$.model.category_label.$model"
              :class="{ 'p-invalid': v$.model.category_label.$error }"
              @blur="v$.model.category_label.$touch()"
            />
            <label>Category Label</label>
          </span>
          <small
            class="p-error"
            v-for="error of v$.model.category_label.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </small>
        </div>
      </div>
      <div class="p-col-12">
        <div class="p-field">
          <span class="p-float-label">
            <InputText
              v-model="v$.model.category_description.$model"
              :class="{ 'p-invalid': v$.model.category_description.$error }"
              @blur="v$.model.category_description.$touch()"
            />
            <label>Category Description</label>
          </span>
          <small
            class="p-error"
            v-for="error of v$.model.category_description.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </small>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        class="p-button-secondary"
        label="Discard"
        @click="discardAndCloseModal"
      ></Button>
      <Button
        :label="dialogState === 'new' ? 'Add' : 'Update'"
        @click="saveAndCloseModal"
      ></Button>
    </template>
  </Dialog>
  <ConfirmDialog :closable="false" :closeOnEscape="false" />
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { maxLength, minLength, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import CategoryList from '../../components/CategoryList'
export default {
  components: { CategoryList },
  data() {
    return {
      selectedDimension: '',
      displayModal: false,
      editState: false,
      dialogState: '',
      model: {
        category_description: '',
        category_id: '',
        category_label: '',
        dimension_id: '',
        orderInDimension: 0
      }
    }
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
      model: {
        category_description: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(25)
        },
        category_label: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(25)
        },
        dimension_id: { required },
        orderInDimension: { required }
      }
    }
  },
  watch: {
    selectedDimension: {
      handler: function () {
        if (this.selectedDimension !== '') {
          this.$store.dispatch('layouts/filterDimensionCategories', {
            dimension_id: this.selectedDimension
          })
        }
      }
    }
  },

  computed: {
    ...mapGetters({
      dimensions: 'layouts/dimensions',
      filteredCategories: 'layouts/filteredDimensionCategories'
    })
  },
  methods: {
    ...mapActions({
      getDimensions: 'layouts/getDimensions',
      getDimensionCategories: 'layouts/getDimensionCategories',
      addCategoryToFilteredCategories: 'layouts/addCategoryToFilteredCategory',
      updateCategory: 'layouts/updateCategory'
    }),
    async saveData() {
      const result = await this.$store.dispatch(
        'layouts/saveDimensionCategories',
        {
          data: this.filteredCategories,
          dimension_id: this.selectedDimension
        }
      )
      if (result) {
        this.changeEditState()
      }
    },
    changeEditState() {
      const isValid =
        this.selectedDimension !== 'sleep' && this.selectedDimension !== 'music'
      if (isValid) this.editState = !this.editState
      else {
        this.$confirm.require({
          message: 'You can not edit this dimension categories',
          header: 'Edit Issue',
          icon: 'pi pi-info-circle',
          acceptClass: 'p-button-danger',
          acceptLabel: 'OK',
          rejectLabel: 'Back',
          accept: () => {
            this.$confirm.close()
          },
          reject: () => {
            this.$confirm.close()
          }
        })
      }
    },
    discardChanges() {
      this.editState = !this.editState
      this.$store.dispatch('layouts/filterDimensionCategories', {
        dimension_id: this.selectedDimension
      })
    },
    addCategory() {
      this.v$.model.$reset()
      this.model.category_description = ''
      this.model.category_id = ''
      this.model.category_label = ''
      this.dialogState = 'new'
      this.model.dimension_id = this.selectedDimension
      this.model.orderInDimension = this.filteredCategories.length + 1
      this.displayModal = true
    },
    deleteCategory(data) {
      this.$store.dispatch('layouts/deleteCategoryFromFilteredCategories', {
        category_id: data.category_id
      })
    },
    editCategory(data) {
      this.dialogState = 'edit'
      this.configureCategory(data)
      this.displayModal = true
    },
    configureCategory(data) {
      this.model.category_id = data.category_id
      this.model.category_description = data.category_description
      this.model.category_label = data.category_label
      this.model.dimension_id = data.dimension_id
      this.model.orderInDimension = data.orderInDimension
    },
    saveAndCloseModal() {
      this.v$.$touch()
      if (this.v$.$error) return
      else {
        if (this.dialogState === 'new') {
          this.addCategoryToFilteredCategories({
            language: this.$store.getters.getCurrentLanguage,
            data: this.model
          })
        } else {
          this.updateCategory({
            language: this.$store.getters.getCurrentLanguage,
            data: this.model
          })
        }
        this.v$.$reset()
        this.displayModal = false
      }
    },
    discardAndCloseModal() {
      this.displayModal = false
    },
    confirmPublish(model) {
      this.$confirm.require({
        message: 'Are you sure you want to publish the new Categories?',
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
  created() {
    this.$store.dispatch('layouts/clearFilteredDimensionCategories')
    this.selectedDimension = ''
    this.getDimensions()
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
