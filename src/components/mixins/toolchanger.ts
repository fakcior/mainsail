import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class ToolchangerMixin extends Vue {

    get enabled(): boolean {
        return true
    }
    get toolchangerStatus(): string {
        return this.$store.state.printer.toolchanger?.status
    }

    get toolchangerTool(): string {
        return this.$store.state.printer.toolchanger?.tool
    }

    get toolchangerToolNumber(): number {
        return this.$store.state.printer.toolchanger?.tool_number
    }

    get toolchangerToolNumbers(): number[] {
        return this.$store.state.printer.toolchanger?.tool_numbers
    }

    get toolchangerToolNames(): string[] {
        return this.$store.state.printer.toolchanger?.tool_names
    }

    get toolchangerFilamentTypes(): string[] {
        return this.$store.state.printer.save_variables?.variables?.filament_types
    }

    get toolchangerFilamentColors(): string[] {
        return this.$store.state.printer.save_variables?.variables?.filament_colors
    }

    get toolMapping(): number[] {
        return this.$store.state.printer.save_variables?.variables?.tool_map
    }

    doSend(gcode: string) {
        this.$store.dispatch('server/addEvent', { message: gcode, type: 'command' })
        this.$socket.emit('printer.gcode.script', { script: gcode })
    }

    doSetToolColor(tool: number, color: string) {
        let colors = this.toolchangerFilamentColors
        if (!colors || colors.length != this.toolchangerToolNames.length) {
            colors = new Array(this.toolchangerToolNames.length).fill('#FFFFFF')
        }
        colors[tool] = color
        const gcode2 = `SAVE_VARIABLE VARIABLE=filament_colors VALUE='${JSON.stringify(colors)}'`
        this.doSend(gcode2)
    }

    doSetToolMaterial(tool: number, material: string) {
        let materials = this.toolchangerFilamentTypes
        if (!materials || materials.length != this.toolchangerToolNames.length) {
            materials = new Array(this.toolchangerToolNames.length).fill('PLA')
        }
        materials[tool] = material
        const gcode2 = `SAVE_VARIABLE VARIABLE=filament_types VALUE='${JSON.stringify(materials)}'`
        this.doSend(gcode2)
    }
}
