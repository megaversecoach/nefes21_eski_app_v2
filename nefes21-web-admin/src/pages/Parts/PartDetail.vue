<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex p-jc-between p-mb-4">
          <h3 class="p-ml-3">Part Detail</h3>
          <div>
            <Button
              class="p-button-secondary p-mr-4"
              icon="pi pi-times"
              :label="isStatePublished ? 'Back' : 'Discard'"
              @click="$router.back()"
            />
            <Button
              v-if="!isStatePublished"
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
                  v-model="v$.data.part_title.$model"
                  style="margin-top: 3px"
                  :class="{
                    'p-invalid': v$.data.part_title.$error,
                    'disabled-input': isStatePublished
                  }"
                  :disabled="isStatePublished"
                  type="text"
                  @blur="v$.data.part_title.$touch()"
                />
                <label>Part Title</label>
              </span>
              <small
                class="p-error"
                v-for="error of v$.data.part_title.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div class="p-field p-col-12 p-mb-0">
              <span class="p-float-label">
                <InputText
                  v-model="v$.data.part_label.$model"
                  :class="{
                    'p-invalid': v$.data.part_label.$error,
                    'disabled-input': isStatePublished
                  }"
                  :disabled="isStatePublished"
                  type="text"
                  @blur="v$.data.part_label.$touch()"
                />
                <label>Part Label</label>
              </span>
              <small
                class="p-error"
                v-for="error of v$.data.part_label.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div class="p-field p-col-12">
              <label class="dropdown-label">Part Type</label>
              <Dropdown
                v-model="data.part_type"
                class="disabled-input"
                disabled
                :options="partTypeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Part Type..."
              />
            </div>
            <div v-if="!isPartTypeQuest" class="p-field p-col-12 p-mb-0">
              <span class="p-float-label">
                <InputText
                  v-model="v$.data.part_duration.$model"
                  :class="[
                    'disabled-input',
                    { 'p-invalid': v$.data.part_duration.$error }
                  ]"
                  disabled
                  type="text"
                />
                <label>Part Duration</label>
              </span>
              <small
                class="p-error"
                v-for="error of v$.data.part_duration.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div v-if="isPartTypeQuest" class="p-field p-col-12 p-mb-0">
              <span class="p-float-label">
                <Textarea
                  v-model="v$.data.quest_information.$model"
                  :class="{
                    'p-invalid': v$.data.quest_information.$error,
                    'disabled-input': isStatePublished
                  }"
                  :disabled="isStatePublished"
                  type="text"
                  rows="4"
                  :autoResize="true"
                  @blur="v$.data.quest_information.$touch()"
                />
                <label>Quest Information</label>
              </span>
              <small
                class="p-error"
                v-for="error of v$.data.quest_information.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
          </div>
          <div class="p-col-4">
            <div :class="['p-field p-col-12', { 'p-mb-0': !isPartTypeQuest }]">
              <label class="dropdown-label">Part Validation</label>
              <Dropdown
                v-model="v$.data.part_isValid.$model"
                :class="{
                  'p-invalid': v$.data.part_isValid.$error,
                  'disabled-input': isStatePublished
                }"
                :disabled="isStatePublished"
                :options="isValidOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Validation..."
                @hide="v$.data.part_isValid.$touch()"
              />
              <small
                class="p-error"
                v-for="error of v$.data.part_isValid.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div v-if="!isPartTypeQuest" class="p-field p-col-12 p-mb-0">
              <label class="dropdown-label">Soundscape</label>
              <Dropdown
                v-model="v$.data.soundscape_id.$model"
                :class="{
                  'p-invalid': v$.data.soundscape_id.$error,
                  'disabled-input': isStatePublished
                }"
                :disabled="isStatePublished"
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
            <div v-if="!isPartTypeQuest" class="p-field p-col-12 p-mb-0">
              <label class="dropdown-label">Default Soundscape Volume</label>
              <div class="p-fluid p-grid">
                <div class="p-col-9 p-mt-3">
                  <Slider
                    :min="0"
                    :max="100"
                    :step="5"
                    v-model="volume"
                    :modelValue="volume"
                    :disabled="isStatePublished"
                    @change="convertVolume"
                  ></Slider>
                </div>
                <div class="p-col-3 p-mt-1">
                  <strong>{{ volume }}%</strong>
                </div>
              </div>
            </div>
            <div v-if="isPartTypeQuest" class="p-field p-col-12">
              <span class="p-float-label">
                <InputText
                  v-model="v$.data.quest_title.$model"
                  :class="{
                    'p-invalid': v$.data.quest_title.$error,
                    'disabled-input': isStatePublished
                  }"
                  :disabled="isStatePublished"
                  type="text"
                  @blur="v$.data.quest_title.$touch()"
                />
                <label>Quest Title</label>
              </span>
              <small
                class="p-error"
                v-for="error of v$.data.quest_title.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div v-if="isPartTypeQuest" class="p-field p-col-12 p-mb-0">
              <span class="p-float-label">
                <Textarea
                  v-model="v$.data.quest_description.$model"
                  :class="{
                    'p-invalid': v$.data.quest_description.$error,
                    'disabled-input': isStatePublished
                  }"
                  :disabled="isStatePublished"
                  type="text"
                  rows="8"
                  :autoResize="true"
                  @blur="v$.data.quest_description.$touch()"
                />
                <label>Quest Description</label>
              </span>
              <small
                class="p-error"
                v-for="error of v$.data.quest_description.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
          </div>
          <div class="p-col-4">
            <div class="p-field p-col-12 p-mt-4">
              <span class="p-float-label">
                <InputText
                  id="partId"
                  v-model="data.part_id"
                  class="disabled-input"
                  disabled
                  type="text"
                />
                <label>Part ID</label>
              </span>
            </div>
            <div class="p-field p-col-12">
              <span class="p-float-label">
                <InputText
                  id="partVersion"
                  v-model="data.part_version"
                  class="disabled-input"
                  disabled
                  type="text"
                />
                <label>Part Version</label>
              </span>
            </div>
            <div class="p-field p-col-12">
              <span class="p-float-label">
                <InputText
                  id="sectionId"
                  v-model="data.section_id"
                  class="disabled-input"
                  disabled
                  type="text"
                />
                <label>Section Id</label>
              </span>
            </div>
            <div
              v-if="!isStatePublished && isPartTypeAudio"
              :class="[
                'p-col-12',
                { 'file-upload-error': v$.data.part_mp3.file.$error }
              ]"
            >
              <h4 class="p-mt-0 p-mb-0">Part Audio</h4>
              <small>MP3</small>
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
                v-for="error of v$.data.part_mp3.file.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div
              v-if="!isStatePublished && isPartTypeVideo"
              :class="[
                'p-col-12',
                { 'file-upload-error': v$.data.part_mp4.file.$error }
              ]"
            >
              <h4 class="p-mt-0 p-mb-0">Part Video</h4>
              <small>MP4 - 16:9 - (min720p)</small>
              <FileUpload
                :fileLimit="1"
                :maxFileSize="2004857600"
                :multiple="false"
                :showUploadButton="false"
                :showCancelButton="false"
                accept="video/mp4"
                @select="selectMp4"
              >
                <template #empty>
                  <p>Drag and drop mp4 to here to upload.</p>
                </template>
              </FileUpload>
              <small
                class="p-error"
                v-for="error of v$.data.part_mp4.file.$errors"
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
import { mapGetters, mapActions } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import {
  maxLength,
  minLength,
  required,
  requiredIf
} from '@vuelidate/validators'
import utilities from '@/utilities/utilities'

export default {
  props: ['state', 'programId', 'sectionId', 'partState', 'partType', 'partId'],
  data() {
    return {
      data: {
        part_id: '',
        part_title: '',
        part_label: '',
        part_duration: null,
        part_type: this.partType,
        quest_title: '',
        quest_description: '',
        quest_information: '',
        orderInSection: null,
        section_id: this.sectionId,
        program_id: this.programId,
        soundscape_id: '',
        soundscape_volume: 0.15,
        part_isValid: '',
        part_version: 0,

        part_mp3: {
          file: null
        },
        part_mp4: {
          file: null
        }
      },
      isValidOptions: [
        { label: 'Valid', value: true },
        { label: 'Invalid', value: false }
      ],
      partTypeOptions: [
        { label: 'Audio', value: 'audio' },
        { label: 'Video', value: 'video' },
        { label: 'Quest', value: 'quest' }
      ],
      volume: 15
    }
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    if (this.isPartTypeQuest) {
      return {
        data: {
          part_title: {
            required,
            minLength: minLength(5),
            maxLength: maxLength(50)
          },
          part_label: {
            required,
            minLength: minLength(2),
            maxLength: maxLength(20)
          },
          part_isValid: { required },

          quest_title: {
            required,
            minLength: minLength(2),
            maxLength: maxLength(30)
          },
          quest_description: {
            required,
            minLength: minLength(50),
            maxLength: maxLength(250)
          },
          quest_information: {
            required,
            minLength: minLength(10),
            maxLength: maxLength(90)
          }
        }
      }
    } else {
      return {
        data: {
          part_title: {
            required,
            minLength: minLength(5),
            maxLength: maxLength(50)
          },
          part_label: {
            required,
            minLength: minLength(2),
            maxLength: maxLength(20)
          },
          part_isValid: { required },

          part_duration: { required },
          soundscape_id: { required },
          soundscape_volume: { required },

          part_mp3: {
            file: {
              requiredIf: requiredIf(this.isPartTypeAudio && this.isPartNew)
            }
          },
          part_mp4: {
            file: {
              requiredIf: requiredIf(this.isPartTypeVideo && this.isPartNew)
            }
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      soundscapes: 'soundScapes/getDefaultSoundscapeOptions',
      getPublishedPartByPartId: 'parts/getPublishedPartById',
      getDraftedPartByPartId: 'parts/getDraftedPartById',
      newPartIndex: 'parts/newPartIndex'
    }),
    isPartNew() {
      return this.partState === 'new'
    },
    isPartTypeQuest() {
      return this.partType === 'quest'
    },
    isPartTypeAudio() {
      return this.partType === 'audio'
    },
    isPartTypeVideo() {
      return this.partType === 'video'
    },
    isStatePublished() {
      return this.state === 'publish'
    }
  },
  methods: {
    ...mapActions({
      savePartAsDraft: 'parts/savePartAsDraft'
    }),
    convertVolume() {
      this.data.soundscape_volume = this.volume / 100
    },
    selectMp3(event) {
      this.data.part_mp3.file = event.files[0]
      utilities
        .totalDuration(this.data.part_mp3.file)
        .then((duration) => {
          console.log('Mp3 Duration: ', duration)
          this.data.part_duration = parseInt(duration)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    selectMp4(event) {
      this.data.part_mp4.file = event.files[0]
      utilities
        .totalDuration(this.data.part_mp4.file)
        .then((duration) => {
          console.log('Mp4 Duration: ', duration)
          this.data.part_duration = parseInt(duration)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async saveData() {
      this.v$.$touch()
      if (this.v$.$error) return
      else {
        this.$store.dispatch('changeUploadingState', { uploadingState: true })
        if (this.isPartNew) {
          this.data.orderInSection = this.newPartIndex(this.data.section_id)
        }
        const result = await this.savePartAsDraft({
          part: this.data,
          state: this.partState
        })
        if (result) {
          this.$store.dispatch('changeUploadingState', {
            uploadingState: false
          })
          this.$router.back()
        } else {
          console.log('Part Save Error')
        }
      }
    },
    configure(object) {
      this.data.part_id = object.part_id
      this.data.part_title = object.part_title
      this.data.part_label = object.part_label
      this.data.part_duration = object.part_duration
      this.data.part_type = object.part_type
      this.data.quest_title = object.quest_title
      this.data.quest_description = object.quest_description
      this.data.quest_information = object.quest_information
      this.data.orderInSection = object.orderInSection
      this.data.section_id = object.section_id
      this.data.program_id = object.program_id
      this.data.soundscape_id = object.soundscape_id
      this.data.soundscape_volume = object.soundscape_volume
      this.data.part_isValid = object.part_isValid
      this.data.part_version = object.part_version

      this.volume = this.data.soundscape_volume * 100
    }
  },
  created() {
    if (!this.isPartNew) {
      if (this.isStatePublished) {
        const data = this.getPublishedPartByPartId(this.partId)
        this.configure(data)
      } else {
        const data = this.getDraftedPartByPartId(this.partId)
        this.configure(data)
      }
    } else if (this.isPartTypeQuest) {
      this.data.part_duration = 0
    }
  }
}
</script>
