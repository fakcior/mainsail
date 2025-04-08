<template>
    <div v-if="hasVisibleFilaments">
        <v-divider class="mt-3 mb-0" />
        <v-card-title class="text-h5">Filament Assignment</v-card-title>
        <v-card-text class="pb-0">
            <p class="body-2">
                    Filament change count: {{ filament_change_count }}
                </p>
            <v-row>
                <v-col v-for="(filament, index) in filaments" :key="index" v-if="filament.used > 0" class="filament-box">
                    <div class="filament-type" :style="{ backgroundColor: filament.color, color: getTextColor(filament.color) }">{{ filament.type }} ({{ filament.used }} g)</div>
                    <v-menu offset-y>
                        <template #activator="{ on, attrs }">
                            <v-btn
                                v-bind="attrs"
                                v-on="on"
                                class="tool-button"
                                :style="{ backgroundColor: selectedTools[index]?.color, color: getTextColor(selectedTools[index]?.color) }">
                                {{ selectedTools[index]?.label || 'Select Tool' }}
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item
                                v-for="tool in toolOptions"
                                :key="tool.value"
                                @click="selectTool(tool, index)"
                                :style="{ backgroundColor: tool.color, color: getTextColor(tool.color) }">
                                {{ tool.label }}
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
        </v-card-text>
        <v-divider />
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import ToolchangerMixin from '@/components/mixins/toolchanger'
import { FileStateGcodefile } from '@/store/files/types'

@Component
export default class StartPrintDialogToolchanger extends Mixins(BaseMixin, ToolchangerMixin) {
    @Prop({ required: true }) readonly file!: FileStateGcodefile
    @Prop({ required: true }) readonly showDialog!: boolean
    @Prop({ required: true }) readonly bool!: boolean

    showChangeSpoolDialog = false
    selectedTools: Array<any> = []

    get filament_change_count()
    {
        return this.file.filament_change_count ?? 0
    }

    get filaments() {
        const colors = this.file.filament_colors ?? []
        const types = this.file.filament_type?.split(';') ?? []
        const used = this.file.filament_weights?.map(Number) ?? []

        return colors.map((color: string, index: string | number) => ({
            color,
            type: types[index] || 'Unknown',
            used: used[index] || 0
        }))
    }

    get toolOptions() {
        return this.toolchangerToolNames.map((name, index) => ({
            label: `${name.replace('tool','').trim()} (${this.toolchangerFilamentTypes[index]})`,
            value: Number(name.match(/\d+/)?.[0] || 0),
            color: this.toolchangerFilamentColors[index]
        }))
    }

    get hasVisibleFilaments() {
        return this.filaments.some(filament => filament.used > 0)
    }

    mounted() {
        this.doSend("RESET_TOOL_MAPPING")
        this.matchToolsToFilaments()
        this.selectedTools.forEach((tool, index) => {
            if (tool && this.filaments[index].used > 0) {
                this.doSend(`SET_TOOL_MAPPING T=${index} TOOL=${tool.value}`)
            }
        })
    }

    @Watch('bool')
    onBoolChange(val: boolean) {
        if (val) {
            this.doSend("RESET_TOOL_MAPPING")
            this.matchToolsToFilaments()
            this.selectedTools.forEach((tool, index) => {
                if (tool && this.filaments[index].used > 0) {
                    this.doSend(`SET_TOOL_MAPPING T=${index} TOOL=${tool.value}`)
                }
            })
        }
    }

    matchToolsToFilaments() {
        this.selectedTools = this.filaments.map(filament => this.findBestToolMatch(filament))
    }

    selectTool(tool: any, index: number) {
        this.doSend(`SET_TOOL_MAPPING T=${index} TOOL=${tool.value}`)
        this.selectedTools[index] = tool;
    }

    findBestToolMatch(filament: { color: string, type: string }) {
        let bestMatch = null
        let bestScore = Infinity

        this.toolOptions.forEach(tool => {
            if (!tool.label.includes(filament.type)) return

            const colorDistance = this.calculateColorDistance(filament.color, tool.color)
            const score = colorDistance

            if (score < bestScore) {
                bestScore = score
                bestMatch = tool
            }
        })

        return bestMatch
    }

    calculateColorDistance(color1: string, color2: string): number {
        const rgb1 = this.hexToRgb(color1)
        const rgb2 = this.hexToRgb(color2)

        if (!rgb1 || !rgb2) return Infinity

        return Math.sqrt(
            Math.pow(rgb1.r - rgb2.r, 2) +
            Math.pow(rgb1.g - rgb2.g, 2) +
            Math.pow(rgb1.b - rgb2.b, 2)
        )
    }

    hexToRgb(hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null
    }

    getTextColor(backgroundColor: string): string {
        const color = backgroundColor.charAt(0) === '#' ? backgroundColor.substring(1, 7) : backgroundColor
        const r = parseInt(color.substring(0, 2), 16)
        const g = parseInt(color.substring(2, 4), 16)
        const b = parseInt(color.substring(4, 6), 16)
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        return luminance > 0.5 ? 'black' : 'white'
    }
}
</script>

<style scoped>
.filament-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid var(--v-border-base);
    border-radius: 10px;
    padding: 10px;
    margin: 5px;
    background-color: var(--v-background-base);
    width: 100%;
}

.filament-type {
    font-weight: bold;
    margin-bottom: 5px;
    padding: 5px 10px;
    border-radius: 5px;
    color: white;
    width: 100%;
    text-align: center;
}

.tool-button {
    width: 100%;
    text-align: center;
    padding: 5px 10px;
    border-radius: 5px;
    color: white;
}

.column-header {
    font-weight: bold;
    text-align: center;
}

.filament-details {
    display: flex;
    flex-direction: column;
}

.headline {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: left;
}
</style>
