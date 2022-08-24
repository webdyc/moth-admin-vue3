<template>
  <div class="app-box">
    <div class="app-box-table">
      <a-card title="组织结构" class="box-card" shadow="never">
        <template #extra><a href="#">组织结构</a></template>
        <a-tree
          class="content_tree"
          show-line
          :tree-data="treeList"
          :field-names="fieldNames"
          @select="handleNodeClick"
        >
          <template #switcherIcon="{ switcherCls }"
            ><down-outlined :class="switcherCls"
          /></template>
        </a-tree>
      </a-card>
      <div class="app-box-table-box">
        <!-- 搜索项 -->
        <a-form
          :model="searchForm"
          v-bind="updateFormLayout"
          class="search-form"
        >
          <a-form-item label="角色名称：">
            <a-input v-model:value="searchForm.username" placeholder="请输入" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSearch">搜索</a-button>
          </a-form-item>
        </a-form>
        <!-- 表格配置 -->
        <div class="table-config">
          <a-button class="mr-1" type="primary" @click="handleEdit()">
            新增角色
          </a-button>
          <a-button class="mr-1" type="danger" @click="handleDelete()">
            批量删除
          </a-button>
          <!-- <FileExcel ref="fileExcel" @import="importFile" /> -->
        </div>
        <!-- 表格内容 -->
        <a-table
          :columns="tableColumns"
          :dataSource="tableData"
          :loading="tableLoading"
          :pagination="pagination"
          bordered
          class="components-table-demo-nested"
          @change="handleTableChange"
        >
          <template v-slot:bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'useable'">
              <!-- <a-switch
                v-model:checked="record.useable == '0' ? true : false"
              /> -->
            </template>
            <template v-if="column.dataIndex === 'action'">
              <a class="mr-1" @click="handleAdd(record)">新增</a>
              <a class="mr-1" @click="handleEdit(record)">编辑</a>
              <a-popconfirm
                title="是否要删除?"
                cancel-text="取消"
                ok-text="确定"
                @confirm="handleDelete(record.id)"
              >
                <a>删除</a>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>
<script>
import defaultSettings from '@/settings'
import { reactive, toRefs } from '@vue/reactivity'
import { onBeforeMount } from '@vue/runtime-core'
import { DownOutlined } from '@ant-design/icons-vue'
import {
  role_list,
  role_stateChange,
  role_delete,
  role_detail,
  role_add,
  role_edit,
  treeselectrole
} from '@/api/systemManage/role.js'
import { organization_treeselect } from '@/api/systemManage/organization.js'

const columns = [
  {
    title: '角色名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '所属组织',
    dataIndex: 'officeName',
    key: 'officeName',
    align: 'center'
  },
  {
    title: '创建人',
    dataIndex: 'userName',
    key: 'userName',
    align: 'center'
  },
  {
    title: '创建日期',
    key: 'createTime',
    dataIndex: 'createTime',
    align: 'center'
  },
  {
    title: '角色描述',
    key: 'remarks',
    dataIndex: 'remarks',
    align: 'center'
  },
  {
    title: '状态',
    key: 'useable',
    dataIndex: 'useable',
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
    this.id = ''
    this.name = ''
    this.remarks = ''
    this.menuIdList = []
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
  components: { DownOutlined },
  setup() {
    const state = reactive({
      styleSize: defaultSettings.styleSize,
      // 左侧树数据
      treeList: [],
      fieldNames: {
        children: 'children',
        title: 'label'
      },

      // 搜索项
      searchForm: {
        // 用户名
        username: '',
        // 当前选择组织
        officeValue: '',
        // 每页条数
        pageSize: 10,
        // 当前页码
        pageNum: 1
      },

      // 表格数据
      tableData: [],
      tableLoading: false,
      // 表头数据
      tableColumns: columns,
      // 分页
      pagination: {
        total: 0,
        showTotal: (total) => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '15', '20'],
        onShowSizeChange: (current, pageSize) =>
          (searchForm.pageSize = pageSize)
      },
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
    // 页面渲染
    onBeforeMount(async () => {
      getOrganizationTree()
      handleSearch()
    })
    // 获取组织树
    const getOrganizationTree = async () => {
      let { code, data } = await organization_treeselect()
      if (code === 200) {
        state.treeList = data
      }
    }
    // 组织树选择
    const handleNodeClick = async (selectedKeys, e) => {
      let { id, value } = e.node
      state.searchForm.officeValue = value
      state.searchForm.id = id
      handleSearch()
    }
    // 筛选项提交
    const handleSearch = async () => {
      state.tableLoading = true
      // 获取角色列表
      let { code, rows, total } = await role_list(state.searchForm)
      if (code === 200) {
        state.tableData = rows
        state.pagination.total = total
        state.tableLoading = false
      }
    }
    // 分页
    const handleTableChange = (pag, filters, sorter) => {
      state.searchForm.pageSize = pag.pageSize
      state.searchForm.pageNum = pag.current
      handleSearch()
    }
    return {
      ...toRefs(state),
      handleSearch,
      handleNodeClick,
      handleTableChange
    }
  }
}
</script>
