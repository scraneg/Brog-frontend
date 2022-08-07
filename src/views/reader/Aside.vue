<template>
  <el-aside style="width: 38%" v-if="tabs.length > 0">
    <el-menu mode="horizontal" :default-active="tabs[0].id">
      <el-menu-item v-for="(tab, idx) in tabs" :key="tab.id" :index="tab.id" @click="activeId=tab.id">
        {{ tab.name }}
        <el-icon @click.stop="closeTab(idx)">
          <Close/>
        </el-icon>
      </el-menu-item>
    </el-menu>
    <div class="tab-wrapper">
      <template v-for="tab in tabs" :key="tab.id">
        <el-scrollbar :style="{visibility: activeId===tab.id?'visible':'hidden'}" class="tab">
          <PDF :src="tab.src"></PDF>
        </el-scrollbar>
      </template>
    </div>
  </el-aside>
</template>

<script>
import PDF from "@/components/PDF/PDF";
import {reactive, ref, watch} from "vue";
import {Close} from "@element-plus/icons-vue";

export default {
  components: {
    Close,
    PDF
  },
  name: "Aside",
  setup() {
    const tabs = reactive([
      {
        id: '1',
        name: '数据科学与工程数学基础',
        src: '/a.pdf'
      },
      {
        id: '2',
        name: '数据科学与工程数学基础',
        src: '/a.pdf'
      },
      {
        id: '3',
        name: '数据科学与工程数学基础',
        src: '/a.pdf'
      },
      {
        id: '4',
        name: '数据科学与工程数学基础',
        src: '/a.pdf'
      }
    ]);
    const activeId = ref(-1);
    watch(tabs, (nv, ov) => {
      if (ov.length === 0 && nv.length > 0)
        activeId.value = nv[0].id
    })
    const closeTab = (idx) => {
      tabs.splice(idx, 1)
    }
    return {
      tabs,
      activeId,
      closeTab,
    }
  }
}
</script>

<style scoped>
.tab-wrapper {
  height: 90%;
  position: relative;
}

.tab {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>