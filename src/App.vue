<script setup>
import { computed, watch } from 'vue';
import { i18n, setLanguageAsync } from '@/locales';

// 国际化文本对象
const locale = computed(() => {
  return i18n.global.messages.value[`${lang.value.language}`];
});

// watch(
//   () => lang.value.language,
//   (val) => {
//     setLanguageAsync(val);
//   },
//   { immediate: true },
// );
</script>

<template>
  <!-- <md-config-provider
    :size="theme.size"
    :locale="locale"
  > -->
    <router-view></router-view>

  <!-- </md-config-provider> -->
</template>
