<template>
  <div class="scroll-container">
    <div id="tags-view-container" class="tags-view-container">
      <div class="tags-view-wrapper">
        <router-link
          v-for="tag in visitedViews"
          ref="tag"
          :key="tag.path"
          :class="isActive(tag) ? 'active' : ''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="span"
          class="tags-view-item"
          @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
          @contextmenu.prevent.native="openMenu(tag, $event)"
        >
          {{ tag.title }}

          <close-outlined
            v-if="!isAffix(tag)"
            class="el-icon-close"
            @click.prevent.stop="closeSelectedTag(tag)"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { CloseOutlined } from '@ant-design/icons-vue'
import ScrollPane from './Scrollpane.vue'
import path from 'path'
import { onMounted } from '@vue/runtime-core'
import { computed, reactive, toRefs } from '@vue/reactivity'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  components: { ScrollPane, CloseOutlined },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const store = useStore()
    const tag = ref([])
    const el = ref(null)
    const stateData = reactive({
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    })
    const visitedViews = computed(() => {
      return store.state.tagsView.visitedViews
    })
    // 获取路由
    const routes = computed(() => {
      return store.state.permission.routes
    })
    const addTags = async () => {
      const { name } = route
      if (name) {
        store.dispatch('tagsView/addView', route)
      }
      return false
    }
    const moveToCurrentTag = async () => {
      const tags = tag.value
      for (const tag of tags) {
        if (tag.to.path === route.path) {
          //   this.$refs.scrollPane.moveToTarget(tag)
          // when query is different then update
          if (tag.to.fullPath !== route.fullPath) {
            store.dispatch('tagsView/updateVisitedView', route)
          }
          break
        }
      }
    }
    // 监听路由跳转
    watch(
      () => route.path,
      () => {
        addTags()
        moveToCurrentTag()
      },
      {
        immediate: true, // 是否初始化立即执行一次, 默认是false
        deep: true // 是否是深度监视, 默认是false
      }
    )
    // 监听路由跳转
    watch(
      () => stateData.visible,
      (value) => {
        if (value) {
          document.body.addEventListener('click', closeMenu)
        } else {
          document.body.removeEventListener('click', closeMenu)
        }
      },
      {
        immediate: true, // 是否初始化立即执行一次, 默认是false
        deep: true // 是否是深度监视, 默认是false
      }
    )
    // 页面渲染
    onMounted(async () => {
      initTags()
      addTags()
    })
    // 是否为选中
    const isActive = (row) => {
      return route.path === row.path
    }
    const isAffix = (tag) => {
      return tag.meta && tag.meta.affix
    }
    const filterAffixTags = (routesA, basePath = '/') => {
      let tags = []
      routesA.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags || []
    }
    const initTags = async () => {
      const affixTags = (stateData.affixTags = await filterAffixTags(
        routes.value
      ))
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    }
    const closeSelectedTag = (view) => {
      store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (isActive(view)) {
          toLastView(visitedViews, view)
        }
      })
    }
    const toLastView = (visitedViews, view) => {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          router.replace({ path: '/redirect' + view.fullPath })
        } else {
          router.push('/')
        }
      }
    }
    const openMenu = (view) => {
      const menuMinWidth = 105
      const offsetLeft = el.value.getBoundingClientRect().left // container margin left
      const offsetWidth = el.value.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        stateData.left = maxLeft
      } else {
        stateData.left = left
      }

      stateData.top = e.clientY
      stateData.visible = true
      stateData.selectedTag = tag
    }
    const closeMenu = async (view) => {
      stateData.visible = false
    }
    const handleScroll = async (view) => {
      closeMenu()
    }
    return {
      ...toRefs(stateData),
      route,
      visitedViews,
      routes,
      addTags,
      isActive,
      closeSelectedTag,
      isAffix
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-container {
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 49px;
    }
  }
}
.tags-view-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;

  .tags-view-wrapper {
    display: flex;
    align-items: center;
    height: 34px;
    line-height: 34px;
    overflow: auto hidden;
    .tags-view-item {
      display: flex;
      align-items: center;
      display: inline-block;
      cursor: pointer;
      height: 26px;
      line-height: 22px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      font-weight: 200;
      margin-left: 5px;
      white-space: nowrap;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #27a6fe;
        color: #fff;
        border-color: #27a6fe;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      font-size: 9px;
      width: 16px;
      height: 16px;
      vertical-align: middle;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
      svg {
        margin-top: 3px;
      }
    }
  }
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
</style>
