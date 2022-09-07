<template>
  <div class="header">
    <el-row align="middle" style="height: 100%" class="wrapper">
      <el-col :span="1"/>
      <el-col :span="1">
        <el-icon class="tool" @click="$router.go(-1)">
          <el-image src="/images/back.png"/>
        </el-icon>
      </el-col>
      <el-col :span="1">
        <el-icon class="tool" @click="enableSelect">
          <el-image src="/images/note.png"/>
        </el-icon>
      </el-col>
      <el-col :span="1">
        <el-icon class="tool" @click="showDialog">
          <el-image src="/images/save.png"/>
        </el-icon>
      </el-col>
      <el-col :span="6"/>
      <el-col :span="4">
        <el-input :prefix-icon="Search" v-model="searchContent" @keydown.enter="onSearch"></el-input>
      </el-col>
      <el-col :span="6"/>
      <el-col :span="1">
        <el-icon class="tool" @click="$router.go(-1)">
          <el-image src="/images/back.png"/>
        </el-icon>
      </el-col>
      <el-col :span="1">
        <el-icon class="tool" @click="enableSelect">
          <el-image src="/images/note.png"/>
        </el-icon>
      </el-col>
      <el-col :span="1">
        <el-icon class="tool" @click="showDialog">
          <el-image src="/images/save.png"/>
        </el-icon>
      </el-col>
    </el-row>
    <el-dialog
        v-model="dialogVisible"
        title="Tips"
    >
      <el-form>
        <el-form-item label="用户划词">
          <el-input v-model="formData.selectedText"/>
        </el-form-item>
        <el-form-item label="核心概念">
          <el-input v-model="formData.coreConcept"/>
        </el-form-item>
        <el-form-item label="依赖概念">
          <el-input v-model="formData.dependentConcept"/>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
        >确认</el-button
        >
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {Search} from "@element-plus/icons-vue"
import {inject, reactive, ref, toRef, watch} from "vue";
import {ElMessage} from 'element-plus';

export default {

  setup() {
    const bus = inject("bus")
    const axios = inject("axios")
    bus.isWatching = ref(false)
    const dialogVisible = ref(false)
    const enableSelect = function () {
      bus.isWatching = !bus.isWatching
    }
    const showDialog = function () {
      dialogVisible.value = true
    }
    const formData = reactive({
      selectedText: '',
      coreConcept: '',
      dependentConcept: ''
    })
    watch(toRef(bus, 'selectedText'), () => {
      formData.selectedText = bus.selectedText
    })
    const searchContent = ref('')

    function onSearch(){
      let keyword = searchContent.value;
      if(keyword == "支持向量机" || keyword == "SVM" || keyword == "Support-vector Machine"){
        bus.showCollapse = true;
        bus.readPath = ["超平面", "拉格朗日乘数法", "KKT条件", "SMO算法", keyword]
      }
      getReference(bus.main_pdf, keyword)
    }

    async function getReference(book_id, selected_keyword){
      let ref_materials = await requestReference(book_id, selected_keyword);
      bus.ref_materials = ref_materials;
    }

    function requestReference(book_id, selected_keyword){
      console.log(selected_keyword);
      return new Promise((resolve, reject) => {
        axios.get('/reader/get_reference', {
          params: {
            mid: book_id,
            keyword: selected_keyword
          }
        }).then((res) => {
          let res_body = res.data;
          if (res_body.status === 1) {
            resolve(res_body.references);
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
      Search,
      searchContent,
      bus,
      dialogVisible,
      formData,
      enableSelect,
      showDialog,
      onSearch
    }
  }
}
</script>

<style scoped>
.tool {
  cursor: pointer;
  background-color: #e3e2e2;
  border-radius: 4px;
}
</style>