<template>
  <router-view />
</template>

<script>
import firebase from 'firebase'

export default {
  methods: {
    async listenAppState() {
      const starCountRef = firebase
        .database()
        .ref('/maintenance/' + process.env.VUE_APP_FIREBASE_MAINTENANCE_MODE_ID)
      starCountRef.on('value', (snapshot) => {
        const data = snapshot.val()
        if (data.state === 'active') {
          if (this.$appState === 'normal') {
            this.$router.replace('/maintenance/active')
            this.$appState = 'maintenance'
          }
        }
        if (data.state === 'passive') {
          if (this.$appState !== 'normal') {
            this.$appState = 'normal'
            this.$router.replace('/')
          }
        }
      })
    }
  },
  created() {
    this.listenAppState()
  }
}
</script>
<style>
.p-button {
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.9rem;
}
.p-fileupload-row > div {
  width: 100%;
}
.btn-align-right {
  display: flex;
  margin-left: auto;
  margin-right: 0;
}
.align-right {
  margin-left: auto;
  margin-right: 0;
}
.disabled-input {
  background: #e9ebf1;
}
.p-field {
  margin-bottom: 1.8rem;
}
.p-checkbox {
  display: inline;
}
.p-checkbox .p-checkbox-box {
  width: 25px;
  height: 25px;
}
.badge {
  border-radius: 3px;
  padding: 0.25em 0.5rem;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;
}
.badge-free-true {
  background: #c8e6c9;
  color: #256029;
}
.badge-free-false {
  background: #ffd8b2;
  color: #805b36;
}
.badge-true {
  background: #c8e6c9;
  color: #256029;
}
.badge-false {
  background: #ffcdd2;
  color: #c63737;
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
.file-upload-error {
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  border-color: #f44336;
}
</style>
