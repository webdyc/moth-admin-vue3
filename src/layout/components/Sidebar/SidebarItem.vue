<template>
  <a-sub-menu :key="menu.path">
    <template #title>
      <span class="anticon">
        <svg-icon
          :icon-name="menu.meta && menu.meta.icon"
          class-name="aside-svg"
        />
      </span>
      <span>{{ menu.meta && menu.meta.title }}</span>
    </template>
    <template v-if="menu.children && menu.children.length">
      <template v-for="item in menu.children">
        <template v-if="!item.hidden">
          <!-- 不存在子级的栏目 -->
          <a-menu-item v-if="!item.children" :key="resolvePath(item.path)">
            <router-link :to="resolvePath(item.path)">{{
              item.meta && item.meta.title
            }}</router-link>
          </a-menu-item>
          <!-- 存在子级栏目 -->
          <template v-else>
            <SidebarItem
              :key="item.path"
              :menu="item"
              :base-path="resolvePath(item.path)"
            />
          </template>
        </template>
      </template>
    </template>
  </a-sub-menu>
</template>
<script>
import path from 'path'
import { isExternal } from '@/utils/validate'

export default {
  name: 'SidebarItem',
  components: {},
  props: {
    menu: {
      type: Object, // array
      default: () => ({})
    },
    // 父级路径
    basePath: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    // 路由跳转添加父级路径
    const resolvePath = (routePath) => {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(props.basePath)) {
        return props.basePath
      }
      return path.resolve(props.basePath, routePath)
    }
    return {
      resolvePath
    }
  }
}
</script>
<style lang="scss" scoped>
.aside-menu {
  i.icon {
    margin-right: 5px;
    opacity: 0.6;
  }
  .ant-menu-submenu-open {
    > div {
      i.icon {
        opacity: 1;
      }
    }
  }
}
</style>
