<template>
  <div class="introduction">
    <el-row class="introduction-items" justify="center" :gutter="15">
      <el-col :md="8" :sm="24" :xs="24">
        <div class="text-center">
          <font-awesome-icon icon="fa-regular fa-sun" class="icon icon-rotate" />
        </div>
        <h3 class="subtitle">{{ $t('chat.title.complexQuestion') }}</h3>
        <introduction-item
          :content="$t('chat.message.question1')"
          class="cursor-pointer"
          @click="$emit('draft', $t('chat.message.question1'))"
        />
        <introduction-item
          :content="$t('chat.message.question2')"
          class="cursor-pointer"
          @click="$emit('draft', $t('chat.message.question2'))"
        />
        <introduction-item
          :content="$t('chat.message.question3')"
          class="cursor-pointer"
          @click="$emit('draft', $t('chat.message.question3'))"
        />
      </el-col>
      <el-col :md="8" :sm="24" :xs="24">
        <div class="text-center">
          <font-awesome-icon icon="fa-solid fa-book" class="icon icon-rotate" />
        </div>
        <h3 class="subtitle">{{ $t('chat.title.professionalQuestion') }}</h3>
        <introduction-item
          :content="$t('chat.message.question4')"
          class="cursor-pointer"
          @click="$emit('draft', $t('chat.message.question4'))"
        />
        <introduction-item
          :content="$t('chat.message.question5')"
          class="cursor-pointer"
          @click="$emit('draft', $t('chat.message.question5'))"
        />
        <introduction-item
          :content="$t('chat.message.question6')"
          class="cursor-pointer"
          @click="$emit('draft', $t('chat.message.question6'))"
        />
      </el-col>
      <el-col :md="8" :sm="24" :xs="24">
        <div class="text-center">
          <font-awesome-icon icon="fa-solid fa-fire" class="icon icon-rotate" />
        </div>
        <h3 class="subtitle">{{ $t('chat.title.getTips') }}</h3>
        <introduction-item
          :content="$t('chat.message.question7')"
          class="cursor-pointer"
          @click="$emit('draft', $t('chat.message.question7'))"
        />
        <introduction-item
          :content="$t('chat.message.question8')"
          class="cursor-pointer"
          @click="$emit('draft', $t('chat.message.question8'))"
        />
        <introduction-item
          :content="$t('chat.message.question9')"
          class="cursor-pointer"
          @click="$emit('draft', $t('chat.message.question9'))"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import IntroductionItem from './IntroductionItem.vue';
import { ElRow, ElCol } from 'element-plus';

export default defineComponent({
  name: 'ConversationIntroduction',
  components: {
    FontAwesomeIcon,
    IntroductionItem,
    ElRow,
    ElCol
  },
  emits: ['draft'],
  data() {
    return {};
  },
  computed: {}
});
</script>

<style lang="scss" scoped>
.introduction {
  width: 80%;
  margin: auto;
  padding: 30px 0;
  padding: 60px;

  .title {
    height: 70px;
    text-align: center;
    display: block;
    font-size: 36px;
    font-weight: 600;
    margin-bottom: 50px;
  }

  .introduction-items {
    height: fit-content;
    .icon {
      font-size: 20px;
    }
    .subtitle {
      text-align: center;
      font-size: 18px;
      margin-top: 10px;
      margin-bottom: 40px;
    }
    .introduction-item {
      margin-bottom: 15px;
    }
  }
}

@media (max-width: 767px) {
  .introduction {
    position: relative;
    top: initial;
    left: initial;
    transform: initial;
    width: 90%;
    margin: auto;
    .introduction-items {
      margin-bottom: 0;
    }
  }
}
</style>
