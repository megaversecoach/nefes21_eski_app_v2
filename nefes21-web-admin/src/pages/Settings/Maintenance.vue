<template>
  <maintenance-list
    :keys="keys"
    :maintenance-states="maintenanceStates"
    @changeTapped="changeButtonTapped"
  >
  </maintenance-list>

  <maintenance-dialog
    v-model:visible="displayModal"
    :_key="selectedKey"
    :_model="selectedData"
    @discard="closeDialog"
    @save="saveTapped"
  >
  </maintenance-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MaintenanceList from '@/components/Settings/MaintenanceList'
import MaintenanceDialog from '@/components/Settings/MaintenanceDialog'

export default {
  components: { MaintenanceDialog, MaintenanceList },
  computed: {
    ...mapGetters({
      maintenanceStates: 'settings/maintenanceStates'
    })
  },
  methods: {
    ...mapActions({
      getMaintenanceState: 'settings/getMaintenanceStates',
      updateMaintenanceState: 'settings/updateMaintenanceStates'
    }),
    changeButtonTapped(key) {
      this.selectedKey = key
      this.selectedData = this.maintenanceStates[key.id]
      this.displayModal = true
    },
    closeDialog() {
      this.displayModal = false
    },
    async saveTapped(currentState) {
      await this.updateMaintenanceState({
        end_date: this.selectedData.end_date,
        start_date:
          currentState.time === null
            ? 0
            : Date.now() + currentState.time * 60 * 1000,
        state: currentState.state,
        key: this.selectedKey
      })
      this.displayModal = false
      await this.getMaintenanceState()
    }
  },
  data() {
    return {
      displayModal: false,
      selectedKey: '',
      selectedData: null,
      keys: [
        {
          id: 'android'
        },
        {
          id: 'android_dev'
        },
        {
          id: 'android_test'
        },
        {
          id: 'ios'
        },
        {
          id: 'ios_dev'
        },
        {
          id: 'ios_test'
        }
      ]
    }
  },
  async created() {
    await this.getMaintenanceState()
    console.log('Maintenance States:', this.maintenanceStates)
  }
}
</script>
