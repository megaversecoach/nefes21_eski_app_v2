<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <span class="p-input-icon-left" style="width: 50%">
          <i class="pi pi-search" />
          <InputText
            type="text"
            v-model="searchText"
            placeholder="Search User"
            style="width: 100%"
            @keyup.enter="search"
          />
        </span>
        <Button
          label="Search"
          icon="pi pi-search"
          class="p-button-raised"
          style="margin-left: 10px"
          @click="search"
        />

        <div
          style="margin-top: 10px"
          v-for="type of types"
          :key="type.key"
          class="p-field-radiobutton"
        >
          <RadioButton
            :id="type.key"
            name="type"
            :value="type.key"
            v-model="searchType"
          />
          <label :for="type.key">{{ type.name }}</label>
        </div>
        <small v-if="error === true" class="p-error p-mt-10">
          No user found
        </small>
      </base-card>
      <user-list :user="user"></user-list>
    </div>
  </div>
</template>
<script>
import UserList from '@/components/User/UserList'
import { mapActions } from 'vuex'
export default {
  components: { UserList },
  data() {
    return {
      user: null,
      searchText: null,
      types: [
        { name: 'UUID', key: 'uuid' },
        { name: 'Email', key: 'email' },
        { name: 'Referral Code', key: 'referralCode' }
      ],
      searchType: 'uuid',
      error: null
    }
  },
  methods: {
    async search() {
      this.error = false
      let typeCondition =
        this.searchType !== null && this.searchType !== undefined
      let textCondition =
        this.searchText !== null &&
        this.searchText !== '' &&
        this.searchText !== undefined
      if (typeCondition && textCondition) {
        this.searchUser({
          type: this.searchType,
          value: this.searchText
        })
          .then((user) => {
            this.user = [user]
          })
          .catch(() => {
            this.error = true
            this.user = null
          })
      }
    },
    ...mapActions({
      searchUser: 'users/searchUser'
    })
  }
}
</script>
