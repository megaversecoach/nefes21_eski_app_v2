<template>
  <h3>Session Tokens</h3>
  <session-token-list
    @showDetailTapped="showDetailTapped"
    :session_tokens="sessionTokens"
  ></session-token-list>

  <div v-if="sessions !== null">
    <h3>Sessions</h3>
    <p><b>Token</b> : {{ selected_session_token }}</p>
    <session-list
      :sessions="sessions.data"
      :total-items="sessions.totalItem"
      :session_token="selected_session_token"
      @loadNewPage="loadSessions"
    ></session-list>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SessionTokenList from './SessionTokenList'
import SessionList from './SessionList'

export default {
  props: ['userId'],
  components: { SessionList, SessionTokenList },
  data() {
    return {
      selected_session_token: null
    }
  },
  computed: {
    ...mapGetters({
      sessionTokens: 'users/sessionTokens',
      sessions: 'users/sessions'
    })
  },
  methods: {
    ...mapActions({
      getSessionTokens: 'users/getSessionTokens',
      getSessions: 'users/getSessions',
      clearSessions: 'users/clearSessions'
    }),
    showDetailTapped(session_id) {
      this.selected_session_token = null
      this.clearSessions()
      this.selected_session_token = session_id
      this.loadSessions(1)
    },
    loadSessions(page) {
      this.getSessions({
        session_id: this.selected_session_token,
        page: page
      })
    }
  },
  async created() {
    await this.getSessionTokens({
      userId: this.userId
    })
  }
}
</script>
