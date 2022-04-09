<template>
  <el-container>
    <el-header style="background-color: #ccd1ee;">
      <reader-header/>
    </el-header>
    <el-container>
      <el-main>
        <reader-main/>
      </el-main>
      <el-main>
        <reader-main/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Main from "./Main";
import Header from "./Header"
import {provide, onMounted, reactive} from "vue";

export default {
  name: "reader",
  components: {
    'reader-main': Main,
    'reader-header': Header,
  },
  setup() {
    const bus = reactive({})
    provide("bus", bus)
    onMounted(() => {
      document.title = "阅读器"
    })
  }
}
</script>

<style scoped>

</style>