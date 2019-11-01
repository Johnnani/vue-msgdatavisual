<template>
  <div>
    <!-- <canvas id="dog-walking" style="position:fixed;left:0;bottom:0" ref="dog-walking"></canvas> -->
    <button @click="handleClick">跳转</button>
  </div>
</template>
<script>
// import {getMediaOverview} from '@/api'
export default {
  data(){
    return {}
  },
  created(){
    // getMediaOverview().then(res => {
    // })
  },
  mounted(){

  },
  methods:{
    // init(){
    //   let canvas = this.$refs.dogWalking;
    //   canvas.width = window.innerWidth;
    //   canvas.height = 200;
    //   let img = new Image();
    //   img.onload = function(){
    //     beginDraw(img);
    //   };
    //   img.src = "../assets/imgs/dog0.jpg";
    // },
    handleClick(){
      this.$router.push({
        name:'home'
      })
    }
  }
}
</script>