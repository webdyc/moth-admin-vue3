<template>
  <div class="app-box">
    <div class="app-box-table">
      <a-card title="组织结构" class="box-card" shadow="never">
        <template #extra><a href="#">组织结构</a></template>
        <a-tree
          class="content_tree"
          show-line
          :tree-data="organizationTree"
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
        <a-form class="search-form" :model="searchForm" layout="inline">
          <a-form-item label="组织名称：">
            <a-input
              v-model:value="searchForm.name"
              placeholder="请输入"
              :size="styleSize"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSearch">搜索</a-button>
          </a-form-item>
        </a-form>
        <!-- 表格配置 -->
        <div class="table-config">
          <a-button class="mr-1" type="primary" @click="handleEdit(false)">
            新增组织
          </a-button>
          <!-- <FileExcel ref="fileExcel" @import="importFile" /> -->
        </div>
        <!-- 表格内容 -->
        <a-table
          :scroll="{ x: 1000 }"
          :columns="tableColumns"
          :dataSource="tableData"
          :loading="tableLoading"
          :pagination="pagination"
          bordered
          class="components-table-demo-nested"
          @change="handleTableChange"
        >
          <template v-slot:bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'state'">
              <a-switch
                v-model:checked="record.state"
                @click="handelSwitchChange(record)"
              />
            </template>
            <template v-if="column.dataIndex === 'action'">
              <a @click="handleEdit(true, record)">编辑</a>
              <a-divider type="vertical" />
              <a @click="handleDelete(record)">删除</a>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
  <!-- 新增/编辑弹出框 -->
  <a-modal
    class="table-modal"
    width="50%"
    v-model:visible="updateFormVisible"
    :title="isUpdate ? '编辑组织' : '添加组织'"
    :confirm-loading="updateFormLoading"
    :afterClose="updateFormVisibleClose"
    @ok="handleSubmit"
  >
    <div class="table-modal-content" v-ant-drag-dialog>
      <a-form :model="updateForm" v-bind="updateFormLayout">
        <a-form-item label="组织名称：">
          <a-input v-model:value="updateForm.name" :size="styleSize" />
        </a-form-item>
        <a-form-item label="组织描述：">
          <a-textarea
            v-model:value="updateForm.remarks"
            :auto-size="{ minRows: 5, maxRows: 5 }"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>
<script>
import defaultSettings from '@/settings'
import { reactive, toRefs } from '@vue/reactivity'
import { onBeforeMount } from '@vue/runtime-core'
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { createVNode } from 'vue'
import { Modal, message } from 'ant-design-vue'
import {
  organization_list,
  organization_treeselect,
  organization_stateChange,
  organization_add,
  organization_delete,
  organization_edit,
  organization_detail,
  addInfo,
  officePeculiar
  // semantic,
} from '@/api/systemManage/organization.js'
import { deepClone } from '@/utils'
import debounce from 'lodash.debounce'

const columns = [
  {
    title: '组织名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '上级组织',
    dataIndex: 'parentName',
    key: 'parentName',
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
    title: '备注',
    key: 'remarks',
    dataIndex: 'remarks',
    align: 'center'
  },
  {
    title: '状态',
    key: 'state',
    dataIndex: 'state',
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
    const stateData = reactive({
      styleSize: defaultSettings.styleSize,
      // 左侧树数据
      organizationTree: [],
      fieldNames: {
        children: 'children',
        title: 'label',
        key: 'id'
      },
      // 搜索项
      searchForm: {
        // 角色名
        name: '',
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
          (stateData.searchForm.pageSize = pageSize)
      },
      // 表单弹出框
      isUpdate: false,
      updateFormVisible: false,
      updateFormLoading: false,
      updateForm: new PersonForm(),
      updateFormRules: PersonForm.getRule(),

      // 弹出框表单宽度参数
      updateFormLayout: {
        labelCol: { style: { width: '140px' } },
        wrapperCol: { span: 18 }
      },
      // 权限菜单树
      menuTree: []
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
        stateData.organizationTree = data
      }
    }
    // 组织树选择
    const handleNodeClick = async (selectedKeys, e) => {
      let { id, value } = e.node
      stateData.searchForm.officeValue = value
      stateData.searchForm.id = id
      handleSearch()
    }
    // 筛选项提交
    const handleSearch = async () => {
      stateData.tableLoading = true
      // 获取角色列表
      let { code, rows, total } = await organization_list(stateData.searchForm)
      if (code === 200) {
        stateData.tableData = rows.map((item) => {
          item.state = item.useable == '0' ? true : false
          return item
        })
        stateData.pagination.total = total
        stateData.tableLoading = false
      }
    }
    // 分页
    const handleTableChange = (pag, filters, sorter) => {
      stateData.searchForm.pageSize = pag.pageSize
      stateData.searchForm.pageNum = pag.current
      handleSearch()
    }
    // 打开弹框
    const handleEdit = (state, row) => {
      stateData.isUpdate = state
      if (stateData.isUpdate) {
        stateData.updateForm = deepClone(row)
      } else {
        if (stateData.searchForm.id) {
          stateData.updateForm.officeId = stateData.searchForm.id
        } else {
          message.warning('请先选择左侧组织')
          return false
        }
      }
      stateData.updateFormVisible = true
    }
    // 关闭弹窗
    const updateFormVisibleClose = () => {
      stateData.updateFormLoading = false
      stateData.updateFormVisible = false
      stateData.isUpdate = false
      stateData.isDisabled = false
    }
    // 菜单权限树选择
    const handleMenuTree = async (selectedKeys, e) => {
      stateData.updateForm.menuIdList = selectedKeys
    }
    // 弹窗表单提交
    const handleSubmit = debounce(async () => {
      stateData.updateFormLoading = true
      if (!stateData.isUpdate) {
        let { code } = await organization_add(stateData.updateForm)
        if (code === 200) {
          updateFormVisibleClose()
          message.success('添加成功')
          handleSearch()
        } else {
          updateFormVisibleClose()
          message.success('添加失败')
        }
      } else {
        let { code } = await organization_edit(stateData.updateForm)
        if (code === 200) {
          message.success('编辑成功')
          handleSearch()
        } else {
          message.success('编辑失败')
        }
        updateFormVisibleClose()
      }
    }, 1000)

    // 切换状态
    const handelSwitchChange = (row) => {
      Modal.confirm({
        title: `${row.useable === '1' ? '是否启用该角色' : '是否禁用该角色'}`,
        icon: createVNode(ExclamationCircleOutlined),
        content: '状态更改后，当前角色下所有用户操作将被更改，请谨慎操作!',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          let { code } = await organization_stateChange({
            id: row.id,
            useable: row.useable === '1' ? '0' : '1'
          })
          if (code === 200) {
            row.useable = row.useable === '1' ? '0' : '1'
            row.state = row.useable == '0' ? true : false
          } else {
            row.state = row.useable == '0' ? true : false
            message.error('操作失败')
          }
        },
        onCancel() {
          row.state = row.useable == '0' ? true : false
          console.log('Cancel')
        }
      })
    }
    // 删除
    const handleDelete = async (row) => {
      Modal.confirm({
        title: `是否删除该数据`,
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除数据，请谨慎操作!',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          let { code } = await organization_delete({
            id: row.id
          })
          if (code === 200) {
            handleSearch()
            message.success('删除成功')
          } else {
            message.error('操作失败')
          }
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    }
    return {
      ...toRefs(stateData),
      handleSearch,
      handleNodeClick,
      handleTableChange,
      handleEdit,
      updateFormVisibleClose,
      handleMenuTree,
      handleSubmit,
      handelSwitchChange,
      handleDelete
    }
  }
}
</script>
<style lang="scss" scoped></style>
