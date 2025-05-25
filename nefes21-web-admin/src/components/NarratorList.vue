<template>
  <base-card>
    <DataTable :value="narrators" responsiveLayout="scroll" showGridlines>
      <template #header>
        <h3>{{ title }}</h3>
      </template>
      <template #empty><h4>No Narrators Found</h4></template>
      <template #loading>Loading ...</template>
      <Column field="narrator_id" header="Narrator ID" />
      <Column field="narrator_name" header="Narrator Name" />
      <Column field="narrator_surname" header="Narrator Surname" />
      <Column field="narrator_title" header="Narrator Title" />
      <Column header="Actions" headerStyle="width: 4rem;">
        <template #body="{ data }">
          <Button
            v-if="state === 'publish'"
            class="p-button-outlined"
            icon="pi pi-ellipsis-v"
            label="Edit"
            @click="edit(data)"
          />
          <SplitButton
            v-else
            :model="getItems(data)"
            icon="pi pi-check"
            label="Publish"
            @click="confirmPublish(data)"
          />
        </template>
      </Column>
    </DataTable>
  </base-card>
  <ConfirmDialog :closable="false" :closeOnEscape="false" />
</template>

<script>
export default {
  props: ['narrators', 'title', 'state'],
  methods: {
    getItems(model) {
      return [
        {
          label: 'Edit',
          icon: 'pi pi-ellipsis-v',
          command: () => {
            this.edit(model)
          }
        },
        {
          label: 'Delete',
          icon: 'pi pi-times',
          command: () => {
            this.confirmDelete(model)
          }
        }
      ]
    },
    edit(model) {
      this.$router.push({
        name: 'NarratorDetail',
        params: {
          state: this.state,
          narratorId: model.narrator_id
        }
      })
    },
    delete(model) {
      this.$store.dispatch('narrators/delete', {
        narratorId: model.narrator_id
      })
    },
    publish(model) {
      this.$store.dispatch('narrators/publish', {
        narratorId: model.narrator_id
      })
    },
    confirmPublish(model) {
      this.$confirm.require({
        message: 'Are you sure you want to publish the drafted Narrator?',
        header: 'Publish Drafted Narrator',
        icon: 'pi pi-check-circle',
        acceptLabel: 'Publish',
        rejectLabel: 'Cancel',
        accept: () => {
          this.publish(model)
          this.$confirm.close()
        },
        reject: () => {
          this.$confirm.close()
        }
      })
    },
    confirmDelete(model) {
      this.$confirm.require({
        message: 'Are you sure you want to delete the drafted Narrator?',
        header: 'Delete Drafted Narrator',
        icon: 'pi pi-trash',
        acceptClass: 'p-button-danger',
        acceptLabel: 'Delete',
        rejectLabel: 'Cancel',
        accept: () => {
          this.delete(model)
          this.$confirm.close()
        },
        reject: () => {
          this.$confirm.close()
        }
      })
    }
  }
}
</script>
