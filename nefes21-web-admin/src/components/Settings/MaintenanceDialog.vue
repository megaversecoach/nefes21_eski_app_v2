<template>
  <Dialog
    :style="{ width: '35rem' }"
    :modal="true"
    :closable="false"
    :closeOnEscape="false"
  >
    <div class="p-fluid p-grid">
      <h1>{{ _key.id }}</h1>
      <div class="p-field p-col-12">
        <span class="p-float-label">
          <Dropdown
            v-model="currentState"
            :options="availableOptions"
            optionLabel="label"
            optionValue="value"
          />
          <label>Maintenance Mode</label>
        </span>
      </div>
    </div>

    <div class="p-fluid p-grid" v-if="isSchedule">
      <h1>Time Options</h1>
      <div class="p-field p-col-12">
        <span class="p-float-label">
          <Dropdown
            v-model="currentStartTime"
            :options="availableTimeOptions"
            optionLabel="label"
            optionValue="value"
          />
          <label>Time Options</label>
        </span>
      </div>
    </div>

    <template #footer>
      <Button
        class="p-button-secondary"
        label="Discard"
        @click="discardAndCloseModal"
      ></Button>
      <Button label="Save" @click="saveAndCloseModal"></Button>
    </template>
  </Dialog>
</template>
<script>
export default {
  props: ['_key', '_model'],
  emits: ['discard', 'save'],
  watch: {
    currentState: {
      handler: function () {
        this.isSchedule = this.currentState === 'scheduled'
      }
    },
    _model: {
      handler: function () {
        if (this._model) {
          this.currentState = this._model.state
        }
      }
    }
  },
  data() {
    return {
      isSchedule: false,
      currentState: null,
      currentStartTime: null,
      availableOptions: [
        { label: 'Active', value: 'active' },
        { label: 'Passive', value: 'passive' },
        { label: 'Schedule', value: 'scheduled' }
      ],
      availableTimeOptions: [
        { label: '5dk', value: 5 },
        { label: '10dk', value: 10 },
        { label: '15dk', value: 15 },
        { label: '20dk', value: 20 },
        { label: '30dk', value: 30 },
        { label: '60dk', value: 60 }
      ]
    }
  },
  computed: {},
  methods: {
    discardAndCloseModal() {
      this.$emit('discard')
    },
    saveAndCloseModal() {
      this.$emit('save', {
        state: this.currentState,
        time: this.currentStartTime
      })
    }
  },
  mounted() {}
}
</script>
