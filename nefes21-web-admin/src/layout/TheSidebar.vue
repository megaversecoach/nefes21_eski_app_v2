<template>
  <div
    :class="{
      'sidebar active': menuActive,
      'sidebar passive': !menuActive
    }"
  >
    <img id="app-logo" class="app-logo" src="@/assets/app_logo.svg" />
    <span class="version">v{{ appVersion }}</span>
    <div class="sidebar-menu">
      <sidebar-menu :items="menu" :root="true"> </sidebar-menu>
    </div>
  </div>
</template>
<script>
import SidebarMenu from './SidebarMenu'

export default {
  props: ['menuActive'],
  data() {
    return {
      appVersion: process.env.VUE_APP_VERSION,
      menu: [
        {
          label: 'Home',
          icon: 'pi pi-fw pi-home',
          items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' }
          ]
        },
        { separator: true },
        {
          label: 'User Management',
          items: [
            {
              label: 'User Search',
              icon: 'pi pi-fw pi-users',
              to: '/users'
            },
            {
              label: 'Transaction Search',
              icon: 'pi pi-fw pi-dollar',
              to: '/transactions'
            }
          ]
        },
        { separator: true },
        {
          label: 'Content Creators',
          icon: 'pi pi-fw pi-home',
          items: [
            {
              label: 'Authors',
              icon: 'pi pi-fw pi-user-edit',
              to: '/authors'
            },
            {
              label: 'Narrators',
              icon: 'pi pi-fw pi-volume-up',
              to: '/narrators'
            }
          ]
        },
        { separator: true },
        {
          label: 'Content Management',
          icon: 'pi pi-fw pi-clone',
          items: [
            {
              label: 'Contents',
              icon: 'pi pi-fw pi-clone',
              to: '/contents'
            },
            {
              label: 'Soundscapes',
              icon: 'pi pi-fw pi-sliders-h',
              to: '/soundscapes'
            },
            {
              label: 'Decks',
              icon: 'pi pi-fw pi-images',
              to: '/decks'
            }
          ]
        },
        { separator: true },
        {
          label: 'Layout Management',
          icon: 'pi pi-fw pi-home',
          items: [
            {
              label: 'Categories',
              icon: 'pi pi-fw pi-list',
              to: '/categories'
            },
            {
              label: 'Mood Check-In Layout',
              icon: 'pi pi-fw pi-table',
              to: '/moodcheckin-layout'
            },
            {
              label: 'Quick-Start Layout',
              icon: 'pi pi-fw pi-table',
              to: '/quickstart-layout'
            },
            {
              label: 'Dimension Layout',
              icon: 'pi pi-fw pi-table',
              to: '/dimension-layout'
            },
            {
              label: 'Today Starters',
              icon: 'pi pi-fw pi-table',
              to: '/today-starters'
            },
            {
              label: 'Today Showcase Items',
              icon: 'pi pi-fw pi-image',
              to: '/today-showcase-items'
            }
          ]
        },
        { separator: true },
        {
          label: 'Content Pools',
          icon: 'pi pi-fw pi-home',
          items: [
            {
              label: 'Today Series Pool',
              icon: 'pi pi-fw pi-inbox',
              to: '/today-series-pool'
            },
            {
              label: 'Today Showcase Pool',
              icon: 'pi pi-fw pi-inbox',
              to: '/today-showcase-pool'
            }
          ]
        },
        { separator: true },
        {
          label: 'Program Management',
          icon: 'pi pi-fw pi-home',
          items: [
            {
              label: 'Programs',
              icon: 'pi pi-fw pi-video',
              to: '/programs'
            },
            {
              label: 'Programs Layout',
              icon: 'pi pi-fw pi-th-large',
              to: '/program-layout'
            }
          ]
        },
        { separator: true },
        {
          label: 'Product Management',
          icon: 'pi pi-fw pi-home',
          items: [
            {
              label: 'Prepaid Codes',
              icon: 'pi pi-fw pi-credit-card',
              to: '/prepaid-codes'
            },
            {
              label: 'Promo Codes',
              icon: 'pi pi-fw pi-ticket',
              to: '/promo-codes'
            },
            {
              label: 'Products',
              icon: 'pi pi-fw pi-shopping-cart',
              to: '/products'
            },
            {
              label: 'Suppliers',
              icon: 'pi pi-fw pi-sitemap',
              to: '/suppliers'
            }
          ]
        },
        { separator: true },
        {
          label: 'Settings',
          icon: 'pi pi-fw pi-home',
          items: [
            {
              label: 'Maintenance',
              icon: 'pi pi-fw pi-chart-line',
              to: '/settings/maintenance'
            }
          ]
        },
        { separator: true },
        { separator: true }
      ]
    }
  },
  components: {
    SidebarMenu
  }
}
</script>

<style scoped>
.active {
  width: 16rem;
}
.passive {
  width: 0rem;
}
.version {
  text-align: center;
  margin-bottom: 0.6rem;
  color: rgb(92, 91, 117);
}
.sidebar {
  background: rgb(56, 53, 76);

  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  overflow: hidden;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  user-select: none;
  transition: transform 0.4s cubic-bezier(0.05, 0.74, 0.2, 0.99);

  vertical-align: middle;
}
.app-logo {
  display: block;
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}
.sidebar-menu {
  overflow: auto;
  flex: 1;
  padding: 1rem;
}
</style>
