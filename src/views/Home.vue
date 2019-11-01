<template>
  <div class="home">
    <swiper :options="swiperOption" ref="mySwiper">
      <!-- slides -->
      <!-- <swiper-slide>
        <course></course>
      </swiper-slide> -->
      <swiper-slide>
        <business-map></business-map>
      </swiper-slide>
      <swiper-slide>
        <media-SMS></media-SMS>
      </swiper-slide>
      <swiper-slide>
        <industry-SMS></industry-SMS>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
// @ is an alias to /src
// import course from "@/components/course.vue"
import businessMap from "@/components/businessMap.vue"
import mediaSMS from "@/components/mediaSMS.vue"
import industrySMS from "@/components/industrySMS.vue"

export default {
  name: "home",
  components: {
    // course,
    businessMap,
    mediaSMS,
    industrySMS
  },
  data() {
    return {
      swiperOption: {
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        // ...
      }
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  mounted() {
    // current swiper instance
    // 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
    // console.log("this is current swiper instance object", this.swiper);
    // this.swiper.slideTo(3, 1000, false);
  }
};
</script>
<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  .swiper-container{
    height:100%;
  }
}
</style>
