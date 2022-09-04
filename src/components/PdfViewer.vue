<template>
  <div class="pdfCls">
    <pdf
      ref="pdf"
      :src="url"
      :page="pageNum"
      @progress="loadedRatio = $event"
      @page-loaded="pageLoaded($event)"
      @num-pages="pageTotalNum = $event"
      @error="pdfError($event)"
      @link-clicked="page = $event"
    ></pdf>
    <el-button-group class="tools">
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-arrow-left"
        @click="prePage"
        >{{ $t("lang.pdfViewer.prePage") }}</el-button
      >
      <div class="page">{{ pageNum }}/{{ pageTotalNum }}</div>
      <el-button size="mini" type="primary" @click="nextPage"
        >{{ $t("lang.pdfViewer.nextPage")
        }}<i class="el-icon-arrow-right el-icon--right"></i
      ></el-button>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-printer"
        :title="$t('lang.pdfViewer.print')"
        @click="print"
      ></el-button>
      <el-button
        type="primary"
        size="mini"
        :title="$t('lang.pdfViewer.download')"
        icon="el-icon-download"
        @click="downloadPdf(url, 'pdf文件')"
      ></el-button>
    </el-button-group>
  </div>
</template>

<script>
import pdf from "vue-pdf";
import { exportFiles } from "../utils/common";
export default {
  name: "padfviewer",
  components: { pdf },
  data() {
    return {
      url: "",
      pageNum: 1,
      pageTotalNum: 1,
      // 加载进度
      loadedRatio: 0,
      curPageNum: 0,
    };
  },
  mounted() {
    this.getNumPages(
      "http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf"
    );
  },
  methods: {
    getNumPages(url) {
      this.url = pdf.createLoadingTask(url);
      this.url.promise.then((pdf) => {
        this.pageTotalNum = pdf.pageTotalNum;
        document.getElementsByClassName(
          "pdfCls"
        )[0].children[0].children[0].style.width = "70%";
      });
    },
    // 上一页函数，
    prePage() {
      let page = this.pageNum;
      page = page > 1 ? page - 1 : this.pageTotalNum;
      this.pageNum = page;
    },
    // 下一页函数
    nextPage() {
      let page = this.pageNum;
      page = page < this.pageTotalNum ? page + 1 : 1;
      this.pageNum = page;
    },
    // 页面加载回调函数，其中e为当前页数
    pageLoaded(e) {
      this.curPageNum = e;
    },
    // 其他的一些回调函数。
    pdfError(error) {
      console.error(error);
    },
    //打印方法
    print() {
      this.$refs.pdf.print();
    },
    //保存PDF文件
    downloadPdf(data, fileName) {
      exportFiles(data, fileName);
    },
  },
};
</script>

<style lang="scss">
.pdfCls {
  width: 100%;
  height: 100%;
}
.tools {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 10px;
  left: 43%;
  gap: 10px;
}
</style>
