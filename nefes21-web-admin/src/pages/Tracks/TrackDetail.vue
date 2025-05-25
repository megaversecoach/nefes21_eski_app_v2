<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex p-jc-between p-mb-4">
          <h3 class="p-ml-3">Track Detail</h3>
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
          <div class="p-col-4">
            <div class="p-field p-col-12 p-mt-4">
              <span class="p-float-label">
                <InputText
                  v-model="v$.data.track_title.$model"
                  style="margin-top: 3px"
                  :class="{ 'p-invalid': v$.data.track_title.$error }"
                  type="text"
                  @blur="v$.data.track_title.$touch()"
                />
                <label>Track Title</label>
              </span>
              <small
                class="p-error"
                v-for="error of v$.data.track_title.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div class="p-field p-col-12 p-mb-0">
              <span class="p-float-label">
                <InputText
                  v-model="v$.data.track_label.$model"
                  :class="{ 'p-invalid': v$.data.track_label.$error }"
                  type="text"
                  @blur="v$.data.track_label.$touch()"
                />
                <label>Track Label</label>
              </span>
              <small
                class="p-error"
                v-for="error of v$.data.track_label.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div class="p-field p-col-12 p-mb-0">
              <label class="dropdown-label">Narrator</label>
              <Dropdown
                v-model="v$.data.narrator_id.$model"
                :options="narrators"
                optionLabel="narrator_id"
                optionValue="narrator_id"
                placeholder="Select Narrator..."
                @hide="v$.data.narrator_id.$touch()"
              >
                <template #option="slotProps">
                  <div>
                    <span>
                      {{ slotProps.option.narrator_id }} -
                      {{ slotProps.option.narrator_name }}
                      {{ slotProps.option.narrator_surname }}
                    </span>
                  </div>
                </template>
              </Dropdown>
              <small
                class="p-error"
                v-for="error of v$.data.narrator_id.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div class="p-field p-col-12 p-mt-4 p-mb-0">
              <span class="p-float-label">
                <InputText
                  id="track_duration"
                  v-model="data.track_duration"
                  disabled
                  class="disabled-input"
                  type="text"
                />
                <label>Track Duration</label>
              </span>
              <small
                class="p-error"
                v-for="error of v$.data.track_duration.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
          </div>
          <div class="p-col-4">
            <div class="p-field p-col-12 p-mb-0">
              <label class="dropdown-label">Track Validation</label>
              <Dropdown
                v-model="v$.data.track_isValid.$model"
                :options="isValidOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Validation..."
                @hide="v$.data.track_isValid.$touch()"
              />
              <small
                class="p-error"
                v-for="error of v$.data.track_isValid.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div class="p-field p-col-12 p-mb-0">
              <label class="dropdown-label">Track isFree</label>
              <Dropdown
                v-model="v$.data.track_isFree.$model"
                :options="isFreeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Free/Premium..."
                @hide="v$.data.track_isFree.$touch()"
              />
              <small
                class="p-error"
                v-for="error of v$.data.track_isFree.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div class="p-field p-col-12 p-mb-0">
              <label class="dropdown-label">Soundscape</label>
              <Dropdown
                v-model="v$.data.soundscape_id.$model"
                :options="soundscapes"
                optionLabel="soundscape_title"
                optionValue="soundscape_id"
                placeholder="Select Soundscape..."
                @hide="v$.data.soundscape_id.$touch()"
              >
                <template #option="slotProps">
                  <div>
                    <span style="margin-left: 0.5em; vertical-align: middle"
                      >{{ slotProps.option.soundscape_id }} -
                      {{ slotProps.option.soundscape_title }}
                    </span>
                  </div>
                </template>
              </Dropdown>
              <small
                class="p-error"
                v-for="error of v$.data.soundscape_id.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div>
              <div class="p-field p-col-12 p-mb-0">
                <label class="dropdown-label">Default Soundscape Volume</label>
                <div class="p-fluid p-grid">
                  <div class="p-col-9 p-mt-3">
                    <Slider
                      :min="0"
                      :max="100"
                      :step="5"
                      v-model="volume"
                      :modelValue="volume"
                      @change="convertVolume"
                    ></Slider>
                  </div>
                  <div class="p-col-3 p-mt-1">
                    <strong>{{ volume }}%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="p-col-4">
            <div class="p-field p-col-12 p-mt-4">
              <span class="p-float-label">
                <InputText
                  id="trackId"
                  v-model="data.track_id"
                  style="margin-top: 3px"
                  class="disabled-input"
                  disabled
                  type="text"
                />
                <label>Track ID</label>
              </span>
            </div>
            <div class="p-field p-col-12 p-mt-4">
              <span class="p-float-label">
                <InputText
                  id="sourceId"
                  v-model="data.source_id"
                  class="disabled-input"
                  disabled
                  type="text"
                />
                <label>Source ID</label>
              </span>
            </div>
            <div
              :class="[
                'p-col-12',
                { 'file-upload-error': v$.data.track_mp3.file.$error }
              ]"
            >
              <FileUpload
                :fileLimit="1"
                :maxFileSize="104857600"
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
                v-for="error of v$.data.track_mp3.file.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
          </div>
        </div>
      </base-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  maxLength,
  minLength,
  required,
  requiredIf
} from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import utilities from '../../utilities/utilities'

export default {
  props: ['contentId', 'state', 'trackId'],
  data() {
    return {
      data: {
        track_id: '',
        track_title: '',
        track_label: '',
        track_duration: null,
        track_isFree: '',
        orderInContent: null,
        content_id: this.contentId,
        narrator_id: '',
        soundscape_id: '',
        soundscape_volume: 0.15,
        source_id: '',
        track_isValid: '',
        track_version: null,

        track_mp3: {
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
      volume: 15,
      isFormValid: false
    }
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
      data: {
        track_title: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(40)
        },
        track_label: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(20)
        },
        narrator_id: { required },
        soundscape_id: { required },
        soundscape_volume: { required },
        track_isFree: { required },
        track_isValid: { required },
        track_duration: {
          requiredIf: requiredIf(this.$route.params.state === 'new')
        },
        track_mp3: {
          file: {
            requiredIf: requiredIf(this.$route.params.state === 'new')
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      soundscapes: 'soundScapes/getPublishedSoundscapes',
      narrators: 'narrators/getPublishedNarrators'
    })
  },
  methods: {
    checkData() {
      if (this.state === 'new') {
        if (this.data.track_mp3.file === null) {
          this.isFormValid = false
        }
      }
    },
    async saveData() {
      this.v$.$touch()
      if (this.v$.$error) return
      else {
        this.$store.dispatch('changeUploadingState', { uploadingState: true })

        if (this.state === 'new') {
          this.data.orderInContent = this.$store.getters['tracks/newTrackIndex']
        }
        const result = await this.$store.dispatch('tracks/saveAsDraft', {
          track: this.data,
          state: this.state
        })
        if (result) {
          this.$store.dispatch('changeUploadingState', {
            uploadingState: false
          })
          this.$router.back()
        } else {
          console.log('Track Save Error')
        }
      }
    },
    selectMp3(event) {
      this.data.track_mp3.file = event.files[0]
      utilities
        .totalDuration(this.data.track_mp3.file)
        .then((duration) => {
          console.log(duration)
          this.data.track_duration = parseInt(duration)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    convertVolume() {
      this.data.soundscape_volume = this.volume / 100
    },
    configure(object) {
      console.log(object)
      this.data.track_id = object.track_id
      this.data.track_title = object.track_title
      this.data.track_label = object.track_label
      this.data.track_duration = object.track_duration
      this.data.track_isFree = object.track_isFree
      this.data.orderInContent = object.orderInContent
      this.data.content_id = object.content_id
      this.data.narrator_id = object.narrator_id
      this.data.soundscape_id = object.soundscape_id
      this.data.soundscape_volume = object.soundscape_volume
      this.data.source_id = object.source_id
      this.data.track_isValid = object.track_isValid
      this.data.track_version = object.track_version

      this.volume = this.data.soundscape_volume * 100
    }
  },
  mounted() {
    if (this.state === 'publish' || this.state === 'draft') {
      const data =
        this.state === 'publish'
          ? this.$store.getters['tracks/getPublishedTrackById'](this.trackId)
          : this.$store.getters['tracks/getDraftedTrackById'](this.trackId)
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
.dropbox-label {
  font-size: 12px;
  color: #6c757d;
  line-height: 1;
  margin-left: 0.5rem;
}
.p-slider-horizontal {
  margin-left: 1rem;
}
</style>
