<template>
    <p :style="stylee">{{showText}}</p>
</template>
<script>
export default {
    name:"Hitokoto",
    data(){
        return {
            showText:"",
        }
    },
    methods:{
        getHitokoto(){
            this.$backendAxios.get("/hitokoto").then(res=>{
                this.showText = res.data;
            })
        },
    },
    mounted(){
        this.getHitokoto();
    },
    props:{
        stylee:{
            type:Object,
            default:{}
        }
    }
}
</script>