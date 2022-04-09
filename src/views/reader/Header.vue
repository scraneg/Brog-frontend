<template>
  <div class="header">
    <el-row justify="space-around">
      <el-col :span="3">
        <el-button @click="$router.go(-1)">
          <el-icon>
            <Back></Back>
          </el-icon>
          返回
        </el-button>
      </el-col>
      <el-col :span="3">
        <el-button @click="enableSelect">{{ bus.isWatching ? "关闭划词" : "开启划词" }}</el-button>
      </el-col>
      <el-col :span="3">
        <el-button @click="showDialog">按钮</el-button>
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
import {Back} from '@element-plus/icons-vue'
import {inject, reactive, ref, toRef, watch} from "vue";

export default {
  name: "Header",
  components: {
    Back
  },
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
    return {
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
.header {
  height: 100%;
  width: 100%;
}
</style>