<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex p-jc-between">
          <h3>Program Layout</h3>
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
        <program-layout-item-list
          :edit-state="editState"
          :program-layout="programLayout"
          @add-program="onAddProgramClick"
          @delete-program="onDeleteProgramClick"
        ></program-layout-item-list>
      </base-card>
    </div>
  </div>
  <ConfirmDialog :closable="false" :closeOnEscape="false" />
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import ProgramLayoutItemList from '@/components/ProgramLayoutItemList'
export default {
  components: { ProgramLayoutItemList },
  data() {
    return {
      editState: false
    }
  },
  computed: {
    ...mapGetters({
      programLayout: 'programs/programLayout',
      publishedPrograms: 'programs/publishedPrograms'
    })
  },
  methods: {
    ...mapActions({
      getProgramLayout: 'programs/getProgramLayout',
      getPublishedPrograms: 'programs/getPublishedPrograms',
      deleteProgramFromLayout: 'programs/deleteProgramFromLayout'
    }),
    onAddProgramClick() {
      console.log('AddProgramClick')
    },
    onDeleteProgramClick(programId) {
      this.$confirm.require({
        message: 'Are you sure you want to remove the Program from Layout?',
        header: 'Remove Program from Layout',
        icon: 'pi pi-trash',
        acceptClass: 'p-button-danger',
        acceptLabel: 'Delete',
        rejectLabel: 'Cancel',
        accept: () => {
          this.deleteProgramFromLayout({ program_id: programId })
          this.$confirm.close()
        },
        reject: () => {
          this.$confirm.close()
        }
      })
    },
    changeEditState() {
      this.editState = !this.editState
    },
    saveData() {
      console.log('SaveProgramLayout')
    }
  },
  created() {
    this.getProgramLayout()
    this.getPublishedPrograms()
  }
}
</script>
