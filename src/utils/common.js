import { sessionGet } from "./auth";

/**
 * 文件流下载
 * @param {文件下载地址} url
 * @param {导出的文件名} fileName
 */
export function exportFiles(url, fileName) {
  let xhr = new XMLHttpRequest();
  //请求地址
  xhr.open("get", url, true);
  xhr.responseType = "blob"; // 返回类型blob
  xhr.setRequestHeader("Authorization", sessionGet("token")); // 携带token校验
  xhr.onload = function () {
    if (this.status === 200) {
      let headerfileName = this.getResponseHeader("Content-Disposition");
      if (headerfileName && !fileName) {
        fileName = decodeURI(
          headerfileName.replace("attachment;filename=", "")
        );
      }
      let blob = this.response;
      let reader = new FileReader();
      reader.readAsDataURL(blob); // 转换为base64
      reader.onload = function (e) {
        let a = document.createElement("a"); // 创建一个a标签用于下载
        a.download = fileName.replace("t-", ""); //文件名
        a.href = e.target.result;
        document.body.append(a);
        a.click();
        a.remove();
      };
    }
  };
  xhr.send(); // 发送ajax请求
}

/**
 * 复制内容到粘贴板
 * content : 需要复制的内容
 * message : 复制完后的提示，不传则默认提示"复制成功"
 */
export function copyToClip(content, message) {
  let aux = document.createElement("input");
  aux.setAttribute("value", content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  if (message == null) {
    alert("复制成功");
  } else {
    alert(message);
  }
}

function getBlob(url, cb) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.setRequestHeader("Authorization", sessionGet("token")); // 携带token校验
  xhr.onload = function () {
    if (xhr.status === 200) {
      cb(xhr.response);
    }
  };
  xhr.send();
}

function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    let link = document.createElement("a");
    let body = document.querySelector("body");

    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    // fix Firefox
    link.style.display = "none";
    body.appendChild(link);

    link.click();
    body.removeChild(link);

    window.URL.revokeObjectURL(link.href);
  }
}
export function download(url, filename) {
  getBlob(url, function (blob) {
    saveAs(blob, filename);
  });
}

/**
 * 组装树形结构数据
 * @param data
 * @param id
 */
export function dealTreeData(data, id, parentId,children) {
  const idMapping = data.reduce((acc, el, i) => {
    acc[el[id]] = i;
    return acc;
  }, {});
  let root,
    roots = [];
  data.forEach((el) => {
    // 判断根节点
    if (el[parentId] === "0") {
      //   if (root) {
      //     roots.push(root);
      //   }
      //   root = el;
      roots.push(el);
      return;
    }
    // 用映射表找到父元素
    const parentEl = data[idMapping[el[parentId]]];
    // 把当前元素添加到父元素的`children`数组中
    parentEl.children = [...(parentEl[children] || []), el];
  });
  return roots;
}
/**
 *
 * @param {Array} arrs 树形数据
 * @param {string} childs 树形数据子数据的属性名,常用'children'
 * @param {Array} attrArr 需要提取的公共属性数组(默认是除了childs的全部属性)
 * @returns
 */
export function extractTree(arrs, childs, attrArr) {
  let attrList = [];
  if (!Array.isArray(arrs) && !arrs.length) return [];
  if (typeof childs !== "string") return [];
  if (!Array.isArray(attrArr) || (Array.isArray(attrArr) && !attrArr.length)) {
    attrList = Object.keys(arrs[0]);
    attrList.splice(attrList.indexOf(childs), 1);
  } else {
    attrList = attrArr;
  }
  let list = [];
  const getObj = (arr) => {
    arr.forEach(function (row) {
      let obj = {};
      attrList.forEach((item) => {
        obj[item] = row[item];
      });
      list.push(obj);
      if (row[childs]) {
        getObj(row[childs]);
      }
    });
    return list;
  };
  return getObj(arrs);
}
/**
 * 通过数组建造树形结构
 * @param array        {Array}  树形结构平面数组
 * @return {[{}]} 树形结构
 */
export function buildTree(data) {
  let result = [];
  let map = {};
  if (!Array.isArray(data)) {
    //验证data是不是数组类型
    return [];
  }
  data.forEach((item) => {
    //建立每个数组元素id和该对象的关系
    map[item.entity.id] = item; //这里可以理解为浅拷贝，共享引用
  });
  data.forEach((item) => {
    let parent = map[item.entity.parentId]; //找到data中每一项item的爸爸
    if (parent) {
      //说明元素有爸爸，把元素放在爸爸的children下面
      (parent.childs || (parent.childs = [])).push(item);
    } else {
      //说明元素没有爸爸，是根节点，把节点push到最终结果中
      result.push(item); //item是对象的引用
    }
  });
  return result; //数组里的对象和data是共享的
}
/**
 * 检查是否有权限
 * @param {*} key 权限编码
 * @returns 
 */
export function checkPermission(key) {
  if (sessionGet("permission")) {
    let arr = JSON.parse(sessionGet("permission"))["permissions"];
    let index = arr.indexOf(key);
    if (index > -1) {
      return true; // 有权限
    } else {
      return false; // 无权限
    }
  }
}
