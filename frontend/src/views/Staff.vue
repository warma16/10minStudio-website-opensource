<template>
<a-layout  class="section section-lg">
        <a-layout-content  >
          <div class="container">
              <div class="row justify-content-center text-center mb-lg">
                <div class="col-lg-8">
                  <h2 class="display-3">
                    STAFF列表
                  </h2>
                  
                </div>
              </div>
              <div v-for="(slice,indexe) in showStaffStyle" :key="indexe">
                    <div class="row" v-if="slice!='divider'" >
                        
                        <member-card  v-for="(item,index) in slice" :key="index" :name="item.name" :description="item.tags" :biliMid="item.biliMid" :out-avatar="item.gravatarUrl"></member-card>
                        
                        
                    </div>
                    <a-divider v-if="slice=='divider'" ></a-divider>
                </div>
            </div>
        </a-layout-content>
      </a-layout>
</template>
<script>
import memberCard from '../components/memberCard.vue';

export default {
    data(){
        return {
            teamMembers:[],
            showStaffStyle:[]
        }
    },
    methods:{
        async getStaffs(){
            let teamMembers=[]
            if(this.$route.params.staffData!=undefined){
                teamMembers=JSON.parse(this.$route.params.staffData)
                return teamMembers
            }
            try{
                let ress=await this.$backendAxios({
                    method: 'get',
                    url:"/member"
                })
                teamMembers=ress.data.data;

                this.$bus.emit("nativeconsolelog",teamMembers);
                
            }catch(e){
                this.$bus.emit("nativeconsolelog",e);
            }
            return teamMembers
        },
        async computeShowStyle(){
            let maxContainWidth=6
            let limitGroupNums=Math.ceil(this.teamMembers.length/maxContainWidth)
            for(let i=0;i<limitGroupNums;i++){
                this.showStaffStyle.push(this.teamMembers.slice((i)*maxContainWidth,(i+1)*maxContainWidth))
                if(i<limitGroupNums-1){
                    this.showStaffStyle.push("divider")
                }
            }
        }
    },
    mounted(){
        var packedAsync=async (__this)=>{
            __this.teamMembers=await __this.getStaffs()
            __this.computeShowStyle()
        }
        packedAsync(this)
    },
    components:{
        memberCard,
    }
}
</script>
<style scoped>
.container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 2.1875rem;
}
.display-3, .display-4 {
   
   line-height: 1.3;
}
.display-3 {
   font-size: 2.1875rem;
}
</style>