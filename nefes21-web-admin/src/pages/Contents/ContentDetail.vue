<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex p-jc-between p-mb-4">
          <h3 class="p-ml-3">Content Detail</h3>
          <div>
            <Button
              class="p-button-secondary p-mr-4"
              :icon="isStatePublished ? 'pi pi-angle-left' : 'pi pi pi-times'"
              :label="isStatePublished ? 'Back' : 'Discard'"
              @click="$router.back()"
            />
            <Button
              v-if="!isStatePublished"
              icon="pi pi-check"
              label="Save As Draft"
              @click="saveAsDraft"
            />
            <Button
              v-if="isStatePublished && !isContentExistsOnDraft"
              class="p-button"
              label="Move Content to Draft"
              @click="moveToDraft"
            />
            <small
              class="p-error"
              v-if="isStatePublished && isContentExistsOnDraft"
            >
              Content is already in Draft! Please go to
              <strong>Drafted Contents</strong> Section to edit.
            </small>
          </div>
        </div>

        <div class="p-fluid p-grid">
          <div class="p-col-8">
            <div class="p-grid">
              <div class="p-col-6">
                <div class="p-field p-col-12 p-mt-4 p-mb-0">
                  <span class="p-float-label">
                    <InputText
                      id="contentTitle"
                      style="margin-top: 3px"
                      v-model="v$.data.content_title.$model"
                      :class="{
                        'p-invalid': v$.data.content_title.$error,
                        'disabled-input': isStatePublished
                      }"
                      :disabled="isStatePublished"
                      @blur="v$.data.content_title.$touch()"
                    />
                    <label>Content Title</label>
                  </span>
                  <small
                    class="p-error"
                    v-for="error of v$.data.content_title.$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}
                  </small>
                </div>

                <div class="p-field p-col-12 p-mb-0">
                  <label class="dropdown-label">Content Type</label>
                  <Dropdown
                    v-model="v$.data.content_type_id.$model"
                    :class="{
                      'p-invalid': v$.data.content_type_id.$error,
                      'disabled-input': isStatePublished
                    }"
                    :disabled="isStatePublished"
                    :options="contentTypes"
                    optionLabel="content_type_id"
                    optionValue="content_type_id"
                    placeholder="Select Content Type..."
                    @hide="v$.data.content_type_id.$touch()"
                  >
                    <template #option="slotProps">
                      <div>
                        <span
                          :style="
                            'margin-left: 0.5em; color: white; background:' +
                            getContentTypeColorById(
                              slotProps.option.content_type_id
                            )
                          "
                          class="badge"
                        >
                          {{ slotProps.option.content_type_id }}
                        </span>
                      </div>
                    </template>
                  </Dropdown>
                  <small
                    class="p-error"
                    v-for="error of v$.data.content_type_id.$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}
                  </small>
                </div>
                <div class="p-field p-col-12 p-mb-0">
                  <label class="dropdown-label">Author</label>
                  <Dropdown
                    v-model="v$.data.author_id.$model"
                    :class="{
                      'p-invalid': v$.data.author_id.$error,
                      'disabled-input': isStatePublished
                    }"
                    :disabled="isStatePublished"
                    :options="authors"
                    optionLabel="author_label"
                    optionValue="author_id"
                    placeholder="Select Author..."
                    @hide="v$.data.author_id.$touch()"
                  >
                    <template #option="slotProps">
                      <div>
                        <span style="margin-left: 0.5em; vertical-align: middle"
                          >{{ slotProps.option.author_id }} -
                          {{ slotProps.option.author_label }}</span
                        >
                      </div>
                    </template>
                  </Dropdown>

                  <small
                    class="p-error"
                    v-for="error of v$.data.author_id.$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}
                  </small>
                </div>
                <div class="p-field p-col-12 p-mb-0">
                  <label class="dropdown-label">Age Segment</label>
                  <Dropdown
                    v-model="v$.data.ageSegment.$model"
                    :class="{
                      'p-invalid': v$.data.ageSegment.$error,
                      'disabled-input': isStatePublished
                    }"
                    :disabled="isStatePublished"
                    :options="ageSegmentOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Age Segment..."
                    @hide="v$.data.ageSegment.$touch()"
                  />

                  <small
                    class="p-error"
                    v-for="error of v$.data.ageSegment.$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}
                  </small>
                </div>
              </div>
              <div class="p-col-6">
                <div class="p-field p-col-12 p-mb-0">
                  <label class="dropdown-label">Content Validation</label>
                  <Dropdown
                    v-model="v$.data.content_isValid.$model"
                    :class="{
                      'p-invalid': v$.data.content_isValid.$error,
                      'disabled-input': isStatePublished
                    }"
                    :disabled="isStatePublished"
                    :options="isValidOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Validation..."
                    @hide="v$.data.content_isValid.$touch()"
                  />
                  <small
                    class="p-error"
                    v-for="error of v$.data.content_isValid.$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}
                  </small>
                </div>
                <div class="p-field p-col-12 p-mb-0">
                  <label class="dropdown-label">Content isFree</label>
                  <Dropdown
                    v-model="data.content_isFree"
                    :class="{
                      'disabled-input': isStatePublished
                    }"
                    :options="isFreeOptions"
                    disabled
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Free/Premium..."
                  />
                </div>
                <div class="p-field p-col-12 p-mb-0">
                  <label class="dropdown-label">Content isNew</label>
                  <Dropdown
                    v-model="v$.data.content_isNew.$model"
                    :class="{
                      'p-invalid': v$.data.content_isNew.$error,
                      'disabled-input': isStatePublished
                    }"
                    :disabled="isStatePublished"
                    :options="isNewOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select New State..."
                    @hide="v$.data.content_isNew.$touch()"
                  />
                  <small
                    class="p-error"
                    v-for="error of v$.data.content_isNew.$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}
                  </small>
                </div>
                <div class="p-field p-col-12 p-mb-0">
                  <label class="dropdown-label">Gender Segment</label>
                  <Dropdown
                    v-model="v$.data.genderSegment.$model"
                    :class="{
                      'p-invalid': v$.data.genderSegment.$error,
                      'disabled-input': isStatePublished
                    }"
                    :disabled="isStatePublished"
                    :options="genderSegmentOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Gender Segment"
                    @hide="v$.data.genderSegment.$touch()"
                  />
                  <small
                    class="p-error"
                    v-for="error of v$.data.genderSegment.$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}
                  </small>
                </div>
              </div>
            </div>
            <div class="p-col-12 p-mt-3">
              <span class="p-float-label">
                <Textarea
                  id="contentDescription"
                  v-model="v$.data.content_description.$model"
                  :class="{
                    'p-invalid': v$.data.content_description.$error,
                    'disabled-input': isStatePublished
                  }"
                  :disabled="isStatePublished"
                  :autoResize="true"
                  rows="8"
                  @blur="v$.data.content_description.$touch()"
                />
                <label>Content Description</label>
              </span>
              <small
                class="p-error"
                v-for="error of v$.data.content_description.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div class="p-col-12">
              <div class="p-grid p-mt-3">
                <div class="p-field p-col-3">
                  <span class="p-float-label">
                    <InputText
                      id="contentDuration"
                      v-model="data.content_duration"
                      class="disabled-input"
                      disabled
                      type="text"
                    />
                    <label>Content Duration</label>
                  </span>
                </div>
                <div class="p-field p-col-3">
                  <span class="p-float-label">
                    <InputText
                      id="isMultiTrack"
                      v-model="data.isMultiTrack"
                      class="disabled-input"
                      disabled
                      type="text"
                    />
                    <label>is MultiTrack</label>
                  </span>
                </div>
                <div class="p-field p-col-3">
                  <span class="p-float-label">
                    <InputText
                      id="dateCreated"
                      v-model="data.dateCreated"
                      class="disabled-input"
                      disabled
                      type="text"
                    />
                    <label>Creation Date</label>
                  </span>
                </div>
                <div class="p-field p-col-3">
                  <span class="p-float-label">
                    <InputText
                      id="datePublished"
                      v-model="data.datePublished"
                      class="disabled-input"
                      disabled
                      type="text"
                    />
                    <label>Publish Date</label>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="p-col-4">
            <div class="p-d-flex p-mt-4">
              <div class="p-col-6">
                <div class="p-field">
                  <span class="p-float-label">
                    <InputText
                      id="content_id"
                      v-model="data.content_id"
                      class="disabled-input"
                      disabled
                      type="text"
                    />
                    <label>Content ID</label>
                  </span>
                </div>
              </div>
              <div class="p-col-6">
                <div class="p-field">
                  <span class="p-float-label">
                    <InputText
                      id="content_version"
                      v-model="data.content_version"
                      class="disabled-input"
                      disabled
                      type="text"
                    />
                    <label>Content Version</label>
                  </span>
                </div>
              </div>
            </div>
            <div class="p-text-center">
              <h4 class="p-mt-0 p-mb-0">Cover Image</h4>
              <small>JPG - 4:3 - (1000x750)</small>
              <div class="p-d-flex p-col-12 p-justify-center">
                <img
                  :src="activeCoverImageUrl"
                  :class="[
                    'cover-image p-shadow-4',
                    { 'image-error': v$.data.coverImageUrl.file.$error }
                  ]"
                />
              </div>
              <small
                class="p-error"
                v-for="error of v$.data.coverImageUrl.file.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
              <div class="p-d-flex p-col-12 p-justify-center">
                <Button
                  v-if="!isStatePublished && !isContentExistsOnDraft"
                  label="Select Cover Image"
                  @click="toggleCoverImageCropper"
                />
                <Cropper
                  v-model="coverImageCropperShow"
                  :width="1000"
                  :height="750"
                  :noSquare="false"
                  :noCircle="true"
                  field="coverImage"
                  img-format="jpg"
                  lang-type="en"
                  @crop-success="cropSuccess"
                />
              </div>
              <h4 class="p-mt-3 p-mb-0">Showcase Image</h4>
              <small>JPG - 4:3 - (2000x1500)</small>
              <div class="p-d-flex p-col-12 p-justify-center">
                <img
                  :src="activeShowcaseImageUrl"
                  :class="[
                    'cover-image p-shadow-4',
                    { 'image-error': v$.data.showcaseImageUrl.file.$error }
                  ]"
                />
              </div>
              <small
                class="p-error"
                v-for="error of v$.data.showcaseImageUrl.file.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
              <div class="p-d-flex p-col-12 p-justify-center">
                <Button
                  v-if="!isStatePublished && !isContentExistsOnDraft"
                  label="Select Showcase Image"
                  @click="toggleShowcaseImageCropper"
                />
                <Cropper
                  v-model="showcaseImageCropperShow"
                  :width="2000"
                  :height="1500"
                  :noSquare="false"
                  :noCircle="true"
                  field="showcaseImage"
                  img-format="jpg"
                  lang-type="en"
                  @crop-success="cropSuccess"
                ></Cropper>
              </div>
            </div>
          </div>
        </div>
      </base-card>
      <track-list
        v-if="isTrackShow"
        :content="trackData.content"
        :drafted-tracks="trackData.tracks"
        :is-draggable="false"
        :isEditTrackAllowed="trackData.isEditTrackAllowed"
        :narrators="trackData.narrators"
        :soundscapes="trackData.soundscapes"
        :state="trackData.state"
        :title="trackData.title"
      ></track-list>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TrackList from '../../components/TrackList'

import {
  maxLength,
  minLength,
  required,
  requiredIf
} from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import utilities from '../../utilities/utilities'

export default {
  components: { TrackList },
  props: ['contentId'],
  data() {
    return {
      data: {
        content_id: '',
        content_title: '',
        content_description: '',
        content_type_id: '',
        isMultiTrack: false,
        content_duration: 0,
        author_id: '',
        coverImageUrl: {
          url: '',
          editedUrl: '',
          file: null
        },
        showcaseImageUrl: {
          url: '',
          editedUrl: '',
          file: null
        },
        content_isFree: false,
        content_isNew: '',
        ageSegment: 'general',
        genderSegment: 'general',
        dateCreated: 0,
        datePublished: 0,
        content_isValid: '',
        content_version: 0
      },
      isValidOptions: [
        { label: 'Valid', value: true },
        { label: 'Invalid', value: false }
      ],
      isFreeOptions: [
        { label: 'Free', value: true },
        { label: 'Premium', value: false }
      ],
      genderSegmentOptions: [{ label: 'General', value: 'general' }],
      ageSegmentOptions: [{ label: 'General', value: 'general' }],
      isNewOptions: [
        { label: 'True', value: true },
        { label: 'False', value: false }
      ],
      coverImageCropperShow: false,
      showcaseImageCropperShow: false,
      isFormValid: false
    }
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
      data: {
        content_title: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(40)
        },
        content_description: {
          required,
          minLength: minLength(100),
          maxLength: maxLength(300)
        },
        content_type_id: { required },
        author_id: { required },
        content_isNew: { required },
        content_isValid: {
          required
        },
        coverImageUrl: {
          file: { requiredIf: requiredIf(this.$route.params.state === 'new') }
        },
        showcaseImageUrl: {
          file: { requiredIf: requiredIf(this.$route.params.state === 'new') }
        },

        ageSegment: { required },
        genderSegment: { required }
      }
    }
  },
  computed: {
    ...mapGetters({
      getPublishedContentById: 'content/getPublishedContentById',
      authors: 'authors/getPublishedAuthors',
      contentTypes: 'content/contentTypes'
    }),
    trackData() {
      const narrators = this.$store.getters['narrators/getPublishedNarrators']
      const soundscapes = this.$store.getters[
        'soundScapes/getPublishedSoundscapes'
      ]
      const state = this.$route.params.state
      const tracks = this.$store.getters['tracks/getTracks'](state)
      return {
        narrators: narrators,
        soundscapes: soundscapes,
        content: this.data,
        tracks: tracks,
        state: state,
        title: 'Track List',
        isEditTrackAllowed: !this.isStatePublished
      }
    },
    isTrackShow() {
      const state = this.$route.params.state
      if (state === 'new') {
        return false
      }
      const isNarratorLoaded = this.$store.getters['narrators/isNarratorLoaded']
      const isSoundscapeLoaded = this.$store.getters[
        'soundScapes/isSoundscapeLoaded'
      ]
      const isTracksLoaded = this.$store.getters['tracks/isTracksLoaded'](state)
      return isNarratorLoaded && isSoundscapeLoaded && isTracksLoaded
    },
    isStatePublished() {
      return this.$route.params.state === 'publish'
    },
    isContentExistsOnDraft() {
      const result = this.$store.getters['content/isContentExistsOnDraft'](
        this.data.content_id
      )
      if (this.$route.params.state === 'publish') {
        return result
      }
      return false
    },
    activeCoverImageUrl() {
      const condition =
        this.data.coverImageUrl.url !== '' &&
        this.data.coverImageUrl.file === null
      if (condition) {
        return this.$store.getters.getImageSourceURL(
          this.data.coverImageUrl.url
        )
      } else if (this.data.coverImageUrl.file !== null) {
        return this.data.coverImageUrl.editedUrl
      } else {
        return require('@/assets/placeholder4x3.jpg')
      }
    },
    activeShowcaseImageUrl() {
      const condition =
        this.data.showcaseImageUrl.url !== '' &&
        this.data.showcaseImageUrl.file === null
      if (condition) {
        return this.$store.getters.getImageSourceURL(
          this.data.showcaseImageUrl.url
        )
      } else if (this.data.showcaseImageUrl.file !== null) {
        return this.data.showcaseImageUrl.editedUrl
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
          if (field === 'coverImage') {
            this.data.coverImageUrl.file = file
            this.data.coverImageUrl.editedUrl = imageDataURL
          } else {
            this.data.showcaseImageUrl.file = file
            this.data.showcaseImageUrl.editedUrl = imageDataURL
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    toggleCoverImageCropper() {
      this.coverImageCropperShow = !this.coverImageCropperShow
    },
    toggleShowcaseImageCropper() {
      this.showcaseImageCropperShow = !this.showcaseImageCropperShow
    },
    configure(object) {
      this.data.content_id = object.content_id
      this.data.content_title = object.content_title
      this.data.content_description = object.content_description
      this.data.content_type_id = object.content_type_id
      this.data.isMultiTrack = object.isMultiTrack
      this.data.content_duration = object.content_duration
      this.data.author_id = object.author_id
      this.data.coverImageUrl.url = object.coverImageUrl
      this.data.showcaseImageUrl.url = object.showcaseImageUrl
      this.data.content_isFree = object.content_isFree
      this.data.content_isNew = object.content_isNew
      this.data.ageSegment = object.ageSegment
      this.data.genderSegment = object.genderSegment
      this.data.dateCreated = object.dateCreated
      this.data.datePublished = object.datePublished
      this.data.content_isValid = object.content_isValid
      this.data.content_version = object.content_version
    },
    getContentTypeColorById(contentTypeId) {
      return this.contentTypes.find(
        (contentType) => contentType.content_type_id === contentTypeId
      ).content_type_color
    },
    async moveToDraft() {
      this.$store.dispatch('changeUploadingState', { uploadingState: true })
      const result = await this.$store.dispatch('content/saveAsDraft', {
        state: this.$route.params.state,
        contentData: this.data
      })
      if (result) {
        const trackResult = await this.$store.dispatch('tracks/saveAsDraft', {
          state: 'draft',
          tracks: this.trackData.tracks
        })
        if (trackResult) {
          this.$store.dispatch('changeUploadingState', {
            uploadingState: false
          })
          this.$router.back()
        }
      }
    },
    async saveAsDraft() {
      this.v$.$touch()
      if (this.v$.$error) return
      else {
        this.$store.dispatch('changeUploadingState', { uploadingState: true })
        const result = await this.$store.dispatch('content/saveAsDraft', {
          state: this.$route.params.state,
          contentData: this.data
        })
        if (result) {
          this.$store.dispatch('changeUploadingState', {
            uploadingState: false
          })
          this.$router.back()
        } else {
          console.log('Content Save Error')
        }
      }
    }
  },
  async created() {
    const state = this.$route.params.state
    if (state === 'publish' || state === 'draft') {
      if (state === 'publish') {
        const data = this.getPublishedContentById(this.contentId)
        this.configure(data)
      } else {
        const data = await this.$store.dispatch('content/getContentById', {
          content_id: this.contentId
        })
        this.configure(data)
      }
      state === 'publish'
        ? this.$store.dispatch('tracks/getPublishedTracksByContentId', {
            content_id: this.contentId
          })
        : this.$store.dispatch('tracks/getDraftedTracksByContentId', {
            content_id: this.contentId
          })

      this.$store.dispatch('narrators/getNarrators', {
        state: 'publish'
      })
      this.$store.dispatch('soundScapes/getSoundScapes', {
        state: 'publish'
      })
    }
  }
}
</script>
<style scoped>
.cover-image {
  border-radius: 20px;
  border-style: solid;
  border-width: 3px;
  border-color: white;
  width: 220px;
  height: 165px;
  object-fit: cover;
}
.dropdown-label {
  margin-bottom: 0.4rem;
  margin-left: 0.5rem;
  color: #6c757d;
  font-size: 12px;
}
.image-error {
  border-color: #f44336;
}
</style>
