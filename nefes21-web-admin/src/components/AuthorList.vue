<template>
  <base-card>
    <DataTable :value="authors" responsiveLayout="scroll" showGridlines>
      <template #header>
        <h3>{{ title }}</h3>
      </template>
      <template #empty><h4>No Authors Found</h4></template>
      <template #loading>Loading ...</template>
      <Column field="author_id" header="Author ID" />
      <Column field="author_name" header="Author Name" />
      <Column field="author_surname" header="Author Surname" />
      <Column field="author_title" header="Author Title" />
      <Column header="Consulting">
        <template #body="{ data }">
          <span :class="'badge badge-' + data.isConsulting">
            {{ data.isConsulting ? 'Active' : 'Passive' }}
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
  props: ['authors', 'title', 'state'],
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
        name: 'AuthorDetail',
        params: {
          state: this.state,
          authorId: model.author_id
        }
      })
    },
    delete(model) {
      this.$store.dispatch('authors/delete', {
        authorId: model.author_id
      })
    },
    publish(model) {
      this.$store.dispatch('authors/publish', {
        authorId: model.author_id
      })
    },
    confirmPublish(model) {
      this.$confirm.require({
        message: 'Are you sure you want to publish the drafted Author?',
        header: 'Publish Drafted Author',
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
        message: 'Are you sure you want to delete the drafted Author?',
        header: 'Delete Drafted Author',
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
</style>
