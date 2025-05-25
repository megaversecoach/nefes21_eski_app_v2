<template>
  <Dialog
    header="Card Detail"
    :style="{ width: '35rem' }"
    :modal="true"
    :closable="false"
    :closeOnEscape="false"
  >
    <div class="p-fluid p-grid">
      <div class="p-col-12">
        <div class="p-field p-mt-4">
          <span class="p-float-label">
            <InputText v-model="data.card_id" disabled />
            <label>Card Id</label>
          </span>
        </div>
      </div>
      <div class="p-col-12">
        <div class="p-field">
          <span class="p-float-label">
            <InputText v-model="data.card_title" />
            <label>Card Title</label>
          </span>
        </div>
      </div>
      <div class="p-col-12">
        <div class="p-field">
          <span class="p-float-label">
            <Textarea
              v-model="data.card_description"
              :autoResize="true"
              rows="4"
            />
            <label>Card Description</label>
          </span>
        </div>
      </div>

      <div class="p-field p-col-12">
        <span class="p-float-label">
          <Dropdown
            id="isDailyAvailable"
            :disabled="!this.deck.deck_isValid"
            v-model="data.isDailyAvailable"
            :options="isDailyAvailableOptions"
            optionLabel="label"
            optionValue="value"
          />
          <label for="isDailyAvailable">Daily Available</label>
        </span>
      </div>

      <div class="p-col-12">
        <div class="p-field">
          <span class="p-float-label">
            <AutoComplete
              v-model="data.content_id"
              :dropdown="true"
              :suggestions="filteredContents"
              forceSelection
              @complete="searchContent($event)"
              @item-select="selectContent"
            >
              <template #item="slotProps">
                <div class="p-ml-2">{{ slotProps.item.content_title }}</div>
              </template>
            </AutoComplete>
            <label>Related Content</label>
          </span>
        </div>
      </div>

      <div class="p-col-12">
        <div class="p-field">
          <span class="p-float-label">
            <InputText
              :modelValue="contentTitleById(data.content_id)"
              disabled
            />
            <label>Content Title</label>
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        class="p-button-secondary"
        label="Discard"
        @click="discardAndCloseModal"
      ></Button>
      <Button
        :label="this.state === 'new' ? 'Add Card' : 'Update Card'"
        @click="saveAndCloseModal"
      ></Button>
    </template>
  </Dialog>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: ['cardData', 'state', 'contents'],
  emits: ['discard', 'save', 'update'],
  watch: {
    cardData: {
      handler: function () {
        if (this.cardData) {
          this.configure(this.cardData)
          this.deck = this.getDeckById(this.data.deck_id)
        }
      }
    }
  },
  data() {
    return {
      data: {
        card_id: '',
        card_title: '',
        card_description: '',
        isDailyAvailable: 'false',
        content_id: '',
        deck_id: ''
      },
      filteredContents: null,
      deck: {
        deck_isValid: true
      },
      isDailyAvailableOptions: [
        { label: 'True', value: 'true' },
        { label: 'False', value: 'false' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getDeckById: 'cards/getDeckById'
    })
  },
  methods: {
    discardAndCloseModal() {
      console.log('discard and close modal')
      this.$emit('discard')
      this.initCardData()
    },
    saveAndCloseModal() {
      if (this.state === 'new') {
        this.$emit('save', this.data)
      } else if (this.state === 'edit') {
        this.$emit('update', this.data)
      }
      this.initCardData()
    },
    configure(editCardData) {
      if (editCardData) {
        this.data.card_id = editCardData.card_id
        this.data.card_title = editCardData.card_title
        this.data.card_description = editCardData.card_description
        this.data.isDailyAvailable = editCardData.isDailyAvailable
        this.data.content_id = editCardData.content_id
        this.data.deck_id = editCardData.deck_id
      }
    },
    initCardData() {
      this.data = {
        card_id: '',
        card_title: '',
        card_description: '',
        isDailyAvailable: 'false',
        content_id: '',
        deck_id: ''
      }
      this.deck.deck_isValid = true
    },
    searchContent(event) {
      setTimeout(() => {
        if (!event.query.trim().length) {
          this.filteredContents = [...this.contents]
        } else {
          this.filteredContents = this.contents.filter((content) => {
            return content.content_title
              .toLocaleLowerCase('tr')
              .includes(event.query.toLocaleLowerCase('tr'))
          })
        }
      }, 250)
    },
    selectContent(event) {
      this.data.content_id = event.value.content_id
    },

    contentTitleById(contentId) {
      if (contentId) {
        const selectedContent = this.contents.find(
          (content) => content.content_id === contentId
        )
        if (selectedContent) {
          return selectedContent.content_title
        } else {
          return ''
        }
      }
    }
  },
  mounted() {}
}
</script>
