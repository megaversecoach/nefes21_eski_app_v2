<template>
  <DataTable
    :value="categories"
    class="p-datatable-gridlines"
    responsiveLayout="scroll"
    showGridlines
    @rowReorder="onRowReorder"
  >
    <template #header>
      <div class="p-d-flex p-jc-between">
        <div class="p-d-flex">
          <h3>Categories</h3>
          <h3 v-if="categories">: {{ title }}</h3>
        </div>
        <Button
          v-if="editState"
          icon="pi pi-plus-circle"
          label="Add New Category"
          style="margin-bottom: 12px; margin-top: 12px"
          @click="addNewCategoryTapped"
        />
      </div>
    </template>
    <template #empty>
      <h4>Select Dimension to Edit...</h4>
    </template>
    <template #loading> Loading ...</template>
    <Column
      bodyStyle="text-align: center;"
      field="orderInDimension"
      header="#"
      headerStyle="text-align: center;"
    />
    <Column
      :reorderableColumn="false"
      :rowReorder="editState"
      :style="{
        display: editState ? '' : 'none'
      }"
      headerStyle="width: 3rem"
    />
    <Column field="category_id" header="Category ID" />
    <Column field="category_label" header="Category Label" />
    <Column field="category_description" header="Category Description" />
    <Column
      :style="{
        display: editState ? '' : 'none'
      }"
      bodyStyle="text-align: center;"
      header="Actions"
      headerStyle="width: 5rem;"
    >
      <template #body="{ data }">
        <SplitButton
          :model="getItems(data)"
          label="Edit"
          @click="editCategory(data)"
        ></SplitButton>
      </template>
    </Column>
  </DataTable>
</template>
<script>
export default {
  emits: ['addCategory', 'editCategory', 'deleteCategory'],
  props: ['title', 'editState', 'categories'],
  methods: {
    getItems(model) {
      return [
        {
          label: 'Delete Category',
          icon: 'pi pi-times',
          command: () => {
            this.$emit('deleteCategory', model)
          }
        }
      ]
    },
    editCategory(model) {
      this.$emit('editCategory', model)
    },
    onRowReorder(event) {
      console.log(event.value)
      this.$store.dispatch('layouts/reOrderDimensionCategories', {
        data: event.value
      })
    },
    addNewCategoryTapped() {
      this.$emit('addCategory')
    }
  }
}
</script>
