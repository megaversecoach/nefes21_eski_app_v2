<template>
  <DataTable
    :value="layouts"
    responsiveLayout="scroll"
    class="p-datatable-gridlines"
    @rowReorder="onRowReorder"
    showGridlines
  >
    <template #header>
      <div class="p-d-flex p-jc-between">
        <div class="p-d-flex">
          <h3>Quick-Start Layout</h3>
          <h3 v-if="layouts">: {{ title }}</h3>
        </div>
        <Button
          v-if="editState"
          label="Add Content"
          icon="pi pi-plus-circle"
          @click="addContentTapped"
          style="margin-bottom: 12px; margin-top: 12px"
        />
      </div>
    </template>
    <template #empty>
      <h4>Select Category to Edit...</h4>
    </template>
    <template #loading> Loading ...</template>
    <Column
      :rowReorder="editState"
      headerStyle="width: 3rem"
      :reorderableColumn="false"
      :style="{
        display: editState ? '' : 'none'
      }"
    />
    <Column
      bodyStyle="text-align: center;"
      headerStyle="text-align: center;"
      field="orderInCategory"
      header="#"
    />
    <Column field="content_id" header="Content ID" />
    <Column header="Content Title">
      <template #body="{ data }">
        {{ getContentById(data.content_id).content_title }}
      </template>
    </Column>
    <Column header="Free/Premium">
      <template #body="{ data }">
        <span
          :class="
            'badge badge-free-' + getContentById(data.content_id).content_isFree
          "
        >
          {{
            getContentById(data.content_id).content_isFree ? 'Free' : 'Premium'
          }}
        </span>
      </template>
    </Column>
    <Column header="Content Validation">
      <template #body="{ data }">
        <span
          :class="
            'badge badge-' + getContentById(data.content_id).content_isValid
          "
        >
          {{
            getContentById(data.content_id).content_isValid
              ? 'Valid'
              : 'Invalid'
          }}
        </span>
      </template>
    </Column>
    <Column
      headerStyle="width: 5rem;"
      header="Actions"
      bodyStyle="text-align: center;"
      :style="{
        display: editState ? '' : 'none'
      }"
    >
      <template #body="{ data }">
        <Button
          v-if="editState"
          icon="pi pi-trash"
          class="p-button-rounded p-button-danger p-button-outlined"
          @click="
            deleteContentTapped({
              content_id: data.content_id
            })
          "
      /></template>
    </Column>
  </DataTable>
</template>
<script>
export default {
  emits: ['addContent', 'deleteContent'],
  props: ['title', 'editState', 'layouts'],
  methods: {
    getContentById(contentId) {
      return this.$store.getters['content/getPublishedContentById'](contentId)
    },
    onRowReorder(event) {
      console.log(event.value)
      this.$store.dispatch('layouts/reOrderQsLayout', {
        data: event.value
      })
    },
    addContentTapped() {
      this.$emit('addContent')
    },
    deleteContentTapped(data) {
      this.$emit('deleteContent', data)
    }
  }
}
</script>
