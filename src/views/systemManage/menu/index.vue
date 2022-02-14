<template>
  <!-- 导航栏 -->
  <div class="navbar">
    <div class="left-menu flex align-center">
      <!-- 菜单折叠按钮 -->
      <div class="menu-unfold-outlined">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="toggleSideBar"
        />
        <menu-fold-outlined v-else class="trigger" @click="toggleSideBar" />
      </div>
      <!-- 面包屑 -->
      <Breadcrumb class="breadcrumb-container ml-2"></Breadcrumb>
    </div>
    <div class="right-menu flex">
      <!-- 用户信息 -->
      <a-dropdown class="right-menu-item">
        <div class="avatar-wrapper cursor-pointer">
          <img :src="photo" alt="" class="user-avatar" />
          <span>{{ userName }}</span>
        </div>
        <!-- 用户信息弹出框 -->
        <template #overlay>
          <a-menu>
            <a-menu-item key="0">
              <router-link to="/"> 回到主页 </router-link>
            </a-menu-item>
            <a-menu-item key="1">
              <a
                target="_blank"
                href="https://github.com/webdyc/vue3-antd-admin"
              >
                Github
              </a>
            </a-menu-item>
            <a-menu-item key="3">
              <a target="_blank" href="https://webdyc.com/"> 博客地址 </a>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="4" @click="logout">
              <div>退出登录</div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <!-- 国际化 -->
      <a-dropdown class="right-menu-item" :trigger="['click']">
        <div class="avatar-wrapper cursor-pointer">
          <svg-icon :icon-name="'international'" class-name="navbar-svg" />
        </div>
        <!-- 用户信息弹出框 -->
        <template #overlay>
          <a-menu class="right-menu-item-lang">
            <a-menu-item
              v-for="(item, index) in lang"
              :key="index"
              @click="toggleLang(item.value)"
            >
              <div class="align-center flex">
                <svg-icon :icon-name="item.name" class-name="language-svg" />
                <div :class="{ current: lang_current == item.value }">
                  {{ item.label }}
                </div>
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>
<script>
import { computed, reactive, toRefs } from '@vue/reactivity'
import { useStore } from 'vuex'
import { onBeforeMount } from '@vue/runtime-core'
import {
  menu_treeselect,
  menu_list,
  menu_create,
  menu_info,
  menu_remove,
  menu_update
} from '@/api/systemManage/menu'

// 路由表
const menuListM = [
  {
    id: 1,
    path: '/',
    component: 'Layout',
    redirect: 'welcome',
    children: [
      {
        id: 11,
        path: 'welcome',
        name: 'Welcome',
        component: '/welcome/index',
        meta: {
          title: '欢迎首页',
          role: ['admin', 'addbtn1'],
          icon: 'example'
        }
      }
    ]
  },
  {
    id: 2,
    path: '/user',
    component: 'Layout',
    redirect: '/user/index',
    children: [
      {
        id: 21,
        path: '/user/index',
        name: 'user',
        component: '/user/index',
        meta: {
          title: '用户管理',
          icon: 'table'
        }
      }
    ]
  },
  {
    id: 3,
    path: '/charts',
    component: 'Layout',
    redirect: '/charts/index',
    meta: {
      title: '图表管理',
      icon: 'table'
    },
    children: [
      {
        id: 31,
        path: '/charts/index',
        name: 'chartsline',
        component: '/charts/line/index',
        meta: {
          title: '折线图'
        }
      },
      {
        id: 32,
        path: '/charts/mixChart',
        name: 'chartsmixChart',
        component: '/charts/mixChart/index',
        meta: {
          title: '混合图表'
        }
      }
    ]
  },
  {
    id: 4,
    path: '/components',
    component: 'Layout',
    redirect: '/tinymce/index',
    meta: {
      title: '组件',
      icon: 'table'
    },
    children: [
      {
        id: 41,
        path: '/recorder/index',
        name: 'recorder',
        component: '/components/recorder/index',
        meta: {
          title: '录音'
        }
      },
      {
        id: 42,
        path: '/tinymce/index',
        name: 'tinymce',
        component: '/components/tinymce/index',
        meta: {
          title: '富文本编译器'
        }
      },
      {
        id: 43,
        path: '/componentsDemo/index',
        name: 'componentsDemo',
        component: '/components/componentsDemo/index',
        meta: {
          title: '小组件'
        }
      },
      {
        id: 44,
        path: '/dragDalog/index',
        name: 'dragDalog',
        component: '/components/dragDalog/index',
        meta: {
          title: '可拖拽弹窗'
        }
      },
      {
        id: 45,
        path: '/dragKanban/index',
        name: 'dragKanban',
        component: '/components/dragKanban/index',
        meta: {
          title: '可拖拽看板'
        }
      }
    ]
  },
  {
    id: 5,
    path: '/permission',
    component: 'Layout',
    redirect: '/permission/index',
    children: [
      {
        id: 51,
        path: '/permission/index',
        name: 'permission',
        component: '/permission/index',
        meta: {
          title: '指令权限',
          icon: 'table'
        }
      }
    ]
  },
  {
    id: 6,
    path: '/menu',
    component: 'Layout',
    redirect: '/menu/index',
    children: [
      {
        id: 61,
        path: '/menu/index',
        name: 'menu',
        component: '/menu/index',
        meta: {
          title: '菜单管理',
          icon: 'table'
        }
      }
    ]
  }
]

/**
* parentId: null              上级菜单
* menuType: M,                菜单类型
* sort: 1,                    排序
* hidden: true,               是否隐藏路由
* path: '/welcome',           路由地址
* component:'Layout',         vue文件路径
* redirect: noredirect,       路由重定向
* name:'welcome',             路由名称父级可不填
* 单层级路由父级可不填
  role: 'admin',               页面权限
  title: 'title'               页面标题
  icon: 'svg-name'             页面图标
  breadcrumb: false,           如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
  keepAlive: false,            页面是否缓存
**/
// PersonForm的类
class PersonForm {
  // 值
  constructor() {
    // 上级菜单
    this.parentId = null
    // 菜单类型
    this.menuType = 'M'
    // 排序
    this.sort = 1
    // 是否隐藏路由
    this.hidden = false
    // 路由地址
    this.path = ''
    // vue文件路径
    this.component = ''
    // 路由重定向
    this.redirect = ''
    // 路由名称父级可不填
    this.name = ''
    // 单层级路由父级可不填
    // 页面权限
    this.role = ''
    // 页面标题
    this.title = ''
    //  页面图标
    this.icon = ''
    //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
    this.breadcrumb = true
    //  页面是否缓存
    this.keepAlive = false
  }
  // 验证方法
  static getRule() {
    return {
      title: [{ required: true, message: '请填写标题名称', trigger: 'blur' }],
      title_e: [{ required: true, message: '请填写权限名称', trigger: 'blur' }]
    }
  }
}

export default {
  name: 'Menu',
  components: {},
  setup() {
    const store = useStore()
    const state = reactive({
      // 搜索项
      searchForm: {
        // 每页条数
        pageSize: 10,
        // 当前页码
        pageNum: 1
      },
      // 菜单下拉树数组
      menuTreeselectId: [],
      menuTreeselectArr: [
        {
          value: '1',
          label: '全部'
        },
        {
          value: '2',
          label: '手动添加'
        },
        {
          value: '3',
          label: '自动导入'
        }
      ],
      defaultProps: {
        value: 'id',
        checkStrictly: true
      },
      // 表格数据
      formLabelWidth: '140px',
      tableLoading: false,
      tableData: menuListM,
      // 总条数
      total: 0,
      // 表单弹出框
      isUpdate: false,
      updateFormVisible: false,
      updateFormLoading: false,
      updateForm: new PersonForm(),
      updateFormRules: PersonForm.getRule()
    })
    // 获取列表
    onBeforeMount(async () => {
      handleSearch()
    })
    // 获取菜单展开收起状态
    const collapsed = computed(() => {
      return store.getters.sidebar.opened
    })
    // 获取菜单下拉树列表
    const getMenuTreeselect = async () => {
      state.menuTreeselectArr = await menu_treeselect().then((res) => res.data)
    }
    // 筛选项提交
    const handleSearch = async () => {
      state.tableLoading = true
      let { code, data, total } = await menu_list(state.searchForm)
      if (code === 200) {
        state.tableData = data
        state.total = total
        state.tableLoading = false
      }
    }
    return {
      ...toRefs(state)
    }
  }
}
</script>
<style lang="scss" scoped></style>
