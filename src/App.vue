<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>

<style>
html,
body,
#app,
.el-container {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0;
  /*外部间距也是如此设置*/
  margin: 0;
  /*统一设置高度为100%*/
  height: 100%;
  overflow-y: hidden;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  /*background-color: #FFFAFA;*/
  /* background-color: #0a4d73; */
  background-color: rgba(139, 133, 133, 0);
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  border-radius: 10px;
  /* background-color: #0a4d73; */
  /* background-color: #e9eef3; */
  background-color: rgba(139, 133, 133, 0);
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  background-color: #00aae9;
}
.viewBtnCls{
  color: #00aae9;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}
.editBtnCls{
  color: darkorange !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  cursor: pointer;
}
.deleteBtnCls{
  color: red !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  cursor: pointer;
}
.demo-form-inline{
    display: flex;
    padding: 40px 0 0 25px;
    gap: 20px;
}
::v-deep .el-form-item__label{
  font-size: 15px;
}
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
  margin-bottom: 0px !important;
}
</style>
