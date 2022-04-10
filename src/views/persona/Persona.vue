<template>
  <div>
    <el-row align="middle" justify="center" style="height: 100%">
      <el-col class="box">
        <el-row style="padding: 0 0 5%">
          <el-col :push="8">
            <h3>请选择您感兴趣的领域</h3>
          </el-col>
          <el-col :push="8">
            <el-select
                v-model="value"
                :loading="loading"
                :remote-method="remoteMethod"
                filterable
                multiple
                placeholder="Please enter a keyword"
                remote
                :reserve-keyword="false"
            >
              <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
              />
            </el-select>
          </el-col>
          <el-col :push="20">
            <el-button>确认</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {ref} from 'vue'

export default {
  setup() {
    const options = ref([])
    const value = ref([])
    const loading = ref(false)
    const remoteMethod = (query) => {
      if (query) {
        loading.value = true
        setTimeout(() => {
          loading.value = false
          options.value = fields.value.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase())
          })
        }, 200)
      } else {
        options.value = []
      }
    }
    const fields = ref([{
      name: '基础数学',
      id: 1,
    }, {
      name: '数据科学',
      id: 2,
    }, {
      name: '统计学',
      id: 3,
    }, {
      name: '离散数学',
      id: 4,
    }, {
      name: '概率论',
      id: 5,
    }, {
      name: '神经网络',
      id: 6,
    }, {
      name: '深度学习',
      id: 7,
    }, {
      name: '人工智能',
      id: 8,
    }, {
      name: '信息检索',
      id: 9,
    }])
    return {
      options,
      loading,
      value,
      remoteMethod,
    }
  }
}
</script>

<style scoped>
.box {
  max-width: 60%;
  border-left: 1.5px solid #000000; /*增加边框*/
  border-right: 1.5px solid #000000;
  border-radius: 30px 30px 30px 30px;
}
</style>