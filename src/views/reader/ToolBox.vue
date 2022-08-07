<template>
  <div class="header">
    <el-row align="middle" style="height: 100%" class="wrapper">
      <el-col :span="1"/>
      <el-col :span="1">
        <el-icon class="tool" @click="$router.go(-1)">
          <el-image src="/back.png"/>
        </el-icon>
      </el-col>
      <el-col :span="1">
        <el-icon class="tool" @click="enableSelect">
          <el-image src="/note.png"/>
        </el-icon>
      </el-col>
      <el-col :span="1">
        <el-icon class="tool" @click="showDialog">
          <el-image src="/save.png"/>
        </el-icon>
      </el-col>
      <el-col :span="6"/>
      <el-col :span="4">
        <el-input :prefix-icon="Search" v-model="searchContent"></el-input>
      </el-col>
      <el-col :span="6"/>
      <el-col :span="1">
        <el-icon class="tool" @click="$router.go(-1)">
          <el-image src="/back.png"/>
        </el-icon>
      </el-col>
      <el-col :span="1">
        <el-icon class="tool" @click="enableSelect">
          <el-image src="/note.png"/>
        </el-icon>
      </el-col>
      <el-col :span="1">
        <el-icon class="tool" @click="showDialog">
          <el-image src="/save.png"/>
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

export default {

  setup() {
    const bus = inject("bus")
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
    return {
      Search,
      searchContent,
      bus,
      dialogVisible,
      formData,
      enableSelect,
      showDialog
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