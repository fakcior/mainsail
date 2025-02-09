<template>
    <div class="mb-3">
        <v-row v-for="(row, index) in rows" :key="'row_' + index" class="mt-0">
            <v-col>
                <v-item-group class="_btn-group py-0 px-3">
                    <toolchanger-panel-tools-item v-for="name in row" :key="name" :name="name" class="toolchanger-panel-tools-item"/>
                </v-item-group>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import { mdiPrinter3dNozzle } from '@mdi/js'
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import ToolchangerMixin from '@/components/mixins/toolchanger'

@Component({})
export default class ToolchangerPanel extends Mixins(BaseMixin, ToolchangerMixin) {
    mdiPrinter3dNozzle = mdiPrinter3dNozzle

    get rows() {
        const len = this.toolchangerToolNames.length
        const cols = Math.ceil(len / Math.ceil(len / 5))
        let rows = []

        for (let i = 0; i < this.toolchangerToolNames.length; i += cols) {
            rows.push(this.toolchangerToolNames.slice(i, i + cols))
        }

        return rows
    }
}
</script>

<style scoped>
._btn-group {
    border-radius: 4px;
    display: inline-flex;
    flex-wrap: nowrap;
    max-width: 100%;
    min-width: 100%;
    margin: auto;

    .v-btn {
        border-radius: 40;
        border-color: rgba(255, 255, 255, 0.12);
        border-style: solid;
        border-width: thin;
        box-shadow: none;
        height: 28px;
        opacity: 0.8;
        min-width: auto !important;
    }


}

.toolchanger-panel-tools-item {
    margin-left: 5px;
    margin-right: 5px;
}

html.theme--light ._btn-group .v-btn {
    border-color: rgba(0, 0, 0, 0.12);
}
</style>
