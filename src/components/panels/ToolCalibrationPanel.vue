<template>
    <panel
        v-if="socketIsConnected"
        :icon="mdiAdjust"
        :title="$t('Panels.ToolCalibrationPanel.Headline')"
        :collapsible="$route.fullPath !== '/toolCalibration'"
        card-class="toolcalibration-panel"
        :margin-bottom="currentPage !== 'page'">
        <template #buttons>
           
        </template>
        <iframe id="tool-calibration-frame" title="Tool calibration page" :src="url">
        
        </iframe>
    </panel>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Mixins, Prop } from 'vue-property-decorator'
import BaseMixin from '../mixins/base'
import Panel from '@/components/ui/Panel.vue'
import { mdiMenuDown, mdiViewGrid, mdiAdjust } from '@mdi/js'

@Component({
    components: {
        Panel,
    },
})
export default class ToolCalibrationPanel extends Mixins(BaseMixin) {
    @Prop({ default: 'dashboard' }) declare currentPage?: string

    mdiAdjust = mdiAdjust
    mdiMenuDown = mdiMenuDown
    mdiViewGrid = mdiViewGrid

    get url() {
        return window.location.protocol + "//" + window.location.hostname + ":3000";
    }

}
</script>

<style scoped>
#tool-calibration-frame {
    width: 100%;
    height: calc(100vh - 50px);
    border-width: 0px;
}
</style>