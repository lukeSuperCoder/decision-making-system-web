<template>
  <div
    class="ScaleBox"
    ref="ScaleBox"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "ScaleBox",
  props: {},
  data() {
    return {
      scale: "",
      width: 1920,
      height: 1080,
    };
  },
  mounted() {
    this.setScale();
    window.addEventListener("resize", this.debounce(this.setScale, 100));
  },
  methods: {
    getScale() {
      let { width, height } = this;
      let wh = window.innerHeight / height;
      let ww = window.innerWidth / width;
      console.log(ww < wh ? ww : wh);
      return {vw : ww , vh : wh};
    },
    setScale() {
      let scaleObj = this.getScale();
      if (this.$refs.ScaleBox) {
        this.$refs.ScaleBox.style.setProperty("--scale", scaleObj.vh);
        this.$refs.ScaleBox.style.setProperty(
          "--scale2",
          scaleObj.vw
        );
      }
    },
    debounce(fn, delay) {
      let delays = delay || 500;
      let timer;
      return function () {
        let th = this;
        let args = arguments;
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(function () {
          timer = null;
          fn.apply(th, args);
        }, delays);
      };
    },
  },
};
</script>

<style lang="scss">
#ScaleBox {
  --scale: 1;
}
.ScaleBox {
  position: absolute;
  transform: scale(var(--scale2), var(--scale)) translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  transform-origin: 0 0;
  left: 50%;
  top: 50%;
  transition: 0.3s;
  z-index: 999;
}
</style>
