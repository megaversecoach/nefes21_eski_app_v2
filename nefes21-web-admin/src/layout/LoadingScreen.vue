<template>
  <Dialog
    v-model:visible="isLoading"
    :style="{ width: '30vw' }"
    :modal="true"
    header="Processing data, please wait..."
    :closable="false"
    :closeOnEscape="false"
  >
    <ProgressBar v-if="percentage !== 0" :value="percentage" />

    <ProgressSpinner
      v-else
      style="
        display: flex;
        margin-top: 10px;
        margin-left: auto;
        margin-right: auto;
        width: 100px;
        height: 100px;
      "
      strokeWidth="6"
      fill="#EEEEEE"
    />
  </Dialog>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      isLoading: false,
      percentage: 0
    }
  },
  watch: {
    uploader: {
      handler: function () {
        this.isLoading = this.uploader.status
        if (this.uploader.percentage !== null) {
          this.percentage = this.uploader.percentage
        } else {
          this.percentage = 0
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      uploader: 'uploader'
    })
  }
}
</script>
