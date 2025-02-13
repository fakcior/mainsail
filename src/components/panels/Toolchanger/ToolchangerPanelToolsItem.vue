<template>
    <div :class="['flex-grow-1 toolchanger-tool', { active: isActive, changing: isChanging && isActive }]">
        <div class="tool-name">{{ name }}</div>
        <div class="filament-info">
            <spool-icon style="margin: 10%;" :color="selectedColor" @click-spool="showColorPicker = true"></spool-icon>
            <v-menu v-model="showColorPicker" :close-on-content-click="false" offset-y>
                <template #activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on"></div>
                </template>
                <v-color-picker v-model="selectedColor" @input="setToolColor"></v-color-picker>
            </v-menu>
            <v-select style="margin-left: 10%; margin-right: 10%;"  :items="filamentTypes" v-model="selectedType" @change="setToolMaterial" label="Filament Type"></v-select>
        </div>
        <div class="tool-buttons">
            <v-btn small @click="doSend(`LOAD_ONE_FILAMENT TOOL=${toolNumber}`)">
                <v-icon left small>{{mdiRedoVariant}}</v-icon>
                {{ $t('Load', { isDefault: '' }) }}
            </v-btn>
            <v-btn small @click="doSend(`UNLOAD_ONE_FILAMENT TOOL=${toolNumber}`)">
                <v-icon left small>{{mdiUndoVariant}}</v-icon>
                {{ $t('Unload', { isDefault: '' }) }}
            </v-btn>
            <v-btn small @click="doSend(`T${toolNumber}`)">
                <v-icon left small>{{mdiTargetVariant}}</v-icon>
                {{ $t('Select', { isDefault: '' }) }}
            </v-btn>
        </div>
    </div>
</template>


<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import ToolchangerMixin from '@/components/mixins/toolchanger'
import { mdiUndoVariant, mdiRedoVariant, mdiTargetVariant } from '@mdi/js'

@Component
export default class ToolchangerPanel extends Mixins(BaseMixin, ToolchangerMixin) {
    @Prop(String) name!: string
    mdiUndoVariant = mdiUndoVariant
    mdiRedoVariant = mdiRedoVariant
    mdiTargetVariant = mdiTargetVariant
    showColorPicker = false
    filamentTypes = ['PLA', 'ABS', 'TPU', 'PETG']
    
    get selectedColor(): string {
        return this.toolchangerFilamentColors[Number(this.toolNumber)]
    }

    get selectedType(): string {
        return this.toolchangerFilamentTypes[Number(this.toolNumber)]
    }
    get isActive(): boolean {
        return this.toolchangerTool === this.name
    }

    get isChanging(): boolean {
        return this.toolchangerStatus === 'changing'
    }

    get toolNumber(): string {
        return `${this.name.replace(/\D/g, '')}`
    }

    setToolColor(color: string) {
        this.doSetToolColor(Number(this.toolNumber), color);
    }

    setToolMaterial(material: string) {
        this.doSetToolMaterial(Number(this.toolNumber), material)
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
    margin-bottom: 10px;
}

.filament-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
}

.tool-buttons {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin: 10%;
}
</style>
