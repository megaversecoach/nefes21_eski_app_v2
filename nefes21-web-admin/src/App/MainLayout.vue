<template>
  <div>
    <div
      :class="{
        'layout-content-wrapper menu-active': isMenuActive,
        'layout-content-wrapper menu-passive': !isMenuActive
      }"
    >
      <the-header
        :environment="environment"
        @menuButtonClick="toggleSidebar"
      ></the-header>
      <div class="layout-content">
        <router-view></router-view>
      </div>
    </div>
    <the-sidebar :menu-active="isMenuActive"></the-sidebar>
  </div>
  <LoadingScreen></LoadingScreen>
</template>
<script>
import TheHeader from '../layout/TheHeader'
import TheSidebar from '../layout/TheSidebar'
import LoadingScreen from '@/layout/LoadingScreen'

export default {
  data() {
    return {
      isMenuActive: true,
      isLoading: false
    }
  },
  computed: {
    environment() {
      return process.env.NODE_ENV
    }
  },
  methods: {
    toggleSidebar() {
      this.isMenuActive = !this.isMenuActive
    }
  },
  components: {
    LoadingScreen,
    TheSidebar,
    TheHeader
  }
}
</script>

<style lang="scss">
body {
  font-family: 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  font-weight: 500;
  color: #495057;
  padding: 0;
  margin: 0;
  min-height: 100%;
  background: #f8f9fa;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
a {
  text-decoration: none;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 1.5rem 0 1rem 0;
  font-family: inherit;
  font-weight: 600;
  line-height: 1.2;
  color: inherit;
}
.layout-content-wrapper {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-pack: justify;
  justify-content: space-between;
  min-height: 100vh;
  transition: margin-left 0.4s cubic-bezier(0.05, 0.74, 0.2, 0.99);
}
.menu-active {
  margin-left: 16rem;
}
.menu-passive {
  margin-left: 0rem;
}
.layout-content {
  padding: 2rem;
  flex: 1 1 auto;
  -ms-flex: 1 1 auto;
}
</style>
