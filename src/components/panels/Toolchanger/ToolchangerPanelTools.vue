<template>
    <div class="mb-3">
        <v-row v-for="(row, index) in rows" :key="'row_' + index" class="mt-0">
            <v-col>
                <v-item-group class="_tool-group py-0 px-3">
                        <toolchanger-panel-tools-item v-for="name in row" :key="name" :name="name"/>
                </v-item-group>
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
        const cols = Math.ceil(len / Math.ceil(len / 6))
        let rows = []

        for (let i = 0; i < this.toolchangerToolNames.length; i += cols) {
            rows.push(this.toolchangerToolNames.slice(i, i + cols))
        }

        return rows
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
