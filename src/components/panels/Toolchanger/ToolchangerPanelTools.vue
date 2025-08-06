<template>
    <div class="mb-3">
      <v-row
        v-for="(row, index) in rows" :key="'row_' + index" class="mt-0" dense no-gutters>
        <v-col v-for="name in row" :key="name" :style="'max-width:' + 100/Math.min(length,5) + '%'" class="pa-1">
          <toolchanger-panel-tools-item :name="name" />
        </v-col>
      </v-row>
    </div>
</template>
  
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import ToolchangerMixin from '@/components/mixins/toolchanger'

@Component({})
export default class ToolchangerPanel extends Mixins(BaseMixin, ToolchangerMixin) {
    get rows() {
        const len = this.toolchangerToolNames.length
        const cols = Math.ceil(len / Math.ceil(len / 5))
        let rows = []

        for (let i = 0; i < len; i += cols) {
            rows.push(this.toolchangerToolNames.slice(i, i + cols))
        }

        return rows
    }

    get length() {
      return this.toolchangerToolNames.length
    }

}
</script>

<style scoped>
._tool-group {
    border-radius: 4px;
    display: inline-flex;
    flex-wrap: nowrap;
    max-width: 100%;
    min-width: 100%;
    margin: auto;
}
</style>
