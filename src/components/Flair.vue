<template>
    <div :style="flairStyle" class="flair">
        {{ name }}
    </div>
</template>
  
<script setup lang="ts">
const props = defineProps<{
    name: string,
    color: string
}>();

const flairStyle: { [key: string]: string } = {
    backgroundColor: props.color,
    color: 'white',
    borderRadius: '5px',
    padding: '3px 6px',
    fontSize: '12px'
};
</script>
  
<style scoped>
.flair {
    display: inline-block;
    font-weight: 500;
    letter-spacing: .3px;
}
</style>
