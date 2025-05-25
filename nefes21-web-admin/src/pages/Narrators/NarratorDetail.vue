<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex p-jc-between p-mb-4">
          <h3 class="p-ml-3">Narrator Detail</h3>
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
                    id="narratorName"
                    v-model="v$.data.narrator_name.$model"
                    :class="{ 'p-invalid': v$.data.narrator_name.$error }"
                    type="text"
                    @blur="v$.data.narrator_name.$touch()"
                  />
                  <label>Narrator Name</label>
                </span>
                <small
                  class="p-error"
                  v-for="error of v$.data.narrator_name.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </div>
              <div class="p-field p-col-6">
                <span class="p-float-label">
                  <InputText
                    id="narratorSurname"
                    v-model="v$.data.narrator_surname.$model"
                    :class="{ 'p-invalid': v$.data.narrator_surname.$error }"
                    type="text"
                  />
                  <label>Narrator Surname</label>
                </span>
                <small
                  class="p-error"
                  v-for="error of v$.data.narrator_surname.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </div>
              <div class="p-field p-col-6">
                <span class="p-float-label">
                  <InputText
                    id="narratorTitle"
                    v-model="v$.data.narrator_title.$model"
                    :class="{ 'p-invalid': v$.data.narrator_title.$error }"
                    type="text"
                  />
                  <label>Narrator Title</label>
                </span>
                <small
                  class="p-error"
                  v-for="error of v$.data.narrator_title.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </div>
              <div class="p-field p-col-12">
                <span class="p-float-label">
                  <Textarea
                    id="narratorInfo"
                    v-model="v$.data.narrator_info.$model"
                    :autoResize="true"
                    :class="{ 'p-invalid': v$.data.narrator_info.$error }"
                    rows="5"
                  />
                  <label>Narrator Info</label>
                </span>
                <small
                  class="p-error"
                  v-for="error of v$.data.narrator_info.$errors"
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
                    id="contentId"
                    v-model="data.narrator_id"
                    class="disabled-input"
                    disabled
                    type="text"
                  />
                  <label>Narrator ID</label>
                </span>
              </div>

              <div class="p-text-center">
                <h4 class="p-mb-0">Narrator Profile Image</h4>
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
                <Button label="Select Profile Image" @click="toggleShow" />
                <Cropper
                  v-model="profilePicUrlCropperShow"
                  :height="800"
                  :width="800"
                  :noSquare="true"
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
  props: ['narratorId'],
  data() {
    return {
      data: {
        narrator_name: '',
        narrator_surname: '',
        narrator_title: '',
        narrator_info: '',
        narrator_id: '',
        profilePicUrl: {
          url: '',
          editedUrl: '',
          file: null
        }
      },
      profilePicUrlCropperShow: false,
      isFormValid: false
    }
  },
  setup: () => ({ v$: useVuelidate() }),
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
    }
  },
  validations() {
    return {
      data: {
        narrator_name: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(20)
        },
        narrator_surname: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(20)
        },
        narrator_title: { required, maxLength: maxLength(35) },
        narrator_info: {
          required,
          minLength: minLength(100),
          maxLength: maxLength(300)
        },
        profilePicUrl: {
          file: {
            requiredIf: requiredIf(this.$route.params.state === 'new')
          }
        }
      }
    }
  },
  methods: {
    cropSuccess(imageDataURL) {
      utilities
        .convertUrlToFile(imageDataURL, 'profilePicUrl', 'image/jpg')
        .then((file) => {
          this.data.profilePicUrl.editedUrl = imageDataURL
          this.data.profilePicUrl.file = file
        })
        .catch((err) => {
          console.log(err)
        })
    },
    toggleShow() {
      this.profilePicUrlCropperShow = !this.profilePicUrlCropperShow
    },
    async saveData() {
      this.v$.$touch()
      if (this.v$.$error) return
      else {
        const result = await this.$store.dispatch('narrators/saveAsDraft', {
          state: this.$route.params.state,
          narratorData: this.data
        })
        if (result) {
          this.$router.back()
        } else {
          console.log('Narrator Save Error')
        }
      }
    },
    configure(object) {
      this.data.narrator_id = object.narrator_id
      this.data.narrator_name = object.narrator_name
      this.data.narrator_surname = object.narrator_surname
      this.data.narrator_info = object.narrator_info
      this.data.narrator_title = object.narrator_title
      this.data.profilePicUrl.url = object.profilePicUrl
    }
  },
  created() {
    const state = this.$route.params.state
    if (state === 'publish' || state === 'draft') {
      const data =
        state === 'publish'
          ? this.$store.getters['narrators/getPublishedNarratorById'](
              this.narratorId
            )
          : this.$store.getters['narrators/getDraftedNarratorsById'](
              this.narratorId
            )
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
  width: 200px;
  height: 150px;
  object-fit: cover;
}
.image-error {
  border-color: #f44336;
}
</style>
