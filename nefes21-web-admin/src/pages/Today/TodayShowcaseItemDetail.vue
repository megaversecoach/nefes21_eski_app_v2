<template>
  <base-card>
    <div class="p-d-flex p-jc-between p-mb-4">
      <h2>Showcase Item Detail</h2>
      <div>
        <Button class="p-button-secondary p-mr-4" @click="$router.back()"
          >Discard</Button
        >
        <Button class="p-button" @click="saveData">Save and Publish</Button>
      </div>
    </div>
    <Carousel :numVisible="3" :value="placeholderData">
      <template #header>
        <h4>Preview</h4>
      </template>
      <template #item="slotProps">
        <div class="product-item">
          <div class="product-item-content">
            <div class="p-mb-3">
              <img
                alt="avatar"
                class="product-image"
                :src="slotProps.data.imageURL"
              />
            </div>
            <div>
              <h4 class="p-mb-1">{{ slotProps.data.name }}</h4>
              <h6 class="p-mt-0 p-mb-3">
                Priority : {{ slotProps.data.priority }}
              </h6>
              <div class="car-buttons p-mt-5"></div>
            </div>
          </div>
        </div>
      </template>
    </Carousel>
  </base-card>
  <div class="p-col-12">
    <base-card>
      <div class="p-fluid p-d-flex">
        <div class="p-grid p-col-12">
          <div class="p-field p-col-6">
            <label class="dropbox-label">Showcase Priority Rating</label>
            <InputText
              id="priorityRating"
              v-model="v$.objectData.priorityRating.$model"
              type="text"
              oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');"
            />
            <small v-if="v$.objectData.priorityRating.$error" class="p-error"
              >This field is required</small
            >
          </div>
          <div class="p-field p-col-6">
            <label class="dropbox-label">Showcase Action</label>
            <Dropdown
              v-model="v$.objectData.action.$model"
              :options="showcase_actions"
              :selection="objectData.action"
              optionLabel="label"
              optionValue="action_id"
              placeholder="Select Showcase Action..."
            />
            <small v-if="v$.objectData.action.$error" class="p-error"
              >This field is required</small
            >
          </div>
        </div>
      </div>
      <div class="p-col-12">
        <div class="p-fluid p-d-flex">
          <div class="p-col-6">
            <label class="dropbox-label">Showcase Validation</label>
            <Dropdown
              v-model="v$.objectData.showcase_isValid.$model"
              :options="isValidOptions"
              class="p-mt-2 p-mb-4"
              optionLabel="label"
              optionValue="value"
              placeholder="Select Validation..."
            />
            <small v-if="v$.objectData.showcase_isValid.$error" class="p-error"
              >This field is required</small
            >
          </div>
          <div class="p-col-6">
            <label class="dropbox-label">Showcase Free/Premium</label>
            <Dropdown
              v-model="objectData.showcase_isFree"
              :options="isFreeOptions"
              class="p-mt-2 p-mb-4"
              optionLabel="label"
              optionValue="value"
              placeholder="Select Free/Premium..."
              :disabled="isOpenContent"
            />
            <small
              v-if="v$.objectData.showcase_isFree !== undefined"
              class="p-error"
            >
              <span v-if="v$.objectData.showcase_isFree.$error"
                >This field is required</span
              >
            </small>
          </div>
        </div>
      </div>
      <div class="p-col-12">
        <div class="p-fluid p-d-flex">
          <div class="p-col-6">
            <label class="dropbox-label">Showcase Types</label>
            <Dropdown
              v-model="objectData.showcase_type_id"
              :options="showcase_types"
              class="p-mt-2 p-mb-4"
              optionLabel="showcase_label"
              optionValue="showcase_type_id"
              placeholder="Select Showcase Type..."
            />
            <small v-if="v$.objectData.showcase_type_id.$error" class="p-error">
              This field is required
            </small>
          </div>
        </div>
      </div>
      <div class="p-col-12">
        <div class="p-fluid p-d-flex">
          <div class="p-col-6">
            <label class="dropbox-label">Showcase Content</label>
            <Dropdown
              v-model="objectData.content_id"
              :options="contents"
              class="p-mt-2 p-mb-4"
              optionLabel="content_title"
              optionValue="content_id"
              placeholder="Select Content..."
              :disabled="isOpenURL"
            />
            <small
              v-if="v$.objectData.content_id !== undefined"
              class="p-error"
            >
              <span v-if="v$.objectData.content_id.$error"
                >This field is required</span
              >
            </small>
          </div>
          <div class="p-field p-col-6">
            <label class="dropbox-label">Showcase Action URL</label>
            <InputText
              id="actionUrl"
              v-model="objectData.actionUrl"
              type="text"
              placeholder="Action URL"
              :disabled="isOpenContent"
            />
            <small v-if="v$.objectData.actionUrl !== undefined" class="p-error">
              <span v-if="v$.objectData.actionUrl.$error"
                >This field is required</span
              >
            </small>
          </div>
        </div>
      </div>
      <div class="p-col-12" v-if="isOpenURL">
        <div class="p-d-flex">
          <img :src="imageURL" class="header-image" />
        </div>
        <Button class="p-button-raised p-button-warning" @click="toggleCropper">
          Select
        </Button>
        <Cropper
          v-model="isToggleShow"
          :width="2000"
          :height="1500"
          :noSquare="false"
          :noCircle="true"
          field="authorProfilePicImage"
          img-format="jpg"
          lang-type="en"
          @crop-success="cropSuccess"
        ></Cropper>
      </div>
    </base-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import utilities from '../../utilities/utilities'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

export default {
  props: ['showcase_id', 'state'],
  data() {
    return {
      placeholderData: [
        {
          name: 'Placeholder',
          imageURL: require('@/assets/placeholder4x3.jpg'),
          priority: 600,
          isRemovable: false
        },
        {
          name: 'Placeholder',
          imageURL: require('@/assets/placeholder4x3.jpg'),
          priority: 400,
          isRemovable: false
        },
        {
          name: 'Placeholder',
          imageURL: require('@/assets/placeholder4x3.jpg'),
          priority: 200,
          isRemovable: false
        }
      ],
      objectData: {
        action: '',
        actionUrl: '',
        content_id: '',
        method: '',
        priorityRating: 0,
        showcase_id: '',
        showcase_imageUrl: {
          file: null,
          url: '',
          editedUrl: ''
        },
        showcase_type_id: '',
        showcase_isFree: '',
        showcase_isValid: null,
        language: ''
      },
      showcase_actions: [
        {
          action_id: 'open_content',
          label: 'Open Content'
        },
        {
          action_id: 'open_url',
          label: 'Open URL'
        }
      ],
      isValidOptions: [
        { label: 'Valid', value: true },
        { label: 'Invalid', value: false }
      ],
      isFreeOptions: [
        { label: 'Free', value: true },
        { label: 'Premium', value: false }
      ],
      isToggleShow: false,
      isFormValid: false
    }
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    if (this.isOpenURL) {
      return {
        objectData: {
          action: { required },
          priorityRating: { required },
          showcase_type_id: { required },
          showcase_isValid: { required },
          showcase_isFree: { required },
          actionUrl: { required }
        }
      }
    } else if (this.isOpenContent) {
      return {
        objectData: {
          action: { required },
          priorityRating: { required },
          showcase_type_id: { required },
          showcase_isValid: { required },

          content_id: { required }
        }
      }
    } else {
      return {
        objectData: {
          priorityRating: { required },
          action: { required },
          showcase_isValid: { required },
          showcase_type_id: { required }
        }
      }
    }
  },
  computed: {
    imageURL() {
      const condition =
        this.objectData.showcase_imageUrl.url !== '' &&
        this.objectData.showcase_imageUrl.file === null
      if (condition) {
        return this.$store.getters.getImageSourceURL(
          this.objectData.showcase_imageUrl.url
        )
      }
      return this.objectData.showcase_imageUrl.editedUrl
    },
    ...mapGetters({
      contents: 'content/publishedContents',
      showcase_types: 'layouts/showcaseTypes'
    }),
    priorityRating() {
      return this.objectData.priorityRating
    },
    isOpenContent() {
      return this.objectData.action === 'open_content'
    },
    isOpenURL() {
      return this.objectData.action === 'open_url'
    }
  },
  watch: {
    isOpenContent: {
      handler: function () {
        if (this.isOpenContent) {
          this.objectData.showcase_isFree = ''
          this.objectData.actionUrl = ''
          this.objectData.showcase_imageUrl.editedUrl = ''
          this.objectData.showcase_imageUrl.file = null
        }
      }
    },
    isOpenURL: {
      handler: function () {
        if (this.isOpenURL) {
          this.objectData.content_id = ''
        }
      }
    },
    priorityRating: {
      handler: function () {
        if (this.priorityRating < 600 && this.priorityRating > 400) {
          this.placeholderData.splice(1, 0, {
            name: 'Current Showcase Item',
            priority: this.priorityRating,
            imageURL: require('@/assets/avatar.jpg'),
            isRemovable: true
          })
        } else if (this.priorityRating > 200 && this.priorityRating < 400) {
          this.placeholderData.splice(2, 0, {
            name: 'Current Showcase Item',
            priority: this.priorityRating,
            imageURL: require('@/assets/avatar.jpg'),
            isRemovable: true
          })
        } else {
          const index = this.placeholderData.findIndex(
            (item) => item.isRemovable === true
          )
          if (index !== -1) {
            this.placeholderData.splice(index, 1)
          }
        }
      }
    }
  },
  methods: {
    ...mapActions({
      getContents: 'content/getContents',
      getShowcaseTypes: 'layouts/getShowcaseTypes'
    }),
    configure(object) {
      this.objectData.action = object.action
      this.objectData.actionUrl = object.actionUrl
      this.objectData.content_id = object.content_id
      this.objectData.method = object.method
      this.objectData.priorityRating = object.priorityRating
      this.objectData.showcase_id = object.showcase_id
      this.objectData.showcase_imageUrl.url = object.showcase_imageUrl
      this.objectData.showcase_type_id = object.showcase_type_id
      this.objectData.showcase_isFree = object.showcase_isFree
      this.objectData.showcase_isValid = object.showcase_isValid
      this.objectData.language = object.language
    },
    toggleCropper() {
      this.isToggleShow = !this.isToggleShow
    },
    cropSuccess(imageDataURL, field) {
      console.log(field)
      utilities
        .convertUrlToFile(imageDataURL, field, 'image/jpg')
        .then((file) => {
          this.objectData.showcase_imageUrl.file = file
          this.objectData.showcase_imageUrl.editedUrl = imageDataURL
        })
        .catch((err) => {
          console.log(err)
        })
    },
    checkData() {
      if (
        this.objectData.showcase_imageUrl.file === null &&
        this.objectData.action === 'open_url' &&
        this.objectData.showcase_imageUrl.url === ''
      ) {
        this.isFormValid = false
      }
    },
    async saveData() {
      this.v$.$touch()
      if (this.v$.$error) return
      this.isFormValid = true
      this.checkData()
      if (this.isFormValid) {
        const result = await this.$store.dispatch(
          'todays/saveNonPersonalized',
          {
            data: this.objectData
          }
        )
        if (result) {
          this.$router.back()
        }
      } else {
        console.log('Image needed')
      }
    }
  },

  mounted() {
    if (this.state === undefined) {
      const data = this.$store.getters['todays/nonPersonalizedShowcasesById'](
        this.showcase_id
      )
      this.configure(data)
    }
    this.getContents({ state: 'publish' })
    this.getShowcaseTypes()
  }
}
</script>

<style lang="scss" scoped>
.product-item {
  .product-item-content {
    border: 1px solid var(--surface-d);
    border-radius: 3px;
    margin: 0.3rem;
    text-align: center;
    padding: 2rem 0;
  }

  .product-image {
    width: 50%;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }
}
.disabled-input {
  background: #e9ebf1;
  border-color: white;
}
.header-image {
  width: 200px;
  height: 150px;
  object-fit: cover;
  margin-top: 20px;
}
</style>
