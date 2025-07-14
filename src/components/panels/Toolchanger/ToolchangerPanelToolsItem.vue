<template>
    <div :class="['flex-grow-1 toolchanger-tool', { active: isActive, changing: isChanging && isActive }]">
        <div class="tool-name">{{ name.toUpperCase() }}</div>
        <div class="nozzle-info">
            <v-icon small>{{ mdiPrinter3dNozzle }}</v-icon>
            <span>{{ nozzleDiameter }} mm</span>
        </div>
        <div class="filament-info">
            <spool-icon style="margin: 10%;" :color="selectedColor" @click-spool="showColorPicker = true"></spool-icon>
            <v-menu v-model="showColorPicker" :close-on-content-click="false" offset-y>
                <template #activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on"></div>
                </template>
                <v-color-picker v-model="selectedColor" @input="(value) => doSend(`SET_TOOL_COLOR TOOL=${toolNumber} COLOR='${value}'`)" ></v-color-picker>
            </v-menu>
            <v-select style="margin-left: 10%; margin-right: 10%;"  :items="filamentTypes" v-model="selectedType" @change="(value) => doSend(`SET_TOOL_MATERIAL TOOL=${toolNumber} MATERIAL=${value}`)"  label="Filament Type"></v-select>
            <v-text-field style="margin-left: 10%; margin-right: 10%;" v-model="pressureAdvance" @input="(value) => doSend(`SET_PRESSURE_ADVANCE TOOL=${toolNumber} VALUE=${value}`)" label="Pressure Advance" type="number" step="0.01"></v-text-field>
        </div>
        
        <div class="tool-buttons">
            <v-btn small @click="doSend(`LOAD_ONE_FILAMENT TOOL=${toolNumber} MATERIAL=${selectedType}`)">
                <v-icon left small>{{mdiRedoVariant}}</v-icon>
                {{ $t('LOAD', { isDefault: '' }) }}
            </v-btn>
            <v-btn small @click="doSend(`UNLOAD_ONE_FILAMENT TOOL=${toolNumber} MATERIAL=${selectedType}`)">
                <v-icon left small>{{mdiUndoVariant}}</v-icon>
                {{ $t('UNLOAD', { isDefault: '' }) }}
            </v-btn>
            <v-btn small @click="doSend(`T${toolNumber}`)">
                <v-icon left small>{{mdiTargetVariant}}</v-icon>
                {{ $t('ACTIVATE', { isDefault: '' }) }}
            </v-btn>
        </div>
    </div>
</template>


<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import ToolchangerMixin from '@/components/mixins/toolchanger'
import ExtruderMixin from '@/components/mixins/extruder'
import { mdiUndoVariant, mdiRedoVariant, mdiTargetVariant, mdiPrinter3dNozzle } from '@mdi/js'

@Component
export default class ToolchangerPanel extends Mixins(BaseMixin, ExtruderMixin, ToolchangerMixin) {
    @Prop(String) name!: string
    mdiUndoVariant = mdiUndoVariant
    mdiRedoVariant = mdiRedoVariant
    mdiTargetVariant = mdiTargetVariant
    mdiPrinter3dNozzle = mdiPrinter3dNozzle
    showColorPicker = false
    
    get filamentTypes(): string[] {
        return this.toolchangerFilamentTypesOptions
    }

    get selectedColor(): string {
        return this.toolchangerFilamentColors[this.toolNumber]
    }

    get selectedType(): string {
        return this.toolchangerFilamentTypes[this.toolNumber]
    }
    get isActive(): boolean {
        return this.toolchangerTool === this.name
    }

    get isChanging(): boolean {
        return this.toolchangerStatus === 'changing'
    }

    get toolNumber(): number {
        return Number(`${this.name.replace(/\D/g, '')}`)
    }

    get tCommand(): string {
        return `T${this.toolNumber}`
    }

    get nozzleDiameter(): number {
        return this.extruders[this.toolNumber].nozzleDiameter
    }

    get pressureAdvance(): number {
        if (this.$store.state.printer?.[`gcode_macro ${this.tCommand}`]?.pressure_advance != null) {
            return this.$store.state.printer?.[`gcode_macro ${this.tCommand}`]?.pressure_advance
        }
        else {
            return this.$store.state.printer?.[this.extruders[this.toolNumber].key]?.pressure_advance ?? 0
        }
    }

}
</script>

<style scoped>
.toolchanger-tool {
    margin: 1%;
    border-radius: 10px;
    background-color: var(--v-background-base);
    transition: background-color 0.3s ease;
    text-align: center;
    padding: auto;
    position: relative;
}

.toolchanger-tool.active {
    border: 3px solid var(--v-primary-base);
}

.toolchanger-tool.changing::before {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    bottom: -2px;
    left: -2px;
    border: 2px solid #ff9800;
    border-radius: 10px;
    animation: flash-border 1s linear infinite;
}

@keyframes flash-border {
    0% { border-color: #ff9800; }
    50% { border-color: #ff0000; }
    100% { border-color: #ff9800; }
}

.tool-name {
    font-weight: bold;
}

.nozzle-info {
    display: flex;
    align-items: center;
    justify-content: center;
}

.filament-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.tool-buttons {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin: 10%;
}
</style>
