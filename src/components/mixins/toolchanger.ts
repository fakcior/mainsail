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

    get toolchangerFilamentTypesOptions(): string[] {
        return this.$store.state.printer.save_variables?.variables?.filament_types_options ?? ['PLA', 'ABS', 'ASA', 'PETG', 'PA', 'PC', 'TPU']
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
}