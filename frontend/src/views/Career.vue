<template>
    <a-layout   >
        <a-layout-content>
            <!-- 用信息流的方式去呈现招聘信息 -->
            <a-list class="u_list">
                <template #header class="container">
                   <h2>职位列表</h2>
                </template>
                <a-list-item class="l_item container" v-if="!apiResponed">
                    <a-card class="ta_center">
                        <h3 class="spinner l"></h3>
                    </a-card>
                </a-list-item>
                <a-list-item class="l_item container" v-for="(item,index) in showData" :key="index">
                    
                    <a-card >
                        <template #title>
                            {{item.name}}
                            <a-tag v-for="(tag,tagIndex) in item.tags" :key="tagIndex">
                                {{tag}}
                            </a-tag>
                        </template>
                        {{item.summary}}
                        <template #extra>
                            <a-button type="primary" @click="DirectToDetail(item)">了解更多</a-button>
                        </template>
                    </a-card>
                </a-list-item>

            </a-list>
        </a-layout-content>
    </a-layout>
</template>
<style scoped>
.banner{
    background-image:url("@/assets/defaultBanner.png"),linear-gradient(180deg,#daebff,#f9fcff);;
    height:400px;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: top;
}
.container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 2.1875rem;
}
.search-middle {
    position: absolute;
    top: 50%;
    right: 180px;
    left: 180px;
    text-align: center;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
}
@media screen and (max-width: 768px) {
    .search-middle {
        right: 0;
        left: 0;
    }
}
@media screen and (max-width: 480px) {
    .search-middle {
        right: 0;
        left: 0;
    }
}
@media screen and (max-width: 1068px){
    .search-middle {
        right: 0;
        left: 0;
    }
}


</style>
<script>
export default {
    data(){
        return {
            showData:[],
            apiResponed:false,
        }
    },
    created(){
        this.$backendAxios.get('/career').then(res=>{
            this.apiResponed=true
            this.showData = res.data.data
        }).catch(err=>{
            this.apiResponed=true
        })
    },
    methods:{
        DirectToDetail(item){
            this.$router.push({
                name:'CareerDetail',
                params:item
            })
        }
    }
}
</script>