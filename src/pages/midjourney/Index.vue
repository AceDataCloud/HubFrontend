<template>
  <div class="page">
    <div class="presets">
      <preset-panel v-model="preset" />
    </div>
    <div class="main">
      <channel-selector v-model="channel" class="mb-4" @select="onSelectChannel" />
      <api-status :application="application" class="mb-4" />
      <div class="pt-4">
        <reference-image class="mb-4" @change="references = $event" />
        <prompt-input v-model="prompt" class="mb-4" />
        <elements-selector v-model="elements" :advanced="preset?.advanced" class="mb-4" />
        <ignore-selector v-if="preset?.advanced" v-model="ignore" class="mb-4" />
        <final-prompt v-if="finalPrompt" :model-value="finalPrompt" />
        <el-button type="primary" class="btn btn-generate" :disabled="!finalPrompt" @click="onGenerate">
          {{ $t('midjourney.button.generate') }}
        </el-button>
      </div>
    </div>
    <div class="result">
      <task-brief-list :applications="applications" @custom="onCustom" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PresetPanel from '@/components/midjourney/PresetPanel.vue';
import PromptInput from '@/components/midjourney/PromptInput.vue';
import ElementsSelector from '@/components/midjourney/ElementsSelector.vue';
import IgnoreSelector from '@/components/midjourney/IgnoreSelector.vue';
import { ElButton, ElMessage } from 'element-plus';
import ChannelSelector from '@/components/midjourney/ChannelSelector.vue';
import ReferenceImage from '@/components/midjourney/ReferenceImage.vue';
import {
  IApplication,
  IMidjourneyChannel,
  MidjourneyImagineAction,
  IMidjourneyImagineResponse,
  IMidjourneyPreset,
  MIDJOURNEY_CHANNEL_FAST,
  MIDJOURNEY_CHANNEL_TURBO,
  MIDJOURNEY_CHANNEL_RELAX,
  applicationOperator,
  midjourneyOperator,
  MidjourneyImagineState,
  IMidjourneyImagineTask,
  IMidjourneyImagineRequest
} from '@/operators';
import ApiStatus from '@/components/common/ApiStatus.vue';
import TaskBriefList from '@/components/midjourney/tasks/TaskBriefList.vue';
import FinalPrompt from '@/components/midjourney/FinalPrompt.vue';

interface IData {
  channel: IMidjourneyChannel;
  preset: IMidjourneyPreset;
  prompt: string;
  elements: string[];
  ignore: string;
  initializing: boolean;
  applied: boolean | undefined;
  applications: IApplication[];
  references: string[];
  task: IMidjourneyImagineTask | undefined;
}

const CALLBACK_URL = 'https://webhook.zhishuyun.com/midjourney';

export default defineComponent({
  name: 'MidjourneyIndex',
  components: {
    ChannelSelector,
    ReferenceImage,
    PresetPanel,
    PromptInput,
    ElementsSelector,
    IgnoreSelector,
    ElButton,
    ApiStatus,
    TaskBriefList,
    FinalPrompt
  },
  data(): IData {
    return {
      applications: [],
      channel: MIDJOURNEY_CHANNEL_FAST,
      preset: this.$store.getters.midjourney.preset || {},
      prompt: '',
      elements: [],
      ignore: '',
      initializing: false,
      applied: undefined,
      task: undefined,
      references: []
    };
  },
  computed: {
    application() {
      if (this.applications && this.applications.length > 0) {
        return this.applications.filter((item) => item.api_id === this.channel.apiId)[0];
      }
      return undefined;
    },
    finalPrompt(): string {
      let content = '';
      if (this.references.length > 0) {
        content += `${this.references.join(' ')} `;
      }
      if (this.prompt) {
        content += this.prompt;
      }
      if (this.elements.length > 0) {
        content += ',' + this.elements.join(',');
      }
      if (this.preset.model) {
        content += ` --${this.preset.model}`;
      }
      if (this.preset.version) {
        content += ` --version ${this.preset.version}`;
      }
      if (this.preset.chaos) {
        content += ` --chaos ${this.preset.chaos}`;
      }
      if (this.preset.quality) {
        content += ` --quality ${this.preset.quality}`;
      }
      if (this.preset.ratio) {
        content += ` --ar ${this.preset.ratio}`;
      }
      if (this.preset.stylize) {
        content += ` --stylize ${this.preset.stylize}`;
      }
      if (this.preset.weird) {
        content += ` --weird ${this.preset.weird}`;
      }
      if (this.ignore) {
        content += ` --no ${this.ignore}`;
      }
      if (this.preset.iw) {
        content += ` --iw ${this.preset.iw}`;
      }
      if (this.preset.raw) {
        content += ` --style raw`;
      }
      return this.prompt || this.references?.length > 0 ? content : '';
    }
  },
  mounted() {
    this.onFetchApplications();
  },
  methods: {
    async onSelectChannel() {
      await this.onFetchApplications();
    },
    async onFetchApplications() {
      this.initializing = true;
      const { data: applications } = await applicationOperator.getAll({
        user_id: this.$store.state.user.id,
        api_id: [MIDJOURNEY_CHANNEL_FAST.apiId, MIDJOURNEY_CHANNEL_RELAX.apiId, MIDJOURNEY_CHANNEL_TURBO.apiId]
      });
      this.initializing = false;
      this.applications = applications?.items;
    },
    async onStartTask(request: IMidjourneyImagineRequest) {
      const token = this.application?.credential?.token;
      const endpoint = this.application?.api?.endpoint;
      const path = this.application?.api?.path;
      if (!token || !endpoint || !path) {
        console.error('no token or endpoint or question');
        return;
      }
      midjourneyOperator
        .imagine(request, {
          token,
          endpoint,
          path
        })
        .then(() => {
          ElMessage.success(this.$t('midjourney.message.startTaskSuccess'));
        })
        .catch(() => {
          ElMessage.error(this.$t('midjourney.message.startTaskFailed'));
        });
    },
    async onCustom(payload: { image_id: string; action: MidjourneyImagineAction }) {
      const request = {
        image_id: payload.image_id,
        action: payload.action,
        callback_url: CALLBACK_URL
      };
      this.onStartTask(request);
    },
    async onGenerate() {
      const request = {
        prompt: this.finalPrompt,
        action: MidjourneyImagineAction.GENERATE,
        translation: this.preset?.translation,
        callback_url: CALLBACK_URL
      };
      this.onStartTask(request);
    }
  }
});
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  .presets {
    width: 260px;
    height: 100%;
    overflow-y: scroll;
  }
  .main {
    flex: 1;
    padding: 15px;
    height: 100%;
    overflow-x: scroll;
    .title {
      font-size: 14px;
      margin-bottom: 10px;
    }
    .btn.btn-generate {
      width: 80px;
      border-radius: 20px;
    }
  }
  .result {
    overflow-y: scroll;
    width: 400px;
    height: 100%;
  }
}
</style>