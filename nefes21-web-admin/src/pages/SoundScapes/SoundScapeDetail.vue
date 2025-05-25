<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex p-jc-between p-mb-4">
          <h3 class="p-ml-3">Soundscape Detail</h3>
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
          <div class="p-col-6">
            <div class="p-field p-col-12 p-mb-0">
              <span class="p-float-label">
                <InputText
                  id="soundscapeTitle"
                  v-model="v$.data.soundscape_title.$model"
                  :class="{ 'p-invalid': v$.data.soundscape_title.$error }"
                  type="text"
                  @blur="v$.data.soundscape_title.$touch()"
                />
                <label>Soundscape Title</label>
              </span>
              <small
                class="p-error"
                v-for="error of v$.data.soundscape_title.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div class="p-field p-col-12 p-mb-0">
              <label class="dropdown-label">Soundscape Validation</label>
              <Dropdown
                id="soundscapeIsValid"
                v-model="v$.data.soundscape_isValid.$model"
                :class="{ 'p-invalid': v$.data.soundscape_isValid.$error }"
                :options="isValidOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Validation..."
                @hide="v$.data.soundscape_isValid.$touch()"
              >
              </Dropdown>
              <small
                class="p-error"
                v-for="error of v$.data.soundscape_isValid.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div class="p-field p-col-12">
              <label class="dropdown-label">Soundscape Free/Premium</label>
              <Dropdown
                id="soundscapeIsFree"
                v-model="v$.data.soundscape_isFree.$model"
                :class="{ 'p-invalid': v$.data.soundscape_isFree.$error }"
                :options="isFreeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Free/Premium..."
                @hide="v$.data.soundscape_isFree.$touch()"
              />
              <small
                class="p-error"
                v-for="error of v$.data.soundscape_isFree.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div
              :class="[
                'p-col-12',
                { 'file-upload-error': v$.data.soundscape_mp3.file.$error }
              ]"
            >
              <FileUpload
                :fileLimit="1"
                :maxFileSize="10485760"
                :multiple="false"
                :showUploadButton="false"
                :showCancelButton="false"
                accept="audio/mp3"
                @select="selectMp3"
              >
                <template #empty>
                  <p>Drag and drop mp3 to here to upload.</p>
                </template>
              </FileUpload>
              <small
                class="p-error"
                v-for="error of v$.data.soundscape_mp3.file.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
          </div>
          <div class="p-col-6">
            <div class="p-field p-col-12">
              <span class="p-float-label">
                <InputText
                  id="soundscapeId"
                  v-model="data.soundscape_id"
                  class="disabled-input"
                  disabled
                  type="text"
                />
                <label>Soundscape ID</label>
              </span>
            </div>
            <div class="p-text-center">
              <h4 class="p-mb-0">Cover Image</h4>
              <small>JPG - 1:1 - (1000x1000)</small>
            </div>
            <div class="p-d-flex p-col-12 p-justify-center">
              <img
                :src="activeCoverImageUrl"
                :class="[
                  'profile-pic p-shadow-4',
                  { 'image-error': v$.data.coverImageUrl.file.$error }
                ]"
              />
            </div>
            <div class="p-text-center">
              <small
                class="p-error"
                v-for="error of v$.data.coverImageUrl.file.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div class="p-d-flex p-col-12 p-justify-center">
              <Button label="Select Cover Image" @click="toggleShow" />
              <Cropper
                v-model="cropperShow"
                :height="1000"
                :width="1000"
                :noSquare="false"
                field="coverImage"
                img-format="jpg"
                lang-type="en"
                @crop-success="cropSuccess"
              ></Cropper>
            </div>
          </div>
        </div>
      </base-card>
    </div>
  </div>
</template>

<script>
import {
  maxLength,
  minLength,
  required,
  requiredIf
} from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import utilities from '../../utilities/utilities'

export default {
  props: ['soundscapeId'],
  data() {
    return {
      data: {
        soundscape_id: '',
        soundscape_title: '',
        coverImageUrl: {
          url: '',
          editedUrl: '',
          file: null
        },
        soundscape_isFree: '',
        soundscape_isValid: '',
        soundscape_mp3: {
          file: null
        }
      },
      isValidOptions: [
        { label: 'Valid', value: true },
        { label: 'Invalid', value: false }
      ],
      isFreeOptions: [
        { label: 'Free', value: true },
        { label: 'Premium', value: false }
      ],
      cropperShow: false
    }
  },
  computed: {
    activeCoverImageUrl() {
      if (this.data.coverImageUrl.file) {
        return this.data.coverImageUrl.editedUrl
      } else if (this.data.coverImageUrl.url) {
        return this.$store.getters.getImageSourceURL(
          this.data.coverImageUrl.url
        )
      } else {
        return require('@/assets/placeholder1x1.jpg')
      }
    }
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
      data: {
        soundscape_title: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(10)
        },
        soundscape_isFree: { required },
        soundscape_isValid: { required },
        coverImageUrl: {
          file: {
            requiredIf: requiredIf(this.$route.params.state === 'new')
          }
        },
        soundscape_mp3: {
          file: {
            requiredIf: requiredIf(this.$route.params.state === 'new')
          }
        }
      }
    }
  },
  methods: {
    selectMp3(event) {
      this.data.soundscape_mp3.file = event.files[0]
    },
    cropSuccess(imageDataURL, field) {
      console.log(field)
      utilities
        .convertUrlToFile(imageDataURL, field, 'image/jpg')
        .then((file) => {
          this.data.coverImageUrl.file = file
          this.data.coverImageUrl.editedUrl = imageDataURL
        })
        .catch((err) => {
          console.log(err)
        })
    },
    toggleShow() {
      this.cropperShow = !this.cropperShow
    },
    configure(object) {
      console.log(object)
      this.data.soundscape_id = object.soundscape_id
      this.data.soundscape_title = object.soundscape_title
      this.data.coverImageUrl.url = object.coverImageUrl
      this.data.soundscape_isFree = object.soundscape_isFree
      this.data.soundscape_isValid = object.soundscape_isValid
    },
    async saveData() {
      this.v$.$touch()
      if (this.v$.$error) return
      else {
        const result = await this.$store.dispatch('soundScapes/saveAsDraft', {
          state: this.$route.params.state,
          soundScapeData: this.data
        })
        if (result) {
          this.$router.back()
        } else {
          console.log('Soundscape Save Error')
        }
      }
    }
  },
  created() {
    const state = this.$route.params.state
    if (state === 'publish' || state === 'draft') {
      const data =
        state === 'publish'
          ? this.$store.getters['soundScapes/getPublishedSoundscapeById'](
              this.soundscapeId
            )
          : this.$store.getters['soundScapes/getDraftedSoundscapeById'](
              this.soundscapeId
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
  width: 15rem;
  height: 15rem;
  object-fit: cover;
}
.image-error {
  border-color: #f44336;
}
.file-upload-error {
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  border-color: #f44336;
}
.dropdown-label {
  margin-bottom: 0.4rem;
  margin-left: 0.5rem;
  color: #6c757d;
  font-size: 12px;
}
</style>
