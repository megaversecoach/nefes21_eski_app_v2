import { createApp } from 'vue'

import router from './router/routes'
import store from './store'

import PrimeVue from 'primevue/config'

import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import MultiSelect from 'primevue/multiselect'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import Textarea from 'primevue/textarea'
import FileUpload from 'primevue/fileupload'
import InputSwitch from 'primevue/inputswitch'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'

import SplitButton from 'primevue/splitbutton'
import Dropdown from 'primevue/dropdown'
import AutoComplete from 'primevue/autocomplete'
import Slider from 'primevue/slider'
import Dialog from 'primevue/dialog'
import ProgressBar from 'primevue/progressbar'
import ProgressSpinner from 'primevue/progressspinner'
import ColorPicker from 'primevue/colorpicker'
import ConfirmDialog from 'primevue/confirmdialog'
import RadioButton from 'primevue/radiobutton'
import Carousel from 'primevue/carousel'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

import Chart from 'primevue/chart'

import BaseCard from './components/UI/BaseCard.vue'
import InfoCard from './components/UI/ InfoCard.vue'
import EmptyState from './components/UI/EmptyStateCard.vue'

import Cropper from 'vue-image-crop-upload'

import App from './App/App'
import firebase from 'firebase/app'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ToastService)
app.use(PrimeVue)
app.use(ConfirmationService)

app.mixin({
  methods: {
    convertToDate(epoch) {
      let date = new Date(0)
      date.setUTCMilliseconds(epoch)
      return date.toLocaleString('tr-TR')
    }
  }
})

app.config.globalProperties.$appState = 'normal'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_PROJECT_ID + '.firebaseapp.com',
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_PROJECT_ID + '.appspot.com',
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
}
firebase.initializeApp(firebaseConfig)

app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('MultiSelect', MultiSelect)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Checkbox', Checkbox)
app.component('Textarea', Textarea)
app.component('FileUpload', FileUpload)
app.component('InputSwitch', InputSwitch)
app.component('InputNumber', InputNumber)
app.component('Calendar', Calendar)
app.component('SplitButton', SplitButton)
app.component('Dropdown', Dropdown)
app.component('AutoComplete', AutoComplete)
app.component('Dialog', Dialog)
app.component('ProgressBar', ProgressBar)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Slider', Slider)
app.component('ColorPicker', ColorPicker)
app.component('Carousel', Carousel)
app.component('Cropper', Cropper)
app.component('ConfirmDialog', ConfirmDialog)
app.component('RadioButton', RadioButton)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)

app.component('Chart', Chart)

app.component('BaseCard', BaseCard)
app.component('InfoCard', InfoCard)
app.component('EmptyState', EmptyState)

app.mount('#app')
