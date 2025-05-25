<template>
  <base-card>
    <DataTable
      :value="contents"
      :loading="contentListLoading"
      class="p-datatable-gridlines"
      responsiveLayout="scroll"
      :paginator="true"
      :rows="10"
      v-model:filters="filters"
      filterDisplay="menu"
      :filters="filters"
      :filterLocale="'tr'"
    >
      <template #header>
        <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
          <h3>{{ title }}</h3>
          <div>
            <Button
              type="button"
              icon="pi pi-filter-slash"
              label="Clear"
              class="p-button-outlined p-mb-2 p-mr-3"
              @click="clearFilter()"
            />
            <span class="p-input-icon-left p-mb-2">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['content_title'].value"
                placeholder="Search Contents"
                style="width: 100%; border-radius: 6px"
              />
            </span>
          </div>
        </div>
      </template>
      <template #empty><h4>No Contents Found</h4></template>
      <template #loading> Loading ...</template>
      <Column field="content_id" header="Content ID" />
      <Column
        headerStyle="width: 16rem;"
        field="content_title"
        header="Content Title"
      ></Column>
      <Column
        filterField="content_type_id"
        header="Content Type"
        :showFilterMatchModes="false"
      >
        <template #body="{ data }">
          <span
            class="badge"
            :style="
              'color: white; background:' +
              getContentTypeColorById(data.content_type_id)
            "
          >
            {{ data.content_type_id }}
          </span>
        </template>

        <template #filter="{ filterModel }">
          <div class="p-mb-3 p-text-bold">Select Content Type</div>
          <MultiSelect
            v-model="filterModel.value"
            :options="contentTypes"
            optionLabel="content_type_id"
            optionValue="content_type_id"
            placeholder="Any"
            class="p-column-filter"
          >
            <template #option="slotProps">
              <div>
                <span
                  :style="
                    'margin-left: 0.5em; vertical-align: middle; color: white; background:' +
                    getContentTypeColorById(slotProps.option.content_type_id)
                  "
                  class="badge"
                  >{{ slotProps.option.content_type_id }}</span
                >
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column
        filterField="author_id"
        header="Author"
        :showFilterMatchModes="false"
      >
        <template #body="{ data }">
          {{ getAuthorLabelById(data.author_id) }}
        </template>

        <template #filter="{ filterModel }">
          <div class="p-mb-3 p-text-bold">Select Author</div>
          <MultiSelect
            v-model="filterModel.value"
            :options="authors"
            optionLabel="author_label"
            optionValue="author_id"
            placeholder="Any"
            class="p-column-filter"
          >
            <template #option="slotProps">
              <div>
                <span
                  style="margin-left: 0.5em; vertical-align: middle"
                  class="image-text"
                  >{{ slotProps.option.author_id }} -
                  {{ slotProps.option.author_label }}</span
                >
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column
        filterField="content_isFree"
        header="Free/Premium"
        :showFilterMatchModes="false"
      >
        <template #body="{ data }">
          <span :class="'badge badge-free-' + data.content_isFree">{{
            data.content_isFree ? 'Free' : 'Premium'
          }}</span>
        </template>
        <template #filter="{ filterModel }">
          <div class="p-mb-3 p-text-bold">Select Free/Premium</div>
          <Dropdown
            v-model="filterModel.value"
            :options="isFreeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Any"
            class="p-column-filter"
            :showClear="true"
          >
            <template #option="slotProps">
              <span :class="'badge badge-free-' + slotProps.option.value">
                {{ slotProps.option.label }}
              </span>
            </template>
          </Dropdown>
        </template>
      </Column>
      <Column
        filterField="content_isValid"
        header="Validation"
        :showFilterMatchModes="false"
      >
        <template #body="{ data }">
          <span :class="'badge badge-' + data.content_isValid">
            {{ data.content_isValid ? 'Valid' : 'Invalid' }}
          </span>
        </template>
        <template #filter="{ filterModel }">
          <div class="p-mb-3 p-text-bold">Select Validation</div>
          <Dropdown
            v-model="filterModel.value"
            :options="isValidOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Any"
            class="p-column-filter"
            :showClear="true"
          >
            <template #option="slotProps">
              <span :class="'badge badge-free-' + slotProps.option.value">{{
                slotProps.option.label
              }}</span></template
            >
          </Dropdown>
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
import { FilterMatchMode } from 'primevue/api'
//import { mapGetters } from 'vuex'

export default {
  props: ['contents', 'contentTypes', 'authors', 'title', 'state'],
  data() {
    return {
      filters: null,

      contentListLoading: false,

      isValidOptions: [
        { label: 'Valid', value: true },
        { label: 'Invalid', value: false }
      ],
      isFreeOptions: [
        { label: 'Free', value: true },
        { label: 'Premium', value: false }
      ]
    }
  },
  computed: {},
  methods: {
    getAuthorLabelById(authorId) {
      return this.authors.find((author) => author.author_id === authorId)
        .author_label
    },
    getContentTypeColorById(contentTypeId) {
      return this.contentTypes.find(
        (contentType) => contentType.content_type_id === contentTypeId
      ).content_type_color
    },
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
    initFilters() {
      this.filters = {
        content_title: {
          value: null,
          matchMode: FilterMatchMode.CONTAINS
        },
        author_id: { value: null, matchMode: FilterMatchMode.IN },
        content_type_id: { value: null, matchMode: FilterMatchMode.IN },
        content_isFree: { value: null, matchMode: FilterMatchMode.EQUALS },
        content_isValid: { value: null, matchMode: FilterMatchMode.EQUALS }
      }
    },
    clearFilter() {
      this.initFilters()
    },
    delete(model) {
      this.$store.dispatch('content/delete', {
        content_id: model.content_id
      })
    },
    confirmDelete(model) {
      this.$confirm.require({
        message: 'Are you sure you want to delete the drafted Content?',
        header: 'Delete Drafted Content',
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
    },
    confirmPublish(model) {
      console.log('confirm publish')
      if (model.content_duration > 0) {
        this.$confirm.require({
          message: 'Are you sure you want to publish the drafted Content?',
          header: 'Publish Drafted Content',
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
      } else {
        this.$confirm.require({
          message:
            'It is not available to publish a content without any valid tracks.',
          header: 'Content Has No Valid Tracks',
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
    publish(model) {
      if (model.content_duration > 0) {
        this.$store.dispatch('content/publish', {
          content_id: model.content_id
        })
      }
    },
    edit(model) {
      this.$router.push({
        name: 'ContentDetail',
        params: {
          state: this.state,
          contentId: model.content_id
        }
      })
    }
  },
  created() {
    this.initFilters()
  }
}
</script>
<style scoped></style>
