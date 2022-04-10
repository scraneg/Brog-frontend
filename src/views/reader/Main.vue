<template>
  <el-container style="height: 100%">
    <el-main class="pdf-box">
      <el-scrollbar>
        <brogPDF :key="src" :src="src" type="main"></brogPDF>
      </el-scrollbar>
    </el-main>
    <el-main class="pdf-box">
      <el-scrollbar>
        <brogPDF :key="src" :src="src" type="ref"></brogPDF>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import BrogPDF from "@/views/reader/BrogPDF";
import {ElMessage} from "element-plus";
import {inject, ref} from "vue";

export default {
  props: ['type'],
  components: {
    BrogPDF
  },
  setup() {
    const axios = inject('axios')
    const bus = inject('bus')
    const src = ref('')
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
      src
    }
  }
}
</script>

<style scoped>
.pdf-box {
  height: 100%;
  color: #000;
  outline: none;
  margin: 0 2%;
  box-sizing: border-box;
  border: none;
  border-top: 1.5px solid #000000; /*增加边框*/
  border-bottom: 1.5px solid #000000;
  border-radius: 10px 10px 10px 10px; /*我们都知道border-radius后面如果是4个值的话,依次代表的是左上角、右上角、右下角、左下角。就这样使边框有弯曲*/
  background: #fff;
}
</style>