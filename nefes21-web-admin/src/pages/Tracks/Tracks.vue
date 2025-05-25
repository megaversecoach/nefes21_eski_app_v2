<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card id="base-card">
        <div class="p-d-flex">
          <Button
            class="p-button-secondary p-mr-4"
            icon="pi pi-times"
            label="Discard"
            @click="discard"
          />

          <div class="align-right">
            <Button
              class="p-mr-4"
              icon="pi pi-plus-circle"
              label="Add Track"
              @click="addTrackTapped"
            />
            <Button
              class="p-button-success"
              icon="pi pi-check"
              label="Save Changes"
              @click="saveTracks"
            />
          </div>
        </div>
      </base-card>
      <track-list
        v-if="isTrackShow"
        :state="trackData.state"
        :content="trackData.content"
        :is-draggable="true"
        :isEditTrackAllowed="trackData.isEditTrackAllowed"
        :narrators="trackData.narrators"
        :soundscapes="trackData.soundscapes"
        :title="trackData.title"
        :drafted-tracks="trackData.draftedTracks"
        :published-tracks="trackData.publishedTracks"
      >
      </track-list>
    </div>
  </div>
</template>

<script>
import TrackList from '../../components/TrackList'

export default {
  components: { TrackList },
  props: ['contentId'],

  computed: {
    isTrackShow() {
      const isNarratorLoaded = this.$store.getters['narrators/isNarratorLoaded']
      const isSoundscapeLoaded = this.$store.getters[
        'soundScapes/isSoundscapeLoaded'
      ]
      const isDraftedTrackLoaded = this.$store.getters['tracks/isTracksLoaded'](
        'draft'
      )
      const isPublishedTrackLoaded = this.$store.getters[
        'tracks/isTracksLoaded'
      ]('publish')
      return (
        isNarratorLoaded &&
        isSoundscapeLoaded &&
        isDraftedTrackLoaded &&
        isPublishedTrackLoaded
      )
    },
    trackData() {
      const narrators = this.$store.getters['narrators/getPublishedNarrators']
      const soundscapes = this.$store.getters[
        'soundScapes/getPublishedSoundscapes'
      ]
      const draftedTracks = this.$store.getters['tracks/getTracks']('draft')
      const publishedTracks = this.$store.getters['tracks/getTracks']('publish')
      const content = this.$store.getters['content/draftedContent']
      return {
        narrators: narrators,
        soundscapes: soundscapes,
        content: content,
        draftedTracks: draftedTracks,
        publishedTracks: publishedTracks,
        title: 'Track List',
        state: 'draft',
        isEditTrackAllowed: false
      }
    }
  },
  methods: {
    discard() {
      this.$router.back()
    },
    addTrackTapped() {
      this.$router.push({
        name: 'TrackEdit',
        params: {
          contentId: this.contentId,
          state: 'new'
        }
      })
    },
    async saveTracks() {
      this.$store.dispatch('changeUploadingState', { uploadingState: true })
      const result = await this.$store.dispatch('tracks/saveAsDraft', {
        state: 'draft',
        tracks: this.trackData.draftedTracks
      })
      if (result) {
        this.$store.dispatch('changeUploadingState', { uploadingState: false })
        this.$router.back()
      }
    }
  },
  created() {
    this.$store.dispatch('tracks/getPublishedTracksByContentId', {
      content_id: this.contentId
    })
    this.$store.dispatch('tracks/getDraftedTracksByContentId', {
      content_id: this.contentId
    })
    this.$store.dispatch('content/getContentById', {
      content_id: this.contentId
    })
  }
}
</script>
