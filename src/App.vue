<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view />
  </div>
</template>
<script>
export default {
  created(){
    // this.$router.push({name:'test'})
  }
}
</script>
<style>
#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
  font-family:'思源黑体CN';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
  width: 100%;
  height: 100%;
  background: url("./assets/imgs/bg.jpg") center center no-repeat;
}
</style>
