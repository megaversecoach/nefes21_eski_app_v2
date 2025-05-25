<template>
  <div class="layout-topbar">
    <div class="topbar-left">
      <a class="menu-button" @click="onMenuButtonClick">
        <i :class="'pi pi-chevron-' + menuIconArrow"></i>
      </a>
      <span class="topbar-separator"></span>

      <div class="layout-breadcrumb viewname" style="text-transform: uppercase">
        <span v-if="$route.meta.label">{{ $route.meta.label }}</span>
      </div>
    </div>

    <div class="topbar-right">
      <ul class="topbar-menu">
        <li class="search-item">
          <a tabindex="0" @click="onSearchClick">
            <i class="pi pi-search"></i>
          </a>
        </li>

        <li
          :class="{ 'active-menuitem fadeInDown': topbarUserMenuActive }"
          class="profile-item"
        >
          <a href="#" @click="onTopbarUserMenuButtonClick">
            <img alt="avatar" class="profile-image" :src="activeAppIcon" />
            <span class="profile-name" style="text-transform: uppercase">{{
              environment
            }}</span>
          </a>
        </li>

        <li class="right-sidebar-item">
          <a href="#" tabindex="0" @click="logOut">
            <i class="pi pi-sign-out"></i>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: ['environment'],
  data() {
    return {
      topbarUserMenuActive: true,
      menuIconArrow: 'left'
    }
  },
  computed: {
    activeAppIcon() {
      if (this.environment === 'production') {
        return require('@/assets/nefes21_app_icon_512x512.png')
      } else if (this.environment === 'test') {
        return require('@/assets/nefes21_app_icon_test_512x512.png')
      } else if (this.environment === 'development') {
        return require('@/assets/nefes21_app_icon_dev_512x512.png')
      } else return ''
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('logOut')
      this.$router.replace('/login')
    },
    onMenuButtonClick() {
      this.$emit('menuButtonClick')
      if (this.menuIconArrow === 'left') {
        this.menuIconArrow = 'right'
      } else {
        this.menuIconArrow = 'left'
      }
    }
  }
}
</script>
<style scoped>
.layout-topbar {
  background: #ffffff;
  height: 4rem;
  padding: 0 2rem;
  border-bottom: 1px solid #dee2e6;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: justify;
  justify-content: space-between;
  color: #495057;
}

.layout-topbar .topbar-left {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
}

.layout-topbar .menu-button {
  width: 2.5rem;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  color: #495057;
  overflow: hidden;
  border-radius: 4px;
  background: #f8f9fa;
  transition: background-color 0.2s, box-shadow 0.2s;
  display: block;
  cursor: pointer;
  outline: 0 none;
}

.layout-topbar .menu-button:hover {
  background: #e9ecef;
}

.layout-topbar .menu-button:focus {
  box-shadow: 0 0 0 0.2rem #bbdefb;
}

.layout-topbar .menu-button i {
  line-height: inherit;
  font-size: 1.5rem;
}

.layout-topbar .topbar-separator {
  display: block;
  width: 1px;
  border-left: 1px solid #dee2e6;
  align-self: stretch;
  margin: 0 1rem;
}

.layout-topbar .mobile-logo {
  display: none;
}

.layout-topbar .viewname {
  font-weight: 600;
  font-size: 1.25rem;
}

.layout-topbar .topbar-menu {
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
}

.layout-topbar .topbar-menu > li {
  margin-left: 1rem;
  position: relative;
}

.layout-topbar .topbar-menu > li.profile-item {
  padding: 0 1rem 0 1rem;
  border-left: 1px solid #dee2e6;
  border-right: 1px solid #dee2e6;
}

.layout-topbar .topbar-menu > li.profile-item > a {
  width: auto;
  height: auto;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0 0.5rem 0 0;
}

.layout-topbar .topbar-menu > li.profile-item .profile-image {
  border-radius: 8px;
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 0.5rem;
}

.layout-topbar .topbar-menu > li.right-sidebar-item > a {
  background: #f8f9fa;
}

.layout-topbar .topbar-menu > li > a {
  width: 2.5rem;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  color: #495057;
  overflow: hidden;
  border-radius: 8px;
  transition: background-color 0.2s, box-shadow 0.2s;
  display: block;
  position: relative;
  cursor: pointer;
  user-select: none;
  outline: 0 none;
}

.layout-topbar .topbar-menu > li > a:hover {
  background: #e9ecef;
}

.layout-topbar .topbar-menu > li > a:focus {
  box-shadow: 0 0 0 0.2rem #bbdefb;
}

.layout-topbar .topbar-menu > li > a i {
  line-height: inherit;
  font-size: 1.5rem;
}

.layout-topbar .topbar-menu > li > a .topbar-badge {
  position: absolute;
  display: block;
  right: 0;
  top: 0;
  width: 1rem;
  height: 1rem;
  line-height: 1rem;
  font-size: 0.714rem;
  border-radius: 50%;
  font-weight: 600;
  background: #1976d2;
  color: #ffffff;
}

.layout-topbar .topbar-menu > li > ul {
  display: none;
  position: absolute;
  background: #ffffff;
  list-style: none;
  margin: 0;
  padding: 1rem;
  top: 3.25rem;
  right: 0;
  z-index: 999;
  min-width: 250px;
  border: 0 none;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
  animation-duration: 0.12s;
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  border-radius: 4px;
  transform-origin: center top;
}

.layout-topbar .topbar-menu > li > ul li a {
  color: #495057;
  padding: 0.5rem;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  border-radius: 4px;
  transition: background-color 0.2s;
  cursor: pointer;
}

.layout-topbar .topbar-menu > li > ul li a:hover {
  background: #e9ecef;
}

.layout-topbar .topbar-menu > li > ul.notifications-menu .notification-item {
  margin-left: 0.5rem;
}

.layout-topbar .topbar-menu > li > ul.notifications-menu .notification-summary {
  font-weight: 600;
}

.layout-topbar .topbar-menu > li > ul.notifications-menu .notification-detail {
  color: #6c757d;
}

.layout-topbar .topbar-menu > li > ul.profile-menu span {
  margin-left: 0.5rem;
}

.layout-topbar .topbar-menu > li.active-menuitem > ul {
  display: block;
}
</style>
