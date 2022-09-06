<template>
  <div style="height: 100vh;width: 100vw">
    <router-view style="height: 95%"/>
    <div class="beian" style="height: 5%">
      <span>沪ICP备2022026383号</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
.beian {
  box-sizing: border-box;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0;
  width: calc(100% - 20px);
  color: #999;
  font-size: 0.875em;
}
</style>
