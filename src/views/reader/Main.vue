<template>
  <el-main style="padding: 0">
    <tool-box style="height: 5%;background-color: black"></tool-box>
    <el-scrollbar style="height: 95%">
      <PDF :key="src" :src="src" style="width: 60vw;margin: 5px auto 0" @mouseup="onSelect"></PDF>
    </el-scrollbar>
  </el-main>
</template>

<script>
import PDF from "@/components/PDF/PDF";
import {ElMessage} from "element-plus";
import {inject, ref, readonly} from "vue";
import ToolBox from "@/views/reader/ToolBox";

export default {
  components: {
    ToolBox,
    PDF
  },
  setup() {
    const axios = inject('axios')
    const bus = inject('bus')
    const src = ref('')
    const onSelect = (e) => {
      console.log(e)
      if (!bus.isWatching || e.path[0].localName !== "span" || e.path[1].className !== "textLayer") {
        return
      }
      const selectedText = window.getSelection().toString();
      if (selectedText.length === 0) {
        return;
      }
      for (let i = 0; i < 4; i++) {
        const id = e.path[i].id;
        if (id.indexOf("page-") >= 0) {
          bus.selectedText = readonly(ref(selectedText));
        }
      }
    }
    const getPDFPath = () => {
      axios.withCredentials = true;
      if (bus.main_pdf !== undefined) {
        return new Promise((resolve, reject) => {
          axios.get('/file/get_file_path', {
            params: {
              bid: bus.main_pdf
            }
          }).then((res) => {
            let res_body = res.data;
            if (res_body.status === 'success') {
              src.value = 'http://' + res_body.file_obj.file_path;
              resolve(true);
            } else {
              console.log(res_body);
              resolve(false);
              ElMessage.error('获取书籍路径错误！');
            }
          }).catch((error) => {
            console.log(error);
            reject(error);
          })
        })
      }
    };
    const getReaderPDF = async () => {
      let status = await getPDFPath();
      console.log(status);
    }
    getReaderPDF().catch((err) => {
      src.value = '/a.pdf'
      console.log(err)
    })
    return {
      src,
      onSelect
    }
  }
}
</script>

<style scoped>
</style>