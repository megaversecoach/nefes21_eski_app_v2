<template>
  <div class="p-grid">
    <div class="p-col-6">
      <base-card>
        <h2><b>Nefes21 Account</b></h2>
        <info-card :options="nefes21AccountOptions"></info-card>
      </base-card>
    </div>
    <div class="p-col-6">
      <base-card>
        <h2><b>Apple Account</b></h2>
        <info-card :options="appleAccountOptions"></info-card>
      </base-card>
    </div>
    <div class="p-col-6">
      <base-card>
        <h2><b>Facebook Account</b></h2>
        <info-card :options="facebookAccountOptions"></info-card>
      </base-card>
    </div>
    <div class="p-col-6">
      <base-card>
        <h2><b>Google Account</b></h2>
        <info-card :options="googleAccountOptions"></info-card>
      </base-card>
    </div>
  </div>
</template>

<script>
export default {
  props: ['user'],
  computed: {
    nefes21AccountOptions() {
      return [
        {
          name: 'Password Set',
          key: 'isPasswordSet',
          value: this.user.isPasswordSet
        },
        {
          name: 'Profile Pic Set',
          key: 'isProfilePicSet',
          value: this.user.isProfilePicSet
        }
      ]
    },
    appleAccountOptions() {
      const condition = typeof this.user.apple_account === 'undefined'
      if (condition) {
        return [
          {
            name: 'State',
            key: 'account_state',
            value: 'Not Connected'
          }
        ]
      }
      return [
        {
          name: 'Account ID',
          key: 'account_id',
          value: this.user.apple_account.account_id
        },
        {
          name: 'Email',
          key: 'email',
          value: this.user.apple_account.email
        },
        {
          name: 'First Name',
          key: 'firstName',
          value: this.user.apple_account.firstName
        },
        {
          name: 'Last Name',
          key: 'lastName',
          value: this.user.apple_account.lastName
        }
      ]
    },
    facebookAccountOptions() {
      const condition = typeof this.user.facebook_account === 'undefined'
      if (condition) {
        return [
          {
            name: 'State',
            key: 'account_state',
            value: 'Not Connected'
          }
        ]
      }
      return [
        {
          name: 'Account ID',
          key: 'account_id',
          value: this.user.facebook_account.account_id
        },
        {
          name: 'Email',
          key: 'email',
          value: this.user.facebook_account.email
        },
        {
          name: 'First Name',
          key: 'firstName',
          value: this.user.facebook_account.firstName
        },
        {
          name: 'Last Name',
          key: 'lastName',
          value: this.user.facebook_account.lastName
        }
      ]
    },
    googleAccountOptions() {
      const condition = typeof this.user.google_account === 'undefined'
      if (condition) {
        return [
          {
            name: 'State',
            key: 'account_state',
            value: 'Not Connected'
          }
        ]
      }
      return [
        {
          name: 'Account ID',
          key: 'account_id',
          value: this.user.google_account.account_id
        },
        {
          name: 'Email',
          key: 'email',
          value: this.user.google_account.email
        },
        {
          name: 'First Name',
          key: 'firstName',
          value: this.user.google_account.firstName
        },
        {
          name: 'Last Name',
          key: 'lastName',
          value: this.user.google_account.lastName
        }
      ]
    }
  }
}
</script>
