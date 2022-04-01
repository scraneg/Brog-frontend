<template>
  <el-container>
    <el-header style="background-color: #ccd1ee;">
      <brog-header></brog-header>
    </el-header>
    <el-container>
      <el-aside style="padding-bottom: 20px;padding-top: 20px">
        <brog-aside></brog-aside>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import header from "@/views/index/header";
import aside from "@/views/index/aside";

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