<template>
  <el-aside style="width: 38%" v-if="show">
    <el-menu mode="horizontal">
      <el-menu-item index="1" @click="show=false">X</el-menu-item>
    </el-menu>
    <el-scrollbar style="height: 90%">
      <PDF src="a.pdf"></PDF>
    </el-scrollbar>
  </el-aside>
</template>

<script>
import PDF from "@/components/PDF/PDF";
import {ref} from "vue";

export default {
  components: {
    PDF
  },
  name: "Aside",
  setup() {
    return {
      show: ref(true),
    }
  }
}
</script>

<style scoped>

</style>