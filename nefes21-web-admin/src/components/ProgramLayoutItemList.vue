<template>
  <div class="p-d-flex p-mb-4">
    <Button
      v-if="editState"
      class="align-right"
      label="Add Program"
      icon="pi pi-plus-circle"
      @click="onAddProgramClick"
      style="margin-bottom: 12px; margin-top: 12px"
      disabled
    />
  </div>
  <DataTable
    :value="programLayout"
    responsiveLayout="scroll"
    showGridlines
    @rowReorder="onRowReorder"
  >
    <template #empty><h4>No Programs Found in Layout...</h4></template>
    <template #loading> Loading ...</template>
    <Column
      :rowReorder="editState"
      headerStyle="width: 3rem"
      :reorderableColumn="false"
      :style="{
        display: editState ? '' : 'none'
      }"
    >
    </Column>
    <Column field="orderInSection" header="#" />
    <Column field="program_id" header="Program ID" />
    <Column header="Program Title">
      <template #body="{ data }">
        {{ getProgramTitleById(data.program_id) }}
      </template>
    </Column>
    <Column field="program_label_id" header="Program Label" />
    <Column field="program_isDiscounted" header="Program Discount" />
    <Column
      headerStyle="width: 5rem;"
      header="Actions"
      bodyStyle="text-align: center; overflow: visible"
      :style="{
        display: editState ? '' : 'none'
      }"
    >
      <template #body="{ data }">
        <Button
          v-if="editState"
          icon="pi pi-times"
          class="p-button-danger p-button-outlined"
          @click="
            onDeleteProgramClick({
              programId: data.program_id
            })
          "
      /></template>
    </Column>
  </DataTable>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  emits: ['addProgram', 'deleteProgram'],
  props: ['editState', 'programLayout'],
  computed: {
    ...mapGetters({
      getProgramTitleById: 'programs/getProgramTitleById'
    })
  },
  methods: {
    ...mapActions({
      reorderProgramLayout: 'programs/reorderProgramLayout'
    }),
    onAddProgramClick() {
      this.$emit('addProgram')
    },
    onRowReorder(event) {
      console.log('reOrderedProgramLayout: ', event.value)
      this.reorderProgramLayout({ programLayout: this.programLayout })
    },
    onDeleteProgramClick(programId) {
      this.$emit('deleteProgram', programId)
    }
  }
}
</script>
