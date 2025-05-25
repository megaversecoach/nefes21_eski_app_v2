<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex p-jc-between p-mb-4">
          <h3 class="p-ml-3">Author Detail</h3>
          <div>
            <Button
              class="p-button-secondary p-mr-4"
              icon="pi pi-times"
              label="Discard"
              @click="$router.back()"
            />
            <Button
              icon="pi pi-check"
              label="Save As Draft"
              @click="saveData"
            />
          </div>
        </div>
        <div class="p-fluid p-d-flex">
          <div class="p-col-8">
            <div class="p-grid p-col-12">
              <div class="p-field p-col-6">
                <span class="p-float-label">
                  <InputText
                    id="authorName"
                    v-model="v$.data.author_name.$model"
                    :class="{ 'p-invalid': v$.data.author_name.$error }"
                    type="text"
                    @blur="v$.data.author_name.$touch()"
                  />
                  <label>Author Name</label>
                </span>
                <small
                  class="p-error"
                  v-for="error of v$.data.author_name.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </div>
              <div class="p-field p-col-6">
                <span class="p-float-label">
                  <InputText
                    id="authorSurname"
                    v-model="v$.data.author_surname.$model"
                    :class="{ 'p-invalid': v$.data.author_surname.$error }"
                    type="text"
                    @blur="v$.data.author_surname.$touch()"
                  />
                  <label>Author Surname</label>
                </span>
                <small
                  class="p-error"
                  v-for="error of v$.data.author_surname.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </div>
              <div class="p-field p-col-6">
                <span class="p-float-label">
                  <InputText
                    id="authorLabel"
                    v-model="v$.data.author_label.$model"
                    :class="{ 'p-invalid': v$.data.author_label.$error }"
                    type="text"
                    @blur="v$.data.author_label.$touch()"
                  />
                  <label>Author Label</label>
                </span>
                <small
                  class="p-error"
                  v-for="error of v$.data.author_label.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </div>
              <div class="p-field p-col-6">
                <span class="p-float-label">
                  <InputText
                    id="authorTitle"
                    v-model="v$.data.author_title.$model"
                    :class="{ 'p-invalid': v$.data.author_title.$error }"
                    type="text"
                    @blur="v$.data.author_title.$touch()"
                  />
                  <label>Author Title</label>
                </span>
                <small
                  class="p-error"
                  v-for="error of v$.data.author_title.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </div>
              <div class="p-field p-col-6">
                <span class="p-float-label">
                  <InputText
                    id="authorPosition"
                    v-model="v$.data.author_position.$model"
                    :class="{ 'p-invalid': v$.data.author_position.$error }"
                    type="text"
                    @blur="v$.data.author_position.$touch()"
                  />
                  <label>Author Position</label>
                </span>
                <small
                  class="p-error"
                  v-for="error of v$.data.author_position.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </div>
              <div class="p-field p-col-6 p-mt-1">
                <span class="p-float-label p-input-icon-left">
                  <Checkbox
                    id="isConsulting"
                    v-model="data.isConsulting"
                    :binary="true"
                  />
                  <label>Consulting</label>
                </span>
              </div>
              <div class="p-field p-col-12">
                <span class="p-float-label">
                  <Textarea
                    id="authorPosition"
                    v-model="v$.data.author_info.$model"
                    :autoResize="true"
                    :class="{ 'p-invalid': v$.data.author_info.$error }"
                    rows="7"
                    @blur="v$.data.author_info.$touch()"
                  />
                  <label>Author Info</label>
                </span>
                <small
                  class="p-error"
                  v-for="error of v$.data.author_info.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </div>
            </div>
          </div>
          <div class="p-col-4">
            <div class="p-col-12">
              <div class="p-field">
                <span class="p-float-label">
                  <InputText
                    id="authorId"
                    v-model="data.author_id"
                    class="disabled-input"
                    disabled
                    type="text"
                  />
                  <label>Author ID</label>
                </span>
              </div>
              <div class="p-text-center">
                <h4 class="p-mb-0">Author Profile Image</h4>
                <small>JPG - 1:1 - (800x800)</small>
              </div>
              <div class="p-d-flex p-col-12 p-justify-center">
                <img
                  :src="activeProfilePicUrl"
                  :class="[
                    'profile-pic p-shadow-4',
                    { 'image-error': v$.data.profilePicUrl.file.$error }
                  ]"
                />
              </div>
              <div class="p-text-center">
                <small
                  class="p-error"
                  v-for="error of v$.data.profilePicUrl.file.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </div>
              <div class="p-d-flex p-col-12 p-justify-center">
                <Button
                  label="Select Profile Image"
                  @click="toggleShow('authorProfilePicImage')"
                />
                <Cropper
                  v-model="authorProfilePicCropperShow"
                  :height="800"
                  :width="800"
                  :noSquare="true"
                  field="authorProfilePicImage"
                  img-format="jpg"
                  lang-type="en"
                  @crop-success="cropSuccess"
                ></Cropper>
              </div>
              <div class="p-text-center">
                <h4 class="p-mb-0">Author Header Image</h4>
                <small>JPG - 4:3 - (1000x750)</small>
              </div>
              <div class="p-d-flex p-col-12 p-justify-center">
                <img
                  :src="activeHeaderImageUrl"
                  :class="[
                    'header-image p-shadow-4',
                    { 'image-error': v$.data.headerImageUrl.file.$error }
                  ]"
                />
              </div>
              <div class="p-text-center">
                <small
                  class="p-error"
                  v-for="error of v$.data.headerImageUrl.file.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </div>
              <div class="p-d-flex p-col-12 p-justify-center">
                <Button
                  label="Select Header Image"
                  @click="toggleShow('authorHeaderImage')"
                />
                <Cropper
                  v-model="authorHeaderCropperShow"
                  :width="1000"
                  :height="750"
                  :noCircle="true"
                  field="authorHeaderImage"
                  img-format="jpg"
                  lang-type="en"
                  @crop-success="cropSuccess"
                ></Cropper>
              </div>
            </div>
          </div>
        </div>
      </base-card>
    </div>
  </div>
</template>

<script>
import utilities from '../../utilities/utilities'
import {
  required,
  requiredIf,
  minLength,
  maxLength
} from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

export default {
  props: ['authorId'],
  data() {
    return {
      data: {
        author_id: '',
        author_name: '',
        author_surname: '',
        author_label: '',
        author_title: '',
        author_info: '',
        author_position: '',
        headerImageUrl: {
          url: '',
          editedUrl: '',
          file: null
        },
        profilePicUrl: {
          url: '',
          editedUrl: '',
          file: null
        },
        isConsulting: false
      },
      authorHeaderCropperShow: false,
      authorProfilePicCropperShow: false
    }
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
      data: {
        author_name: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(20)
        },
        author_surname: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(20)
        },
        author_label: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(30)
        },
        author_title: {
          required,
          maxLength: maxLength(35)
        },
        author_info: {
          required,
          minLength: minLength(300),
          maxLength: maxLength(600)
        },
        author_position: {
          maxLength: maxLength(30)
        },
        profilePicUrl: {
          file: {
            requiredIf: requiredIf(this.$route.params.state === 'new')
          }
        },
        headerImageUrl: {
          file: {
            requiredIf: requiredIf(this.$route.params.state === 'new')
          }
        }
      }
    }
  },
  computed: {
    activeProfilePicUrl() {
      if (this.data.profilePicUrl.file) {
        return this.data.profilePicUrl.editedUrl
      } else if (this.data.profilePicUrl.url) {
        return this.$store.getters.getImageSourceURL(
          this.data.profilePicUrl.url
        )
      } else {
        return require('@/assets/placeholder1x1.jpg')
      }
    },
    activeHeaderImageUrl() {
      if (this.data.headerImageUrl.file) {
        return this.data.headerImageUrl.editedUrl
      } else if (this.data.headerImageUrl.url) {
        return this.$store.getters.getImageSourceURL(
          this.data.headerImageUrl.url
        )
      } else {
        return require('@/assets/placeholder4x3.jpg')
      }
    }
  },
  methods: {
    cropSuccess(imageDataURL, field) {
      console.log(field)
      utilities
        .convertUrlToFile(imageDataURL, field, 'image/jpg')
        .then((file) => {
          if (field === 'authorHeaderImage') {
            this.data.headerImageUrl.file = file
            this.data.headerImageUrl.editedUrl = imageDataURL
          } else {
            this.data.profilePicUrl.file = file
            this.data.profilePicUrl.editedUrl = imageDataURL
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    toggleShow(tag) {
      if (tag === 'authorHeaderImage') {
        this.authorHeaderCropperShow = !this.authorHeaderCropperShow
      } else {
        this.authorProfilePicCropperShow = !this.authorProfilePicCropperShow
      }
    },
    async saveData() {
      this.v$.$touch()
      if (this.v$.$error) return
      else {
        const result = await this.$store.dispatch('authors/saveAsDraft', {
          state: this.$route.params.state,
          authorData: this.data
        })
        if (result) {
          this.$router.back()
        } else {
          console.log('Author Save Error')
        }
      }
    },
    configure(object) {
      this.data.author_id = object.author_id
      this.data.author_name = object.author_name
      this.data.author_surname = object.author_surname
      this.data.author_label = object.author_label
      this.data.author_title = object.author_title
      this.data.author_info = object.author_info
      this.data.author_position = object.author_position
      this.data.headerImageUrl.url = object.headerImageUrl
      this.data.profilePicUrl.url = object.profilePicUrl
      this.data.isConsulting = object.isConsulting
    }
  },
  created() {
    const state = this.$route.params.state
    if (state === 'publish' || state === 'draft') {
      const data =
        state === 'publish'
          ? this.$store.getters['authors/getPublishedAuthorById'](this.authorId)
          : this.$store.getters['authors/getDraftedAuthorById'](this.authorId)
      this.configure(data)
    }
  }
}
</script>

<style scoped>
.profile-pic {
  border-radius: 50%;
  border-style: solid;
  border-width: 3px;
  border-color: white;
  width: 10rem;
  height: 10rem;
  object-fit: cover;
}

.header-image {
  border-radius: 20px;
  border-style: solid;
  border-width: 3px;
  border-color: white;
  width: 220px;
  height: 165px;
  object-fit: cover;
}
.image-error {
  border-color: #f44336;
}
</style>
