import request from "@/api/request";
// 列表
export function organization_list (options = {}) {
  options = Object.assign(
    {
      parentIds: "",
      // 客户姓名
      name: "",
      // 每页条数
      pageSize: 10,
      // 当前页码
      pageNum: 1,
    },
    options
  );

  return request({
    url: process.env.VUE_APP_BASE_API + "/unioncast/office/list",
    method: "get",
    params: options,
  });
}

// 左边树数据

export function organization_treeselect (options = {}) {
  return request({
    url: process.env.VUE_APP_BASE_API + "/unioncast/office/treeselect",
    method: "get",
    params: options,
  });
}
// 修改组织状态
export function organization_stateChange (options = {}) {
  return request({
    url: process.env.VUE_APP_BASE_API + "/unioncast/office/edit",
    method: "post",
    data: options,
  });
}
// 新增组织
export function organization_add (options = {}) {
  return request({
    url: process.env.VUE_APP_BASE_API + "/unioncast/office/add",
    method: "post",
    data: options,
  });
}
// 删除组织

export function organization_delete (options = {}) {
  return request({
    url:
      process.env.VUE_APP_BASE_API + `/unioncast/office/delete/${options.id}`,
    method: "get",
  });
}
// 编辑组织

export function organization_edit (options = {}) {
  return request({
    url: process.env.VUE_APP_BASE_API + "/unioncast/office/edit",
    method: "post",
    data: options,
  });
}
// 查看组织
export function organization_detail (options = {}) {
  return request({
    url: process.env.VUE_APP_BASE_API + `/unioncast/office/id/${options}`,
  });
}
