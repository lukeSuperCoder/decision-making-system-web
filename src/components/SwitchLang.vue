<template>
  <div>
    <el-select v-model="value" placeholder="请选择" @change="selectLang">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "SwitchLang",
  components: {},
  data() {
    return {
      options: [
        {
          value: "zh-CN",
          label: "简体",
        },
        {
          value: "zh-TW",
          label: "繁体",
        },
        {
          value: "en-US",
          label: "英文",
        },
      ],
      value: "zh-CN",
    };
  },
  mounted() {},
  methods: {
    selectLang: function (val) {
      this.$i18n.locale = val;
      this.value = val;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-select {
  width: 100px;
}
::v-deep .el-select .el-input__inner {
  background: rgba(255, 255, 255, 0);
  color: rgb(255, 255, 255);
}
</style>
