<template>
  <div class="bgborder-wrapper">
    <div class="bgborder-lt"></div>
    <div class="bgborder-rt"></div>
    <div class="bgborder-lb"></div>
    <div class="bgborder-rb"></div>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="less" scoped>
.bgborder-wrapper{
  width:100%;
  height:100%;
  position: relative;;
  border:2px solid #1B588F;
  border-radius:12px;
  // background-color:rgba(193,190,188,0.8);
  .bgborder-lt{
    position: absolute;
    top:-3px;
    left:-3px;
    width:36px;
    height:36px;
    background: url("../assets/imgs/lt.png") 0 0 no-repeat;
  }
  .bgborder-rt{
    position: absolute;
    top:-3px;
    right:-3px;
    width:36px;
    height:36px;
    background: url("../assets/imgs/rt.png") 0 0 no-repeat;
  }
  .bgborder-lb{
    position: absolute;
    bottom:-3px;
    left:-3px;
    width:36px;
    height:36px;
    background: url("../assets/imgs/lb.png") 0 0 no-repeat;
  }
  .bgborder-rb{
    position: absolute;
    bottom:-3px;
    right:-3px;
    width:40px;
    height:36px;
    background: url("../assets/imgs/rb.png") 0 0 no-repeat;
  }
}

</style>
