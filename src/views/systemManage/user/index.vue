<template>
  <div class="app-content">
    <a-form :model="searchForm" v-bind="updateFormLayout">
      <a-form-item label="姓名：">
        <a-input
          v-model:value="searchForm.username"
          placeholder="input placeholder"
        />
      </a-form-item>
      <a-form-item label="手机号：">
        <a-input
          v-model:value="searchForm.username"
          placeholder="input placeholder"
        />
      </a-form-item>
      <a-form-item label="场馆：">
        <a-input
          v-model:value="searchForm.username"
          placeholder="input placeholder"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary">搜索</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import defaultSettings from '@/settings'
import { reactive, toRefs } from '@vue/reactivity'

const columns = [
  {
    title: '路由地址',
    dataIndex: 'path',
    key: 'path'
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    align: 'center'
  },
  {
    title: '路由名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '文件路径',
    key: 'component',
    dataIndex: 'component',
    align: 'center'
  },
  {
    title: '路由重定向',
    key: 'redirect',
    dataIndex: 'redirect',
    align: 'center'
  },
  {
    title: '图标',
    key: 'icon',
    dataIndex: 'icon',
    align: 'center'
  },
  {
    title: '是否缓存',
    key: 'keepAlive',
    dataIndex: 'keepAlive',
    align: 'center'
  },
  {
    title: '隐藏路由',
    key: 'hidden',
    dataIndex: 'hidden',
    align: 'center'
  },
  {
    title: '菜单类型',
    key: 'menuType',
    dataIndex: 'menuType',
    align: 'center'
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    align: 'center',
    fixed: 'right',
    width: 200
  }
]

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
  setup() {
    const state = reactive({
      styleSize: defaultSettings.styleSize,
      // 搜索项
      searchForm: {
        // 用户名
        username: '',
        // 手机号
        phone: '',
        // 真实姓名
        truename: '',
        // 每页条数
        pageSize: 10,
        // 当前页码
        pageNum: 1,
        // 禁启用（true：启用，false：禁用）
        status: ''
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
      tableData: [],
      tableLoading: false,
      // 表头数据
      tableColumns: columns,
      // 总条数
      total: 0,
      // 表单弹出框
      isUpdate: false,
      updateFormVisible: false,
      updateFormLoading: false,
      updateForm: new PersonForm(),
      updateFormRules: PersonForm.getRule(),
      // 弹出框表单宽度参数
      updateFormLayout: {
        layout: 'inline'
      }
    })
    return {
      ...toRefs(state)
    }
  }
}
</script>
