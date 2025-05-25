<template>
  <ul class="layout-menu">
    <template v-for="(item, i) of items" :key="item">
      <li
        v-if="!item.seperator"
        :key="item.label || i"
        :class="[
          {
            'layout-root-menuitem': root,
            'active-menuitem': activeIndex === i && item.disabled
          }
        ]"
      >
        <!-- Router Link -->

        <router-link
          v-if="item.to"
          :to="item.to"
          :style="item.style"
          :class="item.class"
          active-class="active-route"
          :target="item.target"
          exact
        >
          <i :class="['layout-menuitem-icon', item.icon]"></i>
          <span class="layout-menuitem-text">{{ item.label }}</span>
        </router-link>
      </li>
      <div class="layout-root-menuitem" v-if="root">
        <div
          class="layout-menuitem-root-text"
          style="text-transform: uppercase"
        >
          {{ item.label }}
        </div>
      </div>
      <sidebar-menu :items="item.items"></sidebar-menu>

      <li
        class="menu-separator"
        :style="item.style"
        v-if="item.separator"
        :key="'separator' + i"
        role="separator"
      ></li>
    </template>
  </ul>
</template>
<script>
export default {
  name: 'SidebarMenu',
  props: {
    items: Array,
    root: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      asd: null,
      activeIndex: null
    }
  }
}
</script>
<style scoped>
.layout-menu {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.layout-menu .menu-separator {
  margin: 0;
}
.layout-menu .layout-root-menuitem > .layout-menuitem-root-text {
  display: flex;
  color: rgb(107, 99, 133);
  font-size: 0.857rem;
  text-transform: uppercase;
  font-weight: 700;
  padding: 0.5rem 0 0.5rem 0;
}
.layout-menu .layout-root-menuitem > a {
  display: none;
}
.layout-menu .layout-root-menuitem .layout-menu-tooltip {
  display: none;
}
.layout-menu .layout-root-menuitem .layout-menu-leave-to {
  max-height: 0;
}
.layout-menu .layout-root-menuitem .layout-menu-leave-from {
  max-height: 1000px;
}
.layout-menu .layout-root-menuitem .layout-menu-leave-active {
  overflow: hidden;
  transition: max-height 0.45s cubic-bezier(0, 1, 0, 1);
}
.layout-menu ul {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.layout-menu ul a {
  color: rgba(255, 255, 255, 0.8);
  background-color: rgb(67, 65, 90);
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  position: relative;
  padding: 0.5rem;
  margin: 0.2rem;
  font-size: 0.88rem;
  border-radius: 8px;
  outline: 0 none;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
}
.layout-menu ul a:hover {
  background-color: rgb(77, 75, 100);
}
.layout-menu ul a .layout-menuitem-icon {
  margin-right: 0.5rem;
}
.layout-menu ul a .layout-submenu-toggler {
  font-size: 75%;
  margin-left: auto;
  transition: transform 0.2s;
}
.layout-menu ul a.rotated-icon .layout-menuitem-icon {
  transform: rotate(90deg);
}
.layout-menu ul a.active-route {
  font-weight: 800;
  color: rgb(226, 241, 237);
  background-color: rgb(92, 91, 117);
  text-shadow: 2px 2px 4px rgb(67, 65, 90);
}
.layout-menu ul li.active-menuitem {
  border-radius: 4px;
}
.layout-menu ul li.active-menuitem > a .layout-submenu-toggler {
  transform: rotate(-180deg);
}
.layout-menu ul li.active-menuitem .layout-menu-enter-from {
  max-height: 0;
}
.layout-menu ul li.active-menuitem .layout-menu-enter-to {
  max-height: 1000px;
}
.layout-menu ul li.active-menuitem .layout-menu-enter-active {
  overflow: hidden;
  transition: max-height 1s ease-in-out;
}
.layout-menu ul ul {
  overflow: hidden;
  border-radius: 4px;
}
.layout-menu ul ul li a {
  padding-left: 1.5rem;
}
.layout-menu ul ul li li a {
  padding-left: 2.5rem;
}
.layout-menu ul ul li li li a {
  padding-left: 3.5rem;
}
.layout-menu ul ul li li li li a {
  padding-left: 4.5rem;
}
.layout-menu ul ul li li li li li a {
  padding-left: 5.5rem;
}
.layout-menu ul ul li li li li li li a {
  padding-left: 6.5rem;
}
</style>
