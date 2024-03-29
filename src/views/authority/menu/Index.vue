<template>
  <div class="app-content">
    <!-- 表格配置 -->
    <div class="table-config">
      <a-button type="primary" @click="handleAdd">
        <template #icon>
          <PlusOutlined />
        </template>
        新增一级菜单
      </a-button>
    </div>
    <!-- 表格内容 -->
    <a-table
      :columns="tableColumns"
      :data-source="tableData"
      :row-key="(record) => record.id"
      bordered
    >
      <template #keepAlive="{ column, record }">
        {{ record.keepAlive ? '是' : '否' }}
      </template>
      <template #hidden="{ column, record }">
        {{ record.hidden ? '是' : '否' }}
      </template>
      <template #menuType="{ column, record }">
        <span v-if="record.menuType === 'M'">目录</span>
        <span v-else-if="record.menuType === 'C'">菜单</span>
        <span v-else-if="record.menuType === 'F'">按钮</span>
      </template>
      <template #action="{ column, record }">
        <a-button default type="text" @click="handleAdd(record)">新增</a-button>
        <a-button type="link" @click="handleEdit(record)">编辑</a-button>
        <a-popconfirm
          title="是否要删除?"
          cancel-text="取消"
          ok-text="确定"
          @confirm="handleDelete(record.id)"
        >
          <a-button danger type="text">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <!-- 新增/编辑弹出框 -->
    <a-modal
      class="table-modal"
      v-model:visible="updateFormVisible"
      :title="isUpdate ? '编辑菜单' : '添加菜单'"
      :confirm-loading="updateFormLoading"
      :afterClose="closeForm"
      @ok="handleSubmit"
    >
      <div class="table-modal-content" v-ant-drag-dialog>
        <a-form :model="updateForm" v-bind="updateFormLayout" layout="inline">
          <a-row>
            <a-form-item label="上级菜单：">
              <a-cascader
                v-model:value="menuTreeselectId"
                :options="menuTreeselectArr"
              />
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="菜单类型：">
              <a-radio-group v-model:value="updateForm.menuType">
                <a-radio value="M">目录</a-radio>
                <a-radio value="C">菜单</a-radio>
                <a-radio value="F">按钮</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-row>
          <a-form-item label="菜单名称：">
            <a-input v-model:value="updateForm.title" placeholder="title" />
          </a-form-item>
          <template
            v-if="updateForm.menuType === 'M' || updateForm.menuType === 'C'"
          >
            <a-form-item label="路由名称：">
              <a-input v-model:value="updateForm.name" placeholder="name" />
            </a-form-item>
            <a-form-item label="路由地址：">
              <a-input v-model:value="updateForm.path" placeholder="path" />
            </a-form-item>
            <a-form-item label="文件路径：">
              <a-input
                v-model:value="updateForm.component"
                placeholder="component"
              />
            </a-form-item>
            <a-form-item
              label="路由重定向："
              v-if="updateForm.menuType === 'M'"
            >
              <a-input
                v-model:value="updateForm.redirect"
                placeholder="redirect"
              />
            </a-form-item>
            <a-form-item label="图标：" v-if="updateForm.menuType === 'M'">
              <a-input v-model:value="updateForm.icon" placeholder="icon" />
            </a-form-item>
            <a-form-item
              label="面包屑显示："
              v-if="updateForm.menuType === 'C'"
            >
              <a-switch v-model:checked="updateForm.breadcrumb" />
            </a-form-item>
            <a-form-item label="是否缓存：" v-if="updateForm.menuType === 'C'">
              <a-switch v-model:checked="updateForm.keepAlive" />
            </a-form-item>
            <a-form-item label="隐藏路由：" v-if="updateForm.menuType === 'C'">
              <a-switch v-model:checked="updateForm.hidden" />
            </a-form-item>
          </template>

          <a-form-item label="按钮权限：" v-if="updateForm.menuType === 'F'">
            <a-input v-model:value="updateForm.role" placeholder="role" />
          </a-form-item>
          <a-form-item label="排序：">
            <a-input v-model:value="updateForm.sort" placeholder="sort" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { reactive, toRefs } from '@vue/reactivity'
import { PlusOutlined } from '@ant-design/icons-vue'
import { user_list, user_create } from '@/api/authority/user'
import { onBeforeMount } from '@vue/runtime-core'
import { message } from 'ant-design-vue'
import { deepClone, findPatentValue } from '@/utils'
import {
  menu_treeselect,
  menu_list,
  menu_create,
  menu_info,
  menu_remove,
  menu_update
} from '@/api/systemManage/menu'

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
    slots: { customRender: 'keepAlive' },
    align: 'center'
  },
  {
    title: '隐藏路由',
    key: 'hidden',
    dataIndex: 'hidden',
    slots: { customRender: 'hidden' },
    align: 'center'
  },
  {
    title: '菜单类型',
    key: 'menuType',
    dataIndex: 'menuType',
    slots: { customRender: 'menuType' },
    align: 'center'
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    slots: { customRender: 'action' },
    align: 'center'
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
  name: 'Menu',
  components: { PlusOutlined },
  setup() {
    const state = reactive({
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
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      }
    })
    // 获取列表
    onBeforeMount(async () => {
      handleSearch()
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
    // 删除
    const handleDelete = () => {}
    // 打开新增弹框
    const handleAdd = async (row) => {
      // 获取菜单下拉树列表
      await getMenuTreeselect()
      if (row) {
        state.menuTreeselectId = findPatentValue(
          state.menuTreeselectArr,
          row.id,
          'id'
        )
      }
      state.updateFormVisible = true
    }
    // 打开弹框
    const handleEdit = () => {
      state.updateFormVisible = true
    }
    // 弹窗表单提交
    const handleSubmit = () => {
      state.updateFormLoading = true
      user_create(state.updateForm).then((res) => {
        let { user } = res.content
        if (user) {
          state.updateFormLoading = false
          state.updateFormVisible = false
          handleSearch()
        } else {
          message.warning(res.msg)
          state.updateFormLoading = false
        }
      })
    }
    // 关闭弹窗
    const closeForm = () => {
      state.updateForm = new PersonForm()
      state.updateFormRules = PersonForm.getRule()
      state.updateFormLoading = false
      state.updateFormVisible = false
    }
    return {
      ...toRefs(state),
      handleSearch,
      handleAdd,
      handleEdit,
      handleSubmit,
      handleDelete,
      closeForm
    }
  }
}
</script>
