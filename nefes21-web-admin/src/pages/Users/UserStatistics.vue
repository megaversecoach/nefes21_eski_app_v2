<template>
  <div class="p-d-flex p-mb-4">
    <Button
      :class="[
        liveData ? 'p-button-danger align-right' : 'p-button align-right'
      ]"
      icon="pi pi-wifi"
      :label="liveDataButtonLabel"
      @click="toggleLiveData"
    />
  </div>
  <div class="p-grid">
    <div class="p-col-4">
      <statistic-card
        title="Users"
        icon="pi pi-fw pi-users"
        :data="registeredUserCount"
        description="Registered Users"
      />
    </div>
    <div class="p-col-4">
      <statistic-card
        title="Premium Users"
        icon="pi pi-user-plus"
        :data="premiumUserCount"
        description="Users"
      />
    </div>
    <div class="p-col-4">
      <statistic-card
        title="Active Subscribers"
        icon="pi pi-star"
        :data="activeSubscriberCount"
        description="Subscriptions"
      />
    </div>
  </div>
  <div class="p-grid">
    <div class="p-col-4">
      <pie-chart
        :title="genderChart.title"
        :chart-data="genderChart.data"
        :chart-options="genderChart.options"
      />
    </div>
    <div class="p-col-4">
      <pie-chart
        :title="premiumUserChart.title"
        :chart-data="premiumUserChart.data"
        :chart-options="premiumUserChart.options"
      />
    </div>
    <div class="p-col-4">
      <pie-chart
        :title="subscriberChart.title"
        :chart-data="subscriberChart.data"
        :chart-options="subscriberChart.options"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import StatisticCard from '@/components/StatisticCard'
import PieChart from '@/components/PieChart'
export default {
  components: { PieChart, StatisticCard },
  data() {
    return {
      liveData: false,
      liveDataInterval: null
    }
  },
  watch: {
    liveData: {
      handler: function () {
        if (this.liveData === true)
          this.liveDataInterval = setInterval(() => {
            this.getUsers()
          }, 10000)
        else {
          clearInterval(this.liveDataInterval)
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      registeredUserCount: 'users/registeredUserCount',
      premiumUserCount: 'users/premiumUserCount',
      activeSubscriberCount: 'users/activeSubscriberCount',

      maleGenderCount: 'users/maleGenderCount',
      femaleGenderCount: 'users/femaleGenderCount',
      unspecifiedGenderCount: 'users/unspecifiedGenderCount',
      notGivenGenderCount: 'users/notGivenGenderCount',

      appStorePremiumUserCount: 'users/appStorePremiumUserCount',
      googlePlayPremiumUserCount: 'users/googlePlayPremiumUserCount',
      prepaidPremiumUserCount: 'users/prepaidPremiumUserCount',
      promoPremiumUserCount: 'users/promoPremiumUserCount',
      referralPremiumUserCount: 'users/referralPremiumUserCount',
      referralGiftPremiumUserCount: 'users/referralGiftPremiumUserCount',

      appStoreSubscriberCount: 'users/appStoreSubscriberCount',
      googlePlaySubscriberCount: 'users/googlePlaySubscriberCount'
    }),
    genderChart() {
      return {
        title: 'Genders',
        data: {
          labels: ['Male', 'Female', 'Unspecified', 'Not Given'],
          datasets: [
            {
              data: [
                this.maleGenderCount,
                this.femaleGenderCount,
                this.unspecifiedGenderCount,
                this.notGivenGenderCount
              ],
              backgroundColor: ['#427ef5', '#66bb82', '#ffb726', '#b326ff'],
              hoverBackgroundColor: ['#729bec', '#97b8a2', '#f1c979', '#c274ec']
            }
          ]
        },
        options: {
          plugins: {
            legend: {
              labels: {
                color: '#495057'
              }
            }
          }
        }
      }
    },
    premiumUserChart() {
      return {
        title: 'Premium Users',
        data: {
          labels: [
            'App Store',
            'Google Play',
            'PrePaid',
            'Promo',
            'Referral',
            'Referral Gift'
          ],
          datasets: [
            {
              data: [
                this.appStorePremiumUserCount,
                this.googlePlayPremiumUserCount,
                this.prepaidPremiumUserCount,
                this.promoPremiumUserCount,
                this.referralPremiumUserCount,
                this.referralGiftPremiumUserCount
              ],
              backgroundColor: [
                '#427ef5',
                '#66bb82',
                '#ffb726',
                '#b326ff',
                '#ff269d',
                '#26ffc2'
              ],
              hoverBackgroundColor: [
                '#729bec',
                '#97b8a2',
                '#f1c979',
                '#c274ec',
                '#ff269d',
                '#8cefd6'
              ]
            }
          ]
        },
        options: {
          plugins: {
            legend: {
              labels: {
                color: '#495057'
              }
            }
          }
        }
      }
    },
    subscriberChart() {
      return {
        title: 'Subscribers',
        data: {
          labels: ['App Store', 'Google Play'],
          datasets: [
            {
              data: [
                this.appStoreSubscriberCount,
                this.googlePlaySubscriberCount
              ],
              backgroundColor: ['#427ef5', '#66bb82'],
              hoverBackgroundColor: ['#729bec', '#97b8a2']
            }
          ]
        },
        options: {
          plugins: {
            legend: {
              labels: {
                color: '#495057'
              }
            }
          }
        }
      }
    },
    liveDataButtonLabel() {
      if (this.liveData === true) {
        return 'Live Data: ON'
      } else {
        return 'Live Data: OFF'
      }
    }
  },
  methods: {
    ...mapActions({
      getUsers: 'users/getUsers'
    }),
    toggleLiveData() {
      this.liveData = !this.liveData
    }
  },
  async created() {
    await this.getUsers()
  }
}
</script>
