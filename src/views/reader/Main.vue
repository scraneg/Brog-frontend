<template>
  <el-main style="padding: 0">
    <tool-box style="height: 5%;background-color: #000000"></tool-box>
    <el-collapse v-if="collapseShow">
      <el-collapse-item title="阅读路径推荐">
        <el-card shadow="hover" v-for="(title, index) in readPath" :key="'rec_' + index">
          {{ title }}
        </el-card>
      </el-collapse-item>
    </el-collapse>
    <el-scrollbar style="height: 95%">
      <PDF :key="src" :src="src" style="width: 60vw;margin: 5px auto 0" @mouseup="onSelect"></PDF>
    </el-scrollbar>
  </el-main>
</template>

<script>
import PDF from "@/components/PDF/PDF";
import {ElMessage} from "element-plus";
import {inject, ref, readonly, toRef, watch, reactive} from "vue";
import ToolBox from "@/views/reader/ToolBox";

export default {
  components: {
    ToolBox,
    PDF
  },
  setup() {
    const axios = inject('axios')
    const bus = inject('bus')
    const baseURL = inject("baseURL")
    const src = ref('')
    const collapseShow = ref(false)
    const readPath = reactive(
      ["123", "456"]
    )

    const onSelect = (e) => {
      console.log(e)
      if (!bus.isWatching || e.path[0].localName !== "span" || e.path[1].className !== "textLayer") {
        return
      }
      const selectedText = window.getSelection().toString();
      if (selectedText.length === 0 || selectedText.length > 64) {
        return;
      }
      for (let i = 0; i < 4; i++) {
        const id = e.path[i].id;
        if (id.indexOf("page-") >= 0) {
          bus.selectedText = readonly(ref(selectedText));
        }
      }
    }
    watch(toRef(bus, 'showCollapse'), () => {
      collapseShow.value = bus.showCollapse;
      if(bus.readPath != undefined && bus.readPath != null){
        readPath.length = 0
        bus.readPath.forEach(pathItem => {
          readPath.push(pathItem)
        });
      }
    })
    const getPDFPath = () => {
      axios.withCredentials = true;
      if (bus.main_pdf !== undefined) {
        return new Promise((resolve, reject) => {
          axios.get('/reader/get_filename', {
            params: {
              mid: bus.main_pdf
            }
          }).then((res) => {
            let res_body = res.data;
            if (res_body.status === 1) {
              src.value = baseURL + '/file/material/' + res_body.message;
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
      onSelect,
      collapseShow,
      readPath
    }
  }
}
</script>

<style scoped>
</style>