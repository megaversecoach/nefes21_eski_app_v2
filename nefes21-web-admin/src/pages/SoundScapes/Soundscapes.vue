<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex">
          <Button
            class="align-right"
            icon="pi pi-plus-circle"
            label="Add Soundscape"
            @click="addSoundscapeRoute"
          />
        </div>
      </base-card>
      <sound-scape-list
        :title="publishedSoundScapes.title"
        :soundscapes="publishedSoundScapes.soundScapes"
        :state="publishedSoundScapes.state"
      >
      </sound-scape-list>

      <sound-scape-list
        v-if="draftedSoundScapes.soundScapes.length > 0"
        :title="draftedSoundScapes.title"
        :soundscapes="draftedSoundScapes.soundScapes"
        :state="draftedSoundScapes.state"
      >
      </sound-scape-list>
    </div>
  </div>
</template>

<script>
import SoundScapeList from '../../components/SoundScapeList'

export default {
  components: {
    SoundScapeList
  },
  computed: {
    publishedSoundScapes() {
      const soundScapes = this.$store.getters[
        'soundScapes/getPublishedSoundscapes'
      ]
      return {
        title: 'Soundscapes (Published)',
        soundScapes: soundScapes,
        state: 'publish'
      }
    },
    draftedSoundScapes() {
      const soundScapes = this.$store.getters[
        'soundScapes/getDraftedSoundScapes'
      ]
      return {
        title: 'Soundscapes (Drafted)',
        soundScapes: soundScapes,
        state: 'draft'
      }
    }
  },
  methods: {
    addSoundscapeRoute() {
      this.$router.push({
        name: 'SoundScapeEdit',
        params: {
          state: 'new'
        }
      })
    }
  },
  created() {
    this.$store.dispatch('soundScapes/getSoundScapes', {
      state: 'draft'
    })
    this.$store.dispatch('soundScapes/getSoundScapes', {
      state: 'publish'
    })
  }
}
</script>
