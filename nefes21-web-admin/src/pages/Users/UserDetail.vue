<template>
  <div class="p-grid">
    <div class="p-col-3">
      <base-card>
        <div class="p-d-flex p-col-12 p-justify-center">
          <img :src="userImage" :class="['profile-pic p-shadow-4']" />
        </div>
        <div class="p-text-center">
          <p style="font-size: 20px">
            {{ user.name.toUpperCase() }}
          </p>
          <p style="font-size: 15px">
            {{ user.email }}
          </p>
          <p style="font-size: 12px">
            {{ user.uuid }}
          </p>
          <p
            :class="
              'badge badge-free-' + !user.subscriptions.subscription_isActive
            "
            style="margin-left: 30%; margin-right: 30%"
          >
            {{ user.subscriptions.subscription_isActive ? 'Premium' : 'Free' }}
          </p>
          <p style="font-size: 20px">User Information</p>
        </div>
        <info-card :options="options"> </info-card>
      </base-card>
    </div>
    <div class="p-col-9">
      <base-card>
        <TabView lazy>
          <TabPanel header="Overview"> <Overview :user="user" /> </TabPanel>
          <TabPanel header="User Experience">
            <UserExperience :user-id="userId" />
          </TabPanel>
          <TabPanel header="Transactions">
            <Transactions :user-id="userId" />
          </TabPanel>
          <TabPanel header="Purchase Events">
            <PurchaseEvents :user-id="userId" />
          </TabPanel>
          <TabPanel header="Sessions">
            <UserSessions :user-id="userId" />
          </TabPanel>
          <TabPanel header="Credentials">
            <UserCredentials :user="user" />
          </TabPanel>
        </TabView>
      </base-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Overview from '@/components/User/Detail/Overview.vue'
import UserExperience from '../../components/User/Detail/UserExperience'
import PurchaseEvents from '../../components/User/Detail/PurchaseEvents'
import UserSessions from '../../components/User/Detail/UserSessions/UserSessions'
import UserCredentials from '../../components/User/Detail/UserCredentials'
import Transactions from '../../components/User/Detail/Transaction/Transactions'

export default {
  components: {
    Transactions,
    UserCredentials,
    UserSessions,
    PurchaseEvents,
    UserExperience,
    Overview
  },
  props: ['userId'],
  computed: {
    options() {
      return [
        {
          name: 'Gender',
          key: 'gender',
          value: this.user['gender']?.toUpperCase(),
          color:
            this.user['gender'] === 'male'
              ? '#3B9FC4'
              : this.user['gender'] === 'female'
              ? '#C43B80'
              : '#D5CFCF'
        },
        { name: 'Age', key: 'age', value: this.user['age'] },
        {
          name: 'Creation Date',
          key: 'dateCreated',
          value: this.convert()
        },
        {
          name: 'App Language',
          key: 'app_language',
          value: this.user['app_language']
        },
        {
          name: 'Device Language',
          key: 'device_language',
          value: this.user['device_language']
        }
      ]
    },
    userImage() {
      return require('@/assets/placeholder1x1.jpg')
    },
    ...mapGetters({
      user: 'users/user'
    })
  },
  methods: {
    convert() {
      return this.convertToDate(this.user['dateCreated'])
    },
    ...mapActions({
      getUserById: 'users/searchUser'
    })
  },
  async created() {
    await this.getUserById({
      type: 'uuid',
      value: this.userId
    })
  }
}
</script>

<style scoped>
.profile-pic {
  border-radius: 50%;
  border-style: solid;
  border-width: 3px;
  border-color: white;
  width: 10rem;
  height: 10rem;
  object-fit: cover;
}
</style>
