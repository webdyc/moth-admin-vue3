<template>
  <!-- 框架主页 -->
  <a-layout id="layout-main" :class="collapsed ? 'hideSidebar' : 'openSidebar'">
    <!-- 侧边栏 -->
    <a-layout-sider
      class="ant-pro-sider-fixed"
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      :width="220"
    >
      <Sidebar />
    </a-layout-sider>
    <!-- 右侧内容区 -->
    <a-layout :class="{ hasTagsView: needTagsView }" class="main-container">
      <!-- 头部导航栏 -->
      <a-layout-header class="fixed-header">
        <Navbar />
        <tags-view v-if="needTagsView" />
      </a-layout-header>
      <!-- 视图区域 -->
      <a-layout-content>
        <AppMain />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { computed, reactive, ref, toRefs } from '@vue/reactivity'
import Navbar from './components/Navbar'
import TagsView from './components/TagsView'
import AppMain from './components/AppMain'
import Sidebar from './components/Sidebar/Index'
import { useStore } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    TagsView,
    Sidebar
  },
  setup() {
    const store = useStore()
    // 菜单折叠按钮状态
    const collapsed = computed(() => {
      return store.getters.sidebar.opened
    })
    // 标签页状态
    const needTagsView = computed(() => {
      return store.state.settings.tagsView
    })

    return {
      collapsed,
      needTagsView
    }
  }
}
</script>
<style lang="scss" scoped>
#layout-main {
  min-height: 100vh;
}
// 导航栏头部
.ant-layout-header {
  background: #fff;
  padding: 0;
  height: 50px;
  line-height: 50px;
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}
.hasTagsView .ant-layout-header {
  height: 80px;
}
// 视图区内容
.fixed-header + .ant-layout-content {
  padding-top: 50px;
}
.hasTagsView {
  .fixed-header + .ant-layout-content {
    padding-top: 84px;
  }
}
.hideSidebar .fixed-header {
  width: calc(100% - $sideBaHideWidth);
}
</style>
