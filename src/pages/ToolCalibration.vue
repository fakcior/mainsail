<style scoped></style>

<template>
    <div>
        <v-row>
            <v-col col-12>
                <tool-calibration-panel current-page="page" />
            </v-col>
        </v-row>
    </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import ToolCalibrationPanel from '@/components/panels/ToolCalibrationPanel.vue'
@Component({
    components: { ToolCalibrationPanel },
})
export default class PageToolCalibration extends Mixins(BaseMixin) {}
</script>
