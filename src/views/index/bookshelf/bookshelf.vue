<template>
  <div></div>
</template>

<script>
import {onMounted} from "vue";

export default {
  name: "bookshelf",
  setup() {
    onMounted(() => {
      document.title = "我的书架"
    })
  }
}
</script>

<style scoped>

</style>