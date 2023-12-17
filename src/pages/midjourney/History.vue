<template>
  <div class="page">
    <div class="presets">
      <preset-panel v-model="preset" />
    </div>
    <div class="main">
      <channel-selector v-model="channel" class="mb-4" @select="onSelectChannel" />
      <api-status :application="application" class="mb-4" />
      <task-full-list :applications="applications" @custom="onCustom" />
      <el-button type="primary" class="btn btn-generate" @click="onGenerateNew">
        <font-awesome-icon icon="fa-solid fa-chevron-left" class="icon icon-rotate mr-1" />
        {{ $t('midjourney.button.generateNew') }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PresetPanel from '@/components/midjourney/PresetPanel.vue';
import { ElMessage, ElButton } from 'element-plus';
import ChannelSelector from '@/components/midjourney/ChannelSelector.vue';
import ApiStatus from '@/components/common/ApiStatus.vue';
import {
  IApplication,
  IMidjourneyChannel,
  MidjourneyImagineAction,
  IMidjourneyPreset,
  MIDJOURNEY_CHANNEL_FAST,
  MIDJOURNEY_CHANNEL_TURBO,
  MIDJOURNEY_CHANNEL_RELAX,
  applicationOperator,
  midjourneyOperator,
  IMidjourneyImagineTask,
  IMidjourneyImagineRequest
} from '@/operators';
import TaskFullList from '@/components/midjourney/tasks/TaskFullList.vue';
import { ROUTE_MIDJOURNEY_INDEX } from '@/router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

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
    PresetPanel,
    TaskFullList,
    ChannelSelector,
    ApiStatus,
    ElButton,
    FontAwesomeIcon
  },
  data(): IData {
    return {
      applications: [],
      channel: MIDJOURNEY_CHANNEL_FAST,
      preset: this.$store.getters.midjourney.preset,
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
    }
  },
  mounted() {
    this.onFetchApplications();
  },
  methods: {
    async onGenerateNew() {
      this.$router.push({
        name: ROUTE_MIDJOURNEY_INDEX
      });
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
    async onSelectChannel() {
      await this.onFetchApplications();
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
    width: calc(100% - 260px);
    display: flex;
    flex-direction: column;
    position: relative;

    .title {
      font-size: 14px;
      margin-bottom: 10px;
    }

    .btn.btn-generate {
      position: absolute;
      left: 30px;
      top: 30px;
      border-radius: 20px;
    }
  }
}
</style>