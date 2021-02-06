<script>
import Vue from 'vue';
import BarColumnPie from '@/bar-column-pie.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    BarColumnPie
  }
});
</script>

<template>
  <div id="app">
    <bar-column-pie />
  </div>
</template>
