<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex p-jc-between">
          <h4 class="p-ml-3">Deck Detail</h4>
          <div>
            <Button
              class="p-button-secondary p-mr-4"
              label="Discard"
              icon="pi pi-times"
              @click="$router.back()"
            />
            <Button
              icon="pi pi-check"
              label="Save As Draft"
              disabled
              @click="saveData"
            />
          </div>
        </div>
        <div class="p-fluid p-grid">
          <div class="p-col-3">
            <div class="p-field p-mt-2">
              <span class="p-float-label p-mt-5">
                <InputText
                  id="deck_id"
                  v-model="data.deck_id"
                  class="disabled-input"
                  disabled
                  type="text"
                />
                <label>Deck ID</label>
              </span>
            </div>
            <div class="p-field p-mt-2">
              <span class="p-float-label p-mt-5">
                <InputText
                  id="deck_title"
                  v-model="data.deck_title"
                  type="text"
                />
                <label>Deck Title</label>
              </span>
            </div>
            <div class="p-field p-mt-2">
              <span class="p-float-label p-mt-5">
                <InputText id="dailyTag" v-model="data.dailyTag" type="text" />
                <label>Daily Tag</label>
              </span>
            </div>
            <div class="p-d-flex p-jc-between p-mt-5 p-align-center">
              <span style="paddin-right: 30px">Primary Color: </span>
              <ColorPicker
                style="margin-left: 10px"
                defaultColor="5d4a80"
                v-model="data.primaryColor"
              />
              <InputText
                style="margin-left: 10px"
                id="primaryColor"
                v-model="data.primaryColor"
                type="text"
              />
            </div>
            <div
              style="margin-left: auto; margin-right: auto; width: 10rem"
              class="p-text-center p-mt-4"
            >
              <h4 class="p-mb-2">Order In Section</h4>
              <InputNumber
                v-model="data.orderInSection"
                mode="decimal"
                showButtons
                buttonLayout="horizontal"
                decrementButtonClass="p-button-secondary"
                incrementButtonClass="p-button-secondary"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
              />
            </div>
            <div class="p-mt-5 p-text-center">
              <h4 class="p-mb-0">Showcase Image</h4>
              <small>JPG - 16:7 - (1600x700px)</small>
            </div>
            <div class="p-d-flex p-col-12 p-justify-center">
              <img
                :src="activeShowcaseImageUrl"
                :class="[
                  'showcase-image p-shadow-4',
                  { 'image-error': v$.data.showcaseImageUrl.file.$error }
                ]"
              />
            </div>
          </div>
          <div class="p-col-3">
            <div class="p-mt-5 p-text-center">
              <h4 class="p-mb-0">Card Back Image</h4>
              <small>JPG - 10:16 - (1000x1600px)</small>
            </div>
            <div class="p-d-flex p-col-12 p-justify-center">
              <img
                :src="activeCardBackImageUrl"
                :class="[
                  'card-image p-shadow-4',
                  { 'image-error': v$.data.cardBackImageUrl.file.$error }
                ]"
              />
            </div>
          </div>
          <div class="p-col-3">
            <div class="p-mt-5 p-text-center">
              <h4 class="p-mb-0">Card Front Image</h4>
              <small>JPG - 10:16 - (1000x1600px)</small>
            </div>
            <div class="p-d-flex p-col-12 p-justify-center">
              <img
                :src="activeCardFrontImageUrl"
                :class="[
                  'card-image p-shadow-4',
                  { 'image-error': v$.data.cardFrontImageUrl.file.$error }
                ]"
              />
            </div>
          </div>
          <div class="p-col-3">
            <div class="p-mt-5 p-text-center">
              <h4 class="p-mb-0">Background Image</h4>
              <small>PNG (transparent) - 10:18 - (1000x1800px)</small>
            </div>
            <div class="p-d-flex p-col-12 p-justify-center">
              <img
                :src="activeBackgroundImageUrl"
                :class="[
                  'background-image p-shadow-4',
                  { 'image-error': v$.data.backgroundImageUrl.file.$error }
                ]"
              />
            </div>
          </div>
        </div>
      </base-card>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

export default {
  props: ['deckId'],
  data() {
    return {
      data: {
        deck_id: '',
        deck_title: '',
        dailyTag: '',
        primaryColor: '',
        orderInSection: 0,
        deck_isValid: '',
        showcaseImageUrl: {
          url: '',
          editedUrl: '',
          file: null
        },
        cardFrontImageUrl: {
          url: '',
          editedUrl: '',
          file: null
        },
        cardBackImageUrl: {
          url: '',
          editedUrl: '',
          file: null
        },
        backgroundImageUrl: {
          url: '',
          editedUrl: '',
          file: null
        }
      },
      isValidOptions: [
        { label: 'Valid', value: true },
        { label: 'Invalid', value: false }
      ]
    }
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
      data: {
        deck_title: { required },
        dailyTag: { required },
        primaryColor: { required },
        orderInSection: { required },
        deck_isValid: { required },
        showcaseImageUrl: {
          file: {
            requiredIf: requiredIf(this.$route.params.state === 'new')
          }
        },
        cardBackImageUrl: {
          file: {
            requiredIf: requiredIf(this.$route.params.state === 'new')
          }
        },
        cardFrontImageUrl: {
          file: {
            requiredIf: requiredIf(this.$route.params.state === 'new')
          }
        },
        backgroundImageUrl: {
          file: {
            requiredIf: requiredIf(this.$route.params.state === 'new')
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      getDeckById: 'cards/getDeckById'
    }),
    activeShowcaseImageUrl() {
      if (this.data.showcaseImageUrl.file) {
        return this.data.showcaseImageUrl.editedUrl
      } else if (this.data.showcaseImageUrl.url) {
        return this.$store.getters.getImageSourceURL(
          this.data.showcaseImageUrl.url
        )
      } else {
        return require('@/assets/placeholder16x7.jpg')
      }
    },
    activeCardBackImageUrl() {
      if (this.data.cardBackImageUrl.file) {
        return this.data.cardBackImageUrl.editedUrl
      } else if (this.data.cardBackImageUrl.url) {
        return this.$store.getters.getImageSourceURL(
          this.data.cardBackImageUrl.url
        )
      } else {
        return require('@/assets/placeholder10x16.jpg')
      }
    },
    activeCardFrontImageUrl() {
      if (this.data.cardFrontImageUrl.file) {
        return this.data.cardFrontImageUrl.editedUrl
      } else if (this.data.cardFrontImageUrl.url) {
        return this.$store.getters.getImageSourceURL(
          this.data.cardFrontImageUrl.url
        )
      } else {
        return require('@/assets/placeholder10x16.jpg')
      }
    },
    activeBackgroundImageUrl() {
      if (this.data.backgroundImageUrl.file) {
        return this.data.backgroundImageUrl.editedUrl
      } else if (this.data.backgroundImageUrl.url) {
        return this.$store.getters.getImageSourceURL(
          this.data.backgroundImageUrl.url
        )
      } else {
        return require('@/assets/placeholder10x18.png')
      }
    }
  },
  methods: {
    saveData() {
      this.v$.$touch()
      console.log('state:', this.$route.params.state)
    },
    configure(object) {
      this.data.deck_id = object.deck_id
      this.data.deck_title = object.deck_title
      this.data.dailyTag = object.dailyTag
      this.data.orderInSection = object.orderInSection
      this.data.primaryColor = object.primaryColor
      this.data.deck_isValid = object.deck_isValid
      this.data.cardBackImageUrl.url = object.cardBackImageUrl
      this.data.cardFrontImageUrl.url = object.cardFrontImageUrl
      this.data.backgroundImageUrl.url = object.backgroundImageUrl
      this.data.showcaseImageUrl.url = object.showcaseImageUrl
    }
  },

  mounted() {
    if (this.deckId) {
      const data = this.getDeckById(this.deckId)
      console.log(this.data)
      this.configure(data)
    }
  }
}
</script>

<style scoped>
.disabled-input {
  background: #e9ebf1;
  border-color: white;
}
.showcase-image {
  border-radius: 20px;
  border-style: solid;
  border-width: 3px;
  border-color: white;
  width: 32vh;
  object-fit: cover;
}
.card-image {
  border-radius: 20px;
  border-style: solid;
  border-width: 3px;
  border-color: white;
  width: 27vh;
  object-fit: cover;
}
.background-image {
  border-radius: 20px;
  border-style: solid;
  border-width: 3px;
  border-color: white;
  width: 24vh;
  object-fit: cover;
}
.image-error {
  border-color: #f44336;
}
</style>
