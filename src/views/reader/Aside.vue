<template>
  <el-aside style="width: 38%" v-if="tabs.length > 0">
    <el-menu mode="horizontal" :default-active="String(activeId)">
      <el-menu-item v-for="tab in tabs" :key="tab.id" :index="String(tab.id)" @click="activeId=tab.id">
        {{ tab.name }}
        <el-icon @click.stop="closeTab(tab.id)">
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
import {inject, reactive, ref, watch, toRef} from "vue";
import {Close} from "@element-plus/icons-vue";
import {getRandomInt} from "element-plus/es/utils/util";

export default {
  components: {
    Close,
    PDF
  },
  name: "Aside",
  setup() {
    const bus = inject('bus')
    const baseURL = inject("baseURL")
    const tabs = reactive([]);

    const activeId = ref(-1);
    watch(() => tabs.length, (nv, ov) => {
      if (ov === 0 && nv > 0)
        activeId.value = tabs[0].id
    })
    watch(toRef(bus, 'ref_materials'), (ref_materials) => {
      for (const material of ref_materials) {
        const id = getRandomInt(1000000)
        tabs.push({
          id,
          src: baseURL + '/file/material/' + material.filepath,
          name: material.title,
        })
      }
    });
    const closeTab = (id) => {
      let idx;
      for (idx in tabs) {
        if (tabs[idx].id === id) {
          break;
        }
      }
      idx = Number(idx)
      if (tabs[idx].id === activeId.value) {
        if (idx === tabs.length - 1 && tabs.length > 1) {
          activeId.value = tabs[idx - 1].id
        } else if (tabs.length > 1) {
          activeId.value = tabs[idx + 1].id
        }
      }
      tabs.splice(idx, 1);
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