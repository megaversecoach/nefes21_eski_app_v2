import actions from '@/store/Settings/actions'
import mutations from '@/store/Settings/mutations'
import getters from '@/store/Settings/getters'

export default {
  namespaced: true,
  state() {
    return {
      maintenanceState: []
    }
  },
  actions: actions,
  mutations: mutations,
  getters: getters
}
