<template>
  <base-card>
    <div class="p-d-flex p-jc-between p-mb-3">
      <h3 class="p-mt-2">{{ title }}</h3>
      <div>
        <Button
          v-if="isEditTrackAllowed"
          icon="pi pi-sliders-h"
          label="Edit Tracks"
          @click="editDraftedTracksTapped"
        />
      </div>
    </div>
    <DataTable
      :loading="draftedTracksLoading"
      @rowReorder="onRowReorder"
      :value="draftedTracks"
      responsiveLayout="scroll"
      class="p-datatable-gridlines"
    >
      <template #empty><h4>No Tracks Found</h4></template>
      <template #loading>Loading ...</template>
      <Column
        :rowReorder="isDraggable"
        headerStyle="width: 3rem"
        :reorderableColumn="false"
        :style="{
          display: isDraggable ? '' : 'none'
        }"
      />
      <Column field="orderInContent" header="#" headerStyle="width: 2rem" />
      <Column field="track_id" header="Track ID"></Column>
      <Column field="track_title" header="Track Title"></Column>
      <Column field="track_label" header="Track Label"></Column>
      <Column field="narrator_id" header="Narrator">
        <template #body="{ data }">
          {{ getNarratorLabelById(data.narrator_id) }}
        </template>
      </Column>
      <Column
        field="track_duration"
        bodyStyle="text-align: center;"
        header="Duration"
      >
        <template #body="{ data }">
          <span>{{ secondsToHms(data.track_duration) }}</span>
        </template>
      </Column>
      <Column
        field="track_isFree"
        header="Free/Premium"
        headerStyle="width: 3rem;"
        bodyStyle="text-align: center;"
      >
        <template #body="{ data }">
          <span :class="'badge badge-free-' + data.track_isFree">{{
            data.track_isFree ? 'Free' : 'Premium'
          }}</span>
        </template>
      </Column>
      <Column
        field="track_isValid"
        header="Validation"
        headerStyle="width: 3rem;"
        bodyStyle="text-align: center;"
      >
        <template #body="{ data }">
          <span :class="'badge badge-free-' + data.track_isValid">{{
            data.track_isValid ? 'Valid' : 'Invalid'
          }}</span>
        </template>
      </Column>
      <Column
        header="Action"
        :style="{
          display: isDraggable ? '' : 'none'
        }"
      >
        <template #body="{ data }">
          <Button
            class="p-button-text"
            v-if="isDraggable"
            @click="editTrackTapped(data.track_id)"
          >
            Edit Track
          </Button>
          <Button
            class="p-button-text p-button-danger"
            v-if="isDraggable && !isPublished(data.track_id)"
            @click="confirmDeleteTrack(data.track_id)"
          >
            Delete
          </Button>
        </template>
      </Column>
    </DataTable>
  </base-card>
  <ConfirmDialog :closable="false" :closeOnEscape="false" />
</template>

<script>
export default {
  props: [
    'state',
    'content',
    'draftedTracks',
    'publishedTracks',
    'title',
    'narrators',
    'soundscapes',
    'isEditTrackAllowed',
    'isDraggable'
  ],
  data() {
    return {
      draftedTracksLoading: false
    }
  },
  methods: {
    secondsToHms(d) {
      d = Number(d)
      let h = Math.floor(d / 3600)
      let m = Math.floor((d % 3600) / 60)
      let s = Math.floor((d % 3600) % 60)

      let hDisplay = h > 0 ? ('0' + h).slice(-2) + ':' : ''
      let mDisplay = m > 0 ? ('0' + m).slice(-2) + ':' : ''
      let sDisplay = s > 0 ? ('0' + s).slice(-2) : ''
      return hDisplay + mDisplay + sDisplay
    },
    onRowReorder(event) {
      this.$store.dispatch('tracks/sortUpdate', {
        tracks: event.value
      })
    },
    editDraftedTracksTapped() {
      this.$router.push({
        name: 'Tracks',
        params: {
          contentId: this.content.content_id
        }
      })
    },
    getNarratorLabelById(narrator_id) {
      const narrator = this.narrators.find(
        (narrator) => narrator.narrator_id === narrator_id
      )
      if (narrator === -1) {
        return ''
      }
      return narrator.narrator_name + ' ' + narrator.narrator_surname
    },
    getSoundscapeById(soundscape_id) {
      const soundscape = this.soundscapes.find(
        (soundscape) => soundscape.soundscape_id === soundscape_id
      )
      if (soundscape === -1) {
        return ''
      }
      return soundscape.soundscape_title
    },
    isPublished(track_id) {
      return this.publishedTracks.some((track) => track.track_id === track_id)
    },
    confirmDeleteTrack(model) {
      this.$confirm.require({
        message: 'Are you sure you want to delete the drafted Track?',
        header: 'Delete Drafted Track',
        icon: 'pi pi-trash',
        acceptClass: 'p-button-danger',
        acceptLabel: 'Delete',
        rejectLabel: 'Cancel',
        accept: () => {
          this.deleteTrack(model)
          this.$confirm.close()
        },
        reject: () => {
          this.$confirm.close()
        }
      })
    },
    async deleteTrack(track_id) {
      this.$store.dispatch('changeUploadingState', { uploadingState: true })
      const deleteResult = await this.$store.dispatch('tracks/deleteTrack', {
        track_id: track_id
      })
      if (deleteResult) {
        const saveAfterDeleteResult = await this.$store.dispatch(
          'tracks/saveAsDraft',
          {
            state: 'draft',
            tracks: this.draftedTracks
          }
        )
        if (saveAfterDeleteResult) {
          this.$store.dispatch('changeUploadingState', {
            uploadingState: false
          })
        }
      }
    },
    editTrackTapped(track_id) {
      this.$router.push({
        name: 'TrackDetail',
        params: {
          contentId: this.content.content_id,
          state: this.state,
          trackId: track_id
        }
      })
    }
  }
}
</script>

<style scoped>
.badge {
  border-radius: 3px;
  padding: 0.25em 0.5rem;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;
}
.badge-true {
  background: #c8e6c9;
  color: #256029;
}
.badge-free-true {
  background: #c8e6c9;
  color: #256029;
}

.badge-false {
  background: #ffcdd2;
  color: #c63737;
}
.badge-free-false {
  background: #ffd8b2;
  color: #805b36;
}
</style>
