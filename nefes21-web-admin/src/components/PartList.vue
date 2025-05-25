<template>
  <base-card>
    <div class="p-d-flex p-jc-between p-mb-4">
      <div class="p-d-flex">
        <h3>{{ title }}</h3>
        <div>
          <Button
            label="Back to Program Detail"
            icon="pi pi-angle-left"
            class="p-mt-3 p-ml-4"
            @click="$router.back()"
          />
        </div>
      </div>
      <div>
        <Button
          v-if="!isStatePublished"
          :class="['p-mt-3', { 'p-button-secondary': isOnEditState }]"
          label="Edit State"
          icon="pi pi-plus-circle"
          @click="toggleEditState"
        />
        <Button
          v-if="isOnEditState"
          class="p-button-success p-mt-3 p-ml-4"
          label="Save Order Changes"
          icon="pi pi-check"
          @click="saveOrderChanges"
        />
      </div>
    </div>
    <DataTable
      v-for="section in sectionItems"
      :key="section.parts.part_id"
      :value="section.parts"
      style="margin-bottom: 20px"
      showGridlines
      @rowReorder="onRowReorder"
    >
      <template #header>
        <div class="p-d-flex p-jc-between p-align-center">
          <span style="font-size: 20px; font-weight: bold">{{
            section.section_title
          }}</span>

          <Button
            v-if="isOnEditState"
            label="Add Part"
            icon="pi pi-plus-circle"
            @click="onAddPartClick(section)"
          />
        </div>
        <small style="color: slategray">{{ section.section_id }}</small>
      </template>
      <template #empty><h4>No Parts found in this Section</h4></template>
      <template #loading>Loading ...</template>
      <Column
        :rowReorder="isOnEditState"
        headerStyle="width: 3rem"
        :reorderableColumn="false"
        :style="{
          display: isOnEditState ? '' : 'none'
        }"
      />
      <Column
        field="orderInSection"
        header="#"
        headerStyle="width: 2.5rem; text-align:center"
        bodyStyle="text-align:center"
      />
      <Column field="part_id" header="Part ID" />
      <Column
        field="part_type"
        header="Part Type"
        headerStyle="text-align:center; width: 7rem"
        bodyStyle="text-align:center"
      >
        <template #body="{ data }">
          <span :class="'badge badge-' + data.part_type">
            {{ data.part_type }}
          </span>
        </template>
      </Column>
      <Column field="part_label" header="Part Label" />
      <Column field="part_title" header="Part Title" />
      <Column field="part_isValid" header="Validation">
        <template #body="{ data }">
          <span :class="'badge badge-' + data.part_isValid">
            {{ data.part_isValid ? 'Valid' : 'Invalid' }}
          </span>
        </template>
      </Column>
      <Column
        header="Actions"
        headerStyle="text-align: center; width: 10rem;"
        bodyStyle="text-align: center"
      >
        <template #body="{ data }">
          <div class="p-d-flex">
            <Button
              class="p-button-outlined"
              icon="pi pi-ellipsis-v"
              :label="state === 'publish' ? 'Details' : 'Edit'"
              @click="edit(data)"
            />
            <Button
              v-if="isOnEditState && !isExistsInPublishedParts(data.part_id)"
              icon="pi pi-trash"
              style="margin: 0"
              class="p-button-danger p-button-outlined p-ml-2"
              @click="confirmDeletePart(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </base-card>
  <Dialog
    v-model:visible="selectPartTypeDialogShow"
    header="Select Part Type to add into Program Section"
    :style="{ width: '35rem' }"
    :modal="true"
    :closeOnEscape="false"
  >
    <div class="p-d-flex p-jc-between">
      <Button
        style="margin: 20px"
        class="p-button-outlined"
        @click="onPartTypeSelect('audio')"
      >
        <div>
          <img
            alt="audio"
            src="../assets/ic_part_audio.svg"
            style="padding: 20px; fill: red"
          />
          <h4 class="p-mt-0">Audio</h4>
        </div>
      </Button>
      <Button
        style="margin: 20px"
        class="p-button-outlined"
        @click="onPartTypeSelect('video')"
      >
        <div>
          <img
            alt="video"
            src="../assets/ic_part_video.svg"
            style="padding: 20px"
          />
          <h4 class="p-mt-0">Video</h4>
        </div>
      </Button>
      <Button
        style="margin: 20px"
        class="p-button-outlined"
        @click="onPartTypeSelect('quest')"
      >
        <div>
          <img
            alt="quest"
            src="../assets/ic_part_quest.svg"
            style="padding: 20px"
          />
          <h4 class="p-mt-0">Quest</h4>
        </div>
      </Button>
    </div>
    <template #footer>
      <Button
        class="p-button-secondary"
        label="Cancel"
        @click="onDialogCancelClick"
      ></Button>
    </template>
  </Dialog>
  <ConfirmDialog :closable="false" :closeOnEscape="false" />
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: ['state', 'title', 'sectionItems', 'programId'],
  emits: ['deletePart'],
  data() {
    return {
      selectedSection: '',
      selectedPartType: '',
      selectPartTypeDialogShow: false,
      isOnEditState: false
    }
  },
  computed: {
    ...mapGetters({
      isExistsInPublishedParts: 'parts/isExistsInPublishedParts',
      draftedParts: 'parts/draftedParts'
    }),
    isStatePublished() {
      return this.state === 'publish'
    }
  },
  methods: {
    ...mapActions({
      deletePartFromDrafts: 'parts/deletePartFromDrafts',
      savePartAsDraft: 'parts/savePartAsDraft'
    }),
    async saveOrderChanges() {
      const result = await this.savePartAsDraft({
        state: this.state,
        parts: this.draftedParts
      })
      if (result) {
        this.$confirm.require({
          message: 'New Part Orders has been successfully changed.',
          header: 'Order Change Successful',
          icon: 'pi pi-check-circle',
          acceptLabel: 'OK',
          rejectLabel: 'Cancel',
          accept: () => {
            this.$confirm.close()
          },
          reject: () => {
            this.$confirm.close()
          }
        })
      }
    },
    confirmDeletePart(data) {
      this.$confirm.require({
        message: 'Are you sure you want to delete the drafted Part?',
        header: 'Delete Drafted Part',
        icon: 'pi pi-trash',
        acceptClass: 'p-button-danger',
        acceptLabel: 'Delete',
        rejectLabel: 'Cancel',
        accept: () => {
          this.deletePart(data)
          this.$confirm.close()
        },
        reject: () => {
          this.$confirm.close()
        }
      })
    },
    async deletePart(data) {
      const result = await this.deletePartFromDrafts({ part_id: data.part_id })
      if (result) {
        const saveNewOrderResult = await this.savePartAsDraft({
          state: this.state,
          parts: this.draftedParts
        })

        if (saveNewOrderResult) {
          const sectionIndex = this.sectionItems.findIndex(
            (section) => section.section_id === data.section_id
          )
          const partIndex = this.sectionItems[sectionIndex].parts.find(
            (part) => part.part_id === data.part_id
          )
          // eslint-disable-next-line vue/no-mutating-props
          this.sectionItems[sectionIndex].parts.splice(partIndex, 1)
          this.$emit('deletePart')
        }
      }
    },
    onRowReorder(event) {
      const newPartList = event.value
      newPartList.forEach(function (item, index) {
        item.orderInSection = index + 1
      })
      const sectionId = event.value[0].section_id
      const sectionIndex = this.sectionItems.findIndex(
        (section) => section.section_id === sectionId
      )

      // eslint-disable-next-line vue/no-mutating-props
      this.sectionItems[sectionIndex].parts = newPartList
    },
    toggleEditState() {
      this.isOnEditState = !this.isOnEditState
    },
    onDialogCancelClick() {
      this.selectPartTypeDialogShow = false
    },
    onAddPartClick(section) {
      this.selectedSection = section.section_id
      this.selectPartTypeDialogShow = true
    },
    onPartTypeSelect(partType) {
      this.selectedPartType = partType
      this.selectPartTypeDialogShow = false
      this.addPartRoute()
    },
    addPartRoute() {
      this.$router.push({
        name: 'PartEdit',
        params: {
          state: this.state,
          programId: this.programId,
          sectionId: this.selectedSection,
          partState: 'new',
          partType: this.selectedPartType
        }
      })
    },
    edit(model) {
      this.$router.push({
        name: 'PartDetail',
        params: {
          state: this.state,
          programId: model.program_id,
          sectionId: model.section_id,
          partId: model.part_id,
          partType: model.part_type,
          partState: 'edit'
        }
      })
    }
  }
}
</script>
<style scoped>
.badge-audio {
  background: #9dc9ec;
  color: #1a2a7e;
}
.badge-video {
  background: #f5aed8;
  color: #7a0d40;
}
.badge-quest {
  background: #7fecd8;
  color: #085d52;
}
</style>
