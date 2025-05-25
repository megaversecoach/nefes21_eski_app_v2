<template>
  <div class="p-d-flex p-jc-between p-mb-4">
    <h3>{{ title }}</h3>
  </div>
  <DataTable
    v-for="object in layouts"
    :key="object.category_id"
    :value="object.layoutItems"
    @rowReorder="onRowReorder"
    class="p-datatable-gridlines"
    style="margin-bottom: 20px"
    showGridlines
  >
    <template #header>
      <div class="p-d-flex p-jc-between p-align-center">
        <span style="font-size: 20px; font-weight: bold">{{
          object.category_label
        }}</span>

        <Button
          v-if="editState"
          label="Add Content"
          icon="pi pi-plus-circle"
          @click="
            addContentTapped({
              layoutItems: object.layoutItems,
              category_label: object.category_label,
              category_id: object.category_id
            })
          "
        />
      </div>
      <small style="color: slategray">{{ object.category_id }}</small>
    </template>
    <template #empty><h4>No Contents Found...</h4> </template>
    <template #loading>Loading ...</template>
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
      headerStyle="width: 3rem; text-align: center;"
      field="orderInCategory"
      header="#"
    ></Column>
    <Column
      :style="{
        display:
          object.category_id === 'soundscapes' ||
          object.category_id === 'sleep_soundscapes'
            ? 'none'
            : ''
      }"
      field="content_id"
      header="Content ID"
    ></Column>
    <Column
      :style="{
        display:
          object.category_id === 'soundscapes' ||
          object.category_id === 'sleep_soundscapes'
            ? 'none'
            : ''
      }"
      header="Content Title"
    >
      <template #body="{ data }">
        <span>{{
          data.content_id === ''
            ? ''
            : getContentById(data.content_id).content_title
        }}</span>
      </template>
    </Column>
    <Column
      :style="{
        display: object.category_id === 'showcase' ? '' : 'none'
      }"
      header="Showcase Type"
    >
      <template #body="{ data }">
        {{ getShowcaseTypeLabelById(data.showcase_type_id) }}
      </template>
    </Column>
    <Column
      :style="{
        display:
          object.category_id === 'soundscapes' ||
          object.category_id === 'sleep_soundscapes'
            ? 'none'
            : ''
      }"
      header="Content Free/Premium"
    >
      <template #body="{ data }">
        <span :class="isFreeClassStyle(data.content_id)">
          {{
            data.content_id === ''
              ? ''
              : getContentById(data.content_id).content_isFree
              ? 'Free'
              : 'Premium'
          }}
        </span>
      </template>
    </Column>
    <Column
      :style="{
        display:
          object.category_id === 'soundscapes' ||
          object.category_id === 'sleep_soundscapes'
            ? 'none'
            : ''
      }"
      header="Content Validation"
    >
      <template #body="{ data }">
        <span :class="validationClassStyle(data.content_id)">{{
          data.content_id === ''
            ? ''
            : getContentById(data.content_id).content_isValid
            ? 'Valid'
            : 'Invalid'
        }}</span>
      </template>
    </Column>
    <Column
      :style="{
        display:
          object.category_id === 'soundscapes' ||
          object.category_id === 'sleep_soundscapes'
            ? ''
            : 'none'
      }"
      field="soundscape_id"
      header="Soundscape ID"
    ></Column>
    <Column
      :style="{
        display:
          object.category_id === 'soundscapes' ||
          object.category_id === 'sleep_soundscapes'
            ? ''
            : 'none'
      }"
      header="Soundscape Title"
    >
      <template #body="{ data }">
        <span>{{
          getSoundscapeById(data.soundscape_id).soundscape_title
        }}</span>
      </template>
    </Column>
    <Column
      :style="{
        display:
          object.category_id === 'soundscapes' ||
          object.category_id === 'sleep_soundscapes'
            ? ''
            : 'none'
      }"
      header="Soundscape Free/Premium"
    >
      <template #body="{ data }">
        <span :class="isFreeSoundscapeClassStyle(data.soundscape_id)">
          {{
            data.soundscape_id === ''
              ? ''
              : getSoundscapeById(data.soundscape_id).soundscape_isFree
              ? 'Free'
              : 'Premium'
          }}
        </span>
      </template>
    </Column>
    <Column
      :style="{
        display:
          object.category_id === 'soundscapes' ||
          object.category_id === 'sleep_soundscapes'
            ? ''
            : 'none'
      }"
      header="Soundscape Validation"
    >
      <template #body="{ data }">
        <span
          :class="
            'badge badge-' +
            getSoundscapeById(data.soundscape_id).soundscape_isValid
          "
          >{{
            getSoundscapeById(data.soundscape_id).soundscape_isValid === ''
              ? ''
              : getSoundscapeById(data.soundscape_id).soundscape_isValid
              ? 'Valid'
              : 'Invalid'
          }}</span
        >
      </template>
    </Column>
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
          class="p-button-rounded p-button-danger p-button-outlined"
          @click="
            deleteContentTapped({
              content_id: data.content_id,
              soundscape_id: data.soundscape_id,
              category_id: object.category_id
            })
          "
      /></template>
    </Column>
  </DataTable>
</template>
<script>
export default {
  emits: ['addContent', 'deleteContent'],
  props: ['title', 'selection', 'layouts', 'showcaseTypes', 'editState'],
  computed: {},
  methods: {
    getContentById(contentId) {
      return this.$store.getters['content/getPublishedContentById'](contentId)
    },
    getSoundscapeById(soundscapeId) {
      if (soundscapeId) {
        return this.$store.getters['soundScapes/getPublishedSoundscapeById'](
          soundscapeId
        )
      } else
        return {
          soundscape_title: '',
          soundscape_isValid: '',
          soundscape_isFree: ''
        }
    },
    getShowcaseTypeLabelById(showcaseTypeId) {
      if (showcaseTypeId) {
        return this.showcaseTypes.find(
          (showcaseType) => showcaseType.showcase_type_id === showcaseTypeId
        ).showcase_label
      } else {
        return ''
      }
    },
    addContentTapped(data) {
      this.$emit('addContent', data)
    },
    deleteContentTapped(data) {
      this.$emit('deleteContent', data)
    },
    onRowReorder(event) {
      console.log('row-reordered')
      console.log(event.value)
      this.$store.dispatch('layouts/reOrderDimensionLayout', {
        data: event.value
      })
    },
    validationClassStyle(content_id) {
      if (content_id) {
        if (this.getContentById(content_id).content_isValid) {
          return 'badge badge-true'
        } else {
          return 'badge badge-false'
        }
      }
      return ''
    },
    isFreeClassStyle(content_id) {
      if (content_id) {
        if (this.getContentById(content_id).content_isFree) {
          return 'badge badge-free-true'
        } else {
          return 'badge badge-free-false'
        }
      }
      return ''
    },
    isFreeSoundscapeClassStyle(soundscape_id) {
      if (soundscape_id) {
        if (this.getSoundscapeById(soundscape_id).soundscape_isFree) {
          return 'badge badge-free-true'
        } else {
          return 'badge badge-free-false'
        }
      }
      return ''
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
