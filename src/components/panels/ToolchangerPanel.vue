<template>
<div>
    <panel :icon="mdiSwapVerticalBold" :title="$t('Panels.ToolchangerPanel.Headline')" :collapsible="true" card-class="toolchanger-panel">
        <template #buttons>
            <v-menu left offset-y :close-on-content-click="false">
                <template #activator="{ on, attrs }">
                    <v-btn icon tile v-bind="attrs" v-on="on">
                        <v-icon>{{ mdiDotsVertical }}</v-icon>
                    </v-btn>
                </template>
                <v-list dense>
                    <v-list-item v-if="true">
                        <v-btn small style="width: 100%" @click="sendCmd('INITIALIZE_TOOLCHANGER')">
                            <v-icon left small>{{ mdiSwapVerticalBold }}</v-icon>
                            {{ $t('Panels.ToolchangerPanel.Initialize', { isDefault: '' }) }}
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>
        <toolchanger-panel-tools/>
    </panel>
</div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import ToolchangerMixin from '@/components/mixins/toolchanger'
import { mdiDotsVertical, mdiSwapVerticalBold } from '@mdi/js'
import Panel from '@/components/ui/Panel.vue'
import { Debounce } from 'vue-debounce-decorator'

@Component({
    components: { Panel}
})
export default class ToolchangerPanel extends Mixins(BaseMixin, ToolchangerMixin) {
    mdiSwapVerticalBold = mdiSwapVerticalBold
    mdiDotsVertical = mdiDotsVertical

    get toolDetails() {
        const types = this.toolchangerFilamentTypes || [];
        const colors = this.toolchangerFilamentColors || [];
        return this.toolchangerToolNames.map((name, index) => ({
            name: name,
            type:  this.toolchangerFilamentTypes[index] || 'Unknown',
            color: this.toolchangerFilamentColors[index] || 'black'
        }));
    }

    @Debounce(500)
    sendCmd(gcode: string): void {
        this.$store.dispatch('server/addEvent', { message: gcode, type: 'command' })
        this.$socket.emit('printer.gcode.script', { script: gcode })
    }
    mounted() {

   }
}
</script>
