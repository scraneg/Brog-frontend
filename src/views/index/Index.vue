<template>
  <el-container>
    <el-header style="background-color: #ccd1ee;height: 10%">
      <brog-header></brog-header>
    </el-header>
    <el-container style="height: 90%">
      <el-aside style="width:25%;padding-bottom: 20px;padding-top: 20px">
        <brog-aside></brog-aside>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import header from "@/views/index/Header";
import aside from "@/views/index/Aside";

export default {
  components: {
    BrogHeader: header,
    BrogAside: aside,
  },
  name: "index"
}
</script>

<style scoped>

</style>