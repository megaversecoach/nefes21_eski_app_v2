<template>
  <base-card>
    <DataTable
      :value="programs"
      responsiveLayout="scroll"
      showGridlines
      :paginator="true"
      :rows="10"
    >
      <template #header>
        <h3>{{ title }}</h3>
      </template>
      <template #empty><h4>No Programs Found</h4></template>
      <template #loading>Loading ...</template>
      <Column field="program_id" header="Program ID" />
      <Column field="program_title" header="Program Title" />
      <Column field="program_partCount" header="Part Count" />
      <Column field="program_isOnSale" header="On Sale">
        <template #body="{ data }">
          <span :class="'badge badge-' + data.program_isOnSale">
            {{ data.program_isOnSale ? 'True' : 'False' }}
          </span>
        </template>
      </Column>
      <Column field="program_isValid" header="Validation">
        <template #body="{ data }">
          <span :class="'badge badge-' + data.program_isValid">
            {{ data.program_isValid ? 'Valid' : 'Invalid' }}
          </span>
        </template>
      </Column>
      <Column
        headerStyle="width: 8rem;"
        header="Actions"
        bodyStyle="text-align: center;"
      >
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
import { mapGetters, mapActions } from 'vuex'
export default {
  props: ['programs', 'title', 'state'],
  computed: {
    ...mapGetters({
      getAuthorLabelById: 'authors/getAuthorLabelById'
    }),
    authorLabel(authorId) {
      return this.getAuthorLabelById(authorId)
    }
  },
  methods: {
    ...mapActions({
      deleteProgramFromDrafts: 'programs/deleteProgramFromDrafts',
      publishProgram: 'programs/publishProgram'
    }),

    confirmPublish(model) {
      if (model.program_partCount > 0) {
        if (
          model.product_id.includes(model.program_id) &&
          model.discounted_product_id.includes(model.program_id) &&
          model.discountRate !== null
        ) {
          this.$confirm.require({
            message: 'Are you sure you want to publish the drafted Program?',
            header: 'Publish Drafted Program',
            icon: 'pi pi-check-circle',
            acceptLabel: 'Publish',
            rejectLabel: 'Cancel',
            accept: () => {
              this.publishProgram({ program_id: model.program_id })
              this.$confirm.close()
            },
            reject: () => {
              this.$confirm.close()
            }
          })
        } else {
          this.$confirm.require({
            message:
              'It is not available to publish a Program without valid Product IDs and Discount Rate.',
            header: 'Invalid ProductIDs',
            icon: 'pi pi-exclamation-circle',
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
      } else {
        this.$confirm.require({
          message:
            'It is not available to publish a Program without any valid parts.',
          header: 'Program Has No Valid Parts',
          icon: 'pi pi-exclamation-circle',
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
    edit(model) {
      this.$router.push({
        name: 'ProgramDetail',
        params: {
          state: this.state,
          programId: model.program_id
        }
      })
    },
    confirmDelete(model) {
      this.$confirm.require({
        message: 'Are you sure you want to delete the drafted Program',
        header: 'Delete Drafted Program',
        icon: 'pi pi-trash',
        acceptClass: 'p-button-danger',
        acceptLabel: 'Delete',
        rejectLabel: 'Cancel',
        accept: () => {
          this.deleteProgramFromDrafts({ program_id: model.program_id })
          this.$confirm.close()
        },
        reject: () => {
          this.$confirm.close()
        }
      })
    },
    getItems(model) {
      return [
        {
          label: 'Edit',
          icon: 'pi pi-ellipsis-v',
          command: () => {
            this.edit(model)
            console.log('EditProgram', model)
          }
        },
        {
          label: 'Delete',
          icon: 'pi pi-times',
          command: () => {
            this.confirmDelete(model)
            console.log('DeleteProgram', model)
          }
        }
      ]
    }
  }
}
</script>
