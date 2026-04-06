<template>
    <vue-qr :text="data" :size="size"></vue-qr>
</template>
<script>
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
export default{
    name: 'QRCode',
    props: ['data', 'size'],
    mounted(){
        this.$emit("display")
    },
    components: {
        vueQr
    }

}
</script>