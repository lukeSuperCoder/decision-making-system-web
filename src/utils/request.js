import { Service } from "../plugins/axios";

/**
 * 登录接口(示例)
 * @param params
 */
export function systemLogin(params) {
  return Service({
    url: "/upms/sysUser/login",
    method: "post",
    data: params,
  });
}
/**
 * 获取系统用户信息
 * @param params
 */
export function getUserInfo(params) {
  return Service({
    url: "/upms/sysUser",
    method: "get",
    params: params,
  });
}

/**
 * 新增用户
 * @param params
 */
export function addUserInfo(params) {
  return Service({
    url: "/upms/sysUser/register",
    method: "post",
    data: params,
  });
}
/**
 * 修改用户信息
 * @param params
 */
export function updateUserInfo(params) {
  return Service({
    url: "/upms/sysUser/" + params.userId,
    method: "put",
    data: params,
  });
}
/**
 * 删除用户信息
 * @param params
 */
export function deleteUserInfo(params) {
  return Service({
    url: "/upms/sysUser/" + params.userId,
    method: "delete",
  });
}
/**
 * 新增角色
 * @param params
 */
export function addRoleInfo(params) {
  return Service({
    url: "/upms/sysRole",
    method: "post",
    data: params,
  });
}
/**
 * 更新角色
 * @param params
 */
export function updateRoleInfo(params) {
  return Service({
    url: "/upms/sysRole",
    method: "put",
    data: params,
  });
}
/**
 * 删除角色
 * @param params
 */
export function deleteRoleInfo(params) {
  return Service({
    url: "/upms/sysRole/" + params.roleId,
    method: "delete",
  });
}
/**
 * 获取部门信息
 * @param params
 */
export function getDepartmentInfo() {
  return Service({
    url: "/upms/org",
    method: "get",
  });
}
/**
 * 获取用户角色信息
 * @param params
 */
export function getRoleInfo(params) {
  return Service({
    url: "/upms/sysRole/pageSelect",
    method: "get",
    params: params,
  });
}

/**
 * 获取菜单树信息
 * @param params
 */
export function getMenuTree(params) {
  return Service({
    url: "/upms/menu/tree",
    method: "get",
    params: params,
  });
}
/**
 * 新增菜单
 * @param params
 */
export function addMenu(params) {
  return Service({
    url: "/upms/menu",
    method: "post",
    data: params,
  });
}
/**
 * 更新菜单
 * @param params
 */
export function updateMenu(params) {
  return Service({
    url: "/upms/menu",
    method: "put",
    data: params,
  });
}
/**
 * 删除菜单
 * @param params
 */
export function deleteMenu(params) {
  return Service({
    url: "/upms/menu/"+params['menuId'],
    method: "delete",
  });
}
/**
 * 根据用户id查询拥有菜单
 * @param params
 */
export function userHasmenu(params) {
  return Service({
    url: "/upms/menu/has/" + params["userId"],
    method: "get",
  });
}
/**
 * 根据角色id查询拥有菜单
 * @param params
 */
export function roleHasMenu(params) {
  return Service({
    url: "/upms/sysRole/roleHasMenu/" + params["roleId"],
    method: "get",
  });
}
/**
 * 增加或删除角色菜单关联
 * @param params
 */
export function updateAndDelMenu(params) {
  return Service({
    url: "/upms/menu/updateAndDel",
    method: "put",
    data: params,
  });
}

/**
 * 获取槽号菜单
 * @param params
 */
 export function getNoMenu() {
  return Service({
    url: "/api/getNoMenu",
    method: "get"
  });
}

/**
 * 获取参数菜单
 * @param params
 */
 export function getParamsMenu() {
  return Service({
    url: "/api/getParamsMenu",
    method: "get"
  });
}

/**
 * 获取图表数据
 * @param params
 */
 export function getBaseChartByParam(params) {
  return Service({
    url: "/api/getBaseChart",
    method: "post",
    data: params
  });
}

/**
 * 获取knn图表数据
 * @param params
 */
 export function getKnnChart(params) {
  return Service({
    url: "/api/getKnnChart",
    method: "post",
    data: params
  });
}


/**
 * 获取Abnormal图表数据
 * @param params
 */
 export function getAbnChart(params) {
  return Service({
    url: "/api/getAbnChart",
    method: "post",
    data: params
  });
}
