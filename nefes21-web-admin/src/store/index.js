import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import AuthorsStore from './Authors/index.js'
import NarratorStore from './Narrators/index.js'
import SoundScapeStore from './SoundScapes/index.js'
import ContentStore from './Contents/index'
import TrackStore from './Tracks/index'
import LayoutStore from './Layouts/index'
import CardStore from './Cards/index'
import TodayStore from './Today/index'
import UserStore from './Users/index'
import ProductStore from './Products/index'
import ProgramStore from './Programs/index'
import PartStore from './Parts/index'
import SettingsStore from './Settings/index'

import { AuthService } from '../api/Services/AuthService'

export default createStore({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  modules: {
    authors: AuthorsStore,
    narrators: NarratorStore,
    soundScapes: SoundScapeStore,
    content: ContentStore,
    tracks: TrackStore,
    layouts: LayoutStore,
    cards: CardStore,
    todays: TodayStore,
    users: UserStore,
    products: ProductStore,
    programs: ProgramStore,
    parts: PartStore,
    settings: SettingsStore
  },

  state: {
    language: 'tr',
    staticURL: process.env.VUE_APP_STATIC_URL,
    supportedLanguages: ['tr', 'en', 'fr', 'es'],
    name: '',
    username: '',
    isAuthenticated: null,
    uploaderPercentage: null,
    uploadingState: false
  },
  mutations: {
    changeUploadingState(state, payload) {
      state.uploadingState = payload.uploadingState
    },
    changeCurrentLanguage(state, payload) {
      state.language = payload.language
    },
    setUserCredentials(state, payload) {
      if (payload.status === true) {
        state.name = payload.name
        state.username = payload.username
      }
      state.isAuthenticated = payload.status
    },
    uploader(state, payload) {
      state.uploadingState = payload.status
    }
  },
  actions: {
    changeUploadingState(context, payload) {
      context.commit('changeUploadingState', payload)
    },
    uploader(context, payload) {
      context.commit('uploader', payload)
    },
    changeLanguage(context, payload) {
      context.commit('changeCurrentLanguage', payload)
    },
    async login(context, payload) {
      return new Promise((resolve, reject) => {
        AuthService.login(payload.username, payload.password)
          .then((response) => {
            console.log(response.status)
            context.commit('setUserCredentials', response)
            resolve(response.status)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    logOut() {
      AuthService.logOut()
    }
  },
  getters: {
    uploadingState(state) {
      return {
        uploadingState: state.uploadingState
      }
    },
    uploader(state) {
      return {
        percentage: state.uploaderPercentage,
        status: state.uploadingState
      }
    },
    getSupportedLanguage(state) {
      return state.supportedLanguages
    },
    getCurrentLanguage(state) {
      return state.language
    },
    getImageSourceURL: (state) => (url) => {
      return state.staticURL + url
    },
    getIsLoggedIn(state) {
      return state.isAuthenticated
    }
  }
})
