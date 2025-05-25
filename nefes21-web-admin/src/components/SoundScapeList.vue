<template>
  <base-card>
    <DataTable :value="soundscapes" responsiveLayout="scroll" showGridlines>
      <template #header>
        <h3>{{ title }}</h3>
      </template>
      <template #empty><h4>No Soundscapes Found</h4></template>
      <template #loading>Loading ...</template>
      <Column field="soundscape_id" header="Soundscape ID" />
      <Column field="soundscape_title" header="Soundscape Title" />
      <Column header="Free/Premium">
        <template #body="{ data }">
          <span :class="'badge badge-free-' + data.soundscape_isFree">
            {{ data.soundscape_isFree ? 'Free' : 'Premium' }}
          </span>
        </template>
      </Column>

      <Column header="Validation">
        <template #body="{ data }">
          <span :class="'badge badge-' + data.soundscape_isValid">
            {{ data.soundscape_isValid ? 'Valid' : 'Invalid' }}
          </span>
        </template>
      </Column>

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
  props: ['soundscapes', 'title', 'state'],
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
        name: 'SoundScapeDetail',
        params: {
          state: this.state,
          soundscapeId: model.soundscape_id
        }
      })
    },
    delete(model) {
      this.$store.dispatch('soundScapes/delete', {
        soundscape_id: model.soundscape_id
      })
    },
    publish(model) {
      this.$store.dispatch('soundScapes/publish', {
        soundscape_id: model.soundscape_id
      })
    },
    confirmPublish(model) {
      console.log('confirm publish')
      this.$confirm.require({
        message: 'Are you sure you want to publish the drafted Soundscape?',
        header: 'Publish Drafted Soundscape',
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
        message: 'Are you sure you want to delete the drafted Soundscape?',
        header: 'Delete Drafted Soundscape',
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

<style scoped>
.badge {
  border-radius: 3px;
  padding: 0.25em 0.5rem;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;
}
.badge-true {
  background: #c8e6c9;
  color: #256029;
}
.badge-false {
  background: #ffcdd2;
  color: #c63737;
}
.badge-free-true {
  background: #c8e6c9;
  color: #256029;
}
.badge-free-false {
  background: #ffd8b2;
  color: #805b36;
}
</style>
