import { SettingsService } from '@/api/Services/Settings/SettingsService'

export default {
  getMaintenanceStates: async function (context) {
    const data = await SettingsService.getMaintenanceStates()
    context.commit('setMaintenanceState', {
      data: data
    })
  },
  updateMaintenanceStates: async function (_, payload) {
    const data = await SettingsService.updateMaintenanceStates(
      payload.start_date,
      payload.end_date,
      payload.state,
      payload.key
    )
    console.log('---')
    console.log(data)
    console.log('---')
    return data
  }
}
