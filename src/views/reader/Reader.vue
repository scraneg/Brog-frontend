<template>
  <el-container style="background-color: #cccccc">
    <el-main class="main">
      <reader-main/>
    </el-main>
    <el-aside class="aside" v-if="show" @click="show=false">
      <reader-aside/>
    </el-aside>
  </el-container>
</template>

<script>
import Main from "./Main";
import Aside from "./Aside"
import {provide, onMounted, reactive, watch, toRef, inject, ref} from "vue";
import {useRoute} from "vue-router";
import {ElMessage} from 'element-plus';

export default {
  name: "reader",
  components: {
    'reader-main': Main,
    'reader-aside': Aside,
  },
  setup() {
    const route = useRoute();
    const axios = inject("axios");
    axios.withCredentials = true;

    const bus = reactive({
      main_pdf: route.query.id
    });
    provide("bus", bus);

    onMounted(() => {
      document.title = "阅读器";
    });

    watch(toRef(bus, 'selectedText'), () => {
      getReference(bus.main_pdf, bus.selectedText);
    });

    async function getReference(book_id, selected_keyword){
      let ref_bid_list = await requestReference(book_id, selected_keyword);
      bus.ref_pdf = ref_bid_list[0];
    }

    function requestReference(book_id, selected_keyword){
      return new Promise((resolve, reject) => {
        axios.get('/user/get_reference', {
          params: {
            bid: book_id,
            keyword: selected_keyword
          }
        }).then((res) => {
          let res_body = res.data;
          if (res_body.status === 'success') {
            resolve(res_body.reflist);
          } else {
            console.log(res_body);
            resolve(false);
            ElMessage.error('查询错误！');
          }
        }).catch((error) => {
          console.log(error);
          reject(error);
        });
      });
    }

    return {
      show: ref(true)
    }
  }
}
</script>

<style scoped>
.main {
  padding: 0;
}

.aside {
  width: 38%;
}
</style>