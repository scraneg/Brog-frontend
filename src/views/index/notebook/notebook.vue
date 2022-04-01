<template>
  <div class="notebook">
    <el-collapse>
      <el-collapse-item v-for="(note,index) in notes" :key="note.id" :name="index" :title="note.title">
        <el-card shadow="hover">
          <div>
            主题概念:
            <template v-for="(theme,index) in note.themes">
              {{ index + 1 === note.themes.length ? theme : theme + '、' }}
            </template>
          </div>
          <div>
            来自图书:
            <template v-for="(book,index) in note.books" :key="book.title">
              <router-link :to="'/reader?id='+book.id">{{ book.title }}</router-link>
              {{ index + 1 === note.books.length ? null : '、' }}
            </template>
          </div>
          <div>
            贡献者: {{ note.contributor }}
          </div>
        </el-card>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";

export default {
  name: "notebook",
  setup() {
    onMounted(() => {
      document.title = "我的笔记"
    })
    return {
      notes: ref([{
        id: 1,
        title: '机器学习算法笔记1',
        themes: ['支持向量机', '拉格朗日乘子法', 'SMO算法'],
        books: [{
          id: 1,
          title: '机器学习'
        }, {
          id: 2,
          title: '统计学习方法（第2版）'
        }],
        contributor: 'Broger'
      }, {
        id: 1,
        title: '机器学习算法笔记1',
        themes: ['支持向量机', '拉格朗日乘子法', 'SMO算法'],
        books: [{
          id: 1,
          title: '机器学习'
        }, {
          id: 2,
          title: '统计学习方法（第2版）'
        }],
        contributor: 'Broger'
      }])
    }
  }
}
</script>

<style scoped>
.notebook {
  height: 100%;
  width: 100%;
}
</style>