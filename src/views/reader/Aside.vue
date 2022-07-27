<template>
  <el-scrollbar style="height: 100%">
    <PDF src="a.pdf"></PDF>
  </el-scrollbar>
</template>

<script>
import PDF from "@/components/PDF/PDF";

export default {
  components: {
    PDF
  },
  name: "Aside"
}
</script>

<style scoped>

</style>