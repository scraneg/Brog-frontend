<template>
  <el-container>
    <el-main>
      <reader-main/>
    </el-main>
    <el-main>
      <reader-main/>
    </el-main>
  </el-container>
</template>

<script>
import main from "./Main";
import {onMounted} from "vue";

export default {
  name: "reader",
  components: {
    'reader-main': main,
  },
  setup() {
    onMounted(() => {
      document.title = "填写标题"
    })
  }
}
</script>

<style scoped>

</style>