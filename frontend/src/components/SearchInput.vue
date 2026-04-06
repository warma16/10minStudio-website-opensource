<template>
    <div>
        <a-input-search :placeholder="placeholder" v-model="keyword" @search="EmitSearch"></a-input-search>
        <a-list size="large" :class="`scrollbar-hidden ${this.listDynamicClass} scrollbar-hidden`" :max-height="200" >
            <a-list-item v-for="(suggestion,key) in suggestions" :key="key" @click="SuggestionClick(suggestion)">{{suggestion}}</a-list-item>
        </a-list>
    </div>
</template>
<style scoped>
/** 创建下拉动画，回收动画 */
@-webkit-keyframes rotateSelectBack {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

@keyframes rotateSelectBack {
    0% {
        opacity: 1;
        
    }

    100% {
        opacity: 0;
    }
}
@-webkit-keyframes rotateSelectGo {
    0% {
        transform: rotateX(-90deg);
        -ms-transform: rotateX(-90deg);
        -webkit-transform: rotateX(-90deg);
        opacity: 0;
    }

    100% {
        transform: rotateX(0deg);
        -ms-transform: rotateX(0deg);
        -webkit-transform: rotateX(0deg);
        opacity: 1;
    }
}

@keyframes rotateSelectGo {
    0% {
        transform: rotateX(-90deg);
        -ms-transform: rotateX(-90deg);
        -webkit-transform: rotateX(-90deg);
        opacity: 0;

    }

    100% {
        transform: rotateX(0deg);
        -ms-transform: rotateX(0deg);
        -webkit-transform: rotateX(0deg);
        opacity: 1;
    }
}
.transin{
    animation: rotateSelectGo .5s cubic-bezier(.165, .84, .44, 1) forwards;
    -webkit-animation: rotateSelectGo .5s cubic-bezier(.165, .84, .44, 1) forwards;
}
.transout{
    animation: rotateSelectBack .5s cubic-bezier(.165, .84, .44, 1) forwards;
    -webkit-animation: rotateSelectBack .5s cubic-bezier(.165, .84, .44, 1) forwards;
}
.suggestions{
    box-shadow:0 0 10px rgba(0,0,0,0.2);
    border:1px solid #ccc;
    background-color:white;
}
.suggestions-hide{
    display:none;
}
.no-border{
    border:none;
    box-shadow:none;
}

.scrollbar-hidden::-webkit-scrollbar {
  width: 0;
}
</style>
<script>
export default {
    props:{
        searchDataInputs:{
            type:Array,
            default:[]
        },
        placeholder:{
            type:String,
            default:"Please enter something"
        },
        isGroundClassNeeded:{
            type:Boolean,
            default:false
        },
    },
    data(){
        return {
            suggestions:[
                
            ],
            listDynamicClass:"suggestion-hide",
            
            keyword:"",
            ifSearch:false,
        }
    },
    methods:{
        suggestionsChanges(val,oldval){
            var oldvall=oldval||0;
            var vall=val||0;
            
            if(oldvall<=0&&vall>0){
                if(this.isGroundClassNeeded){
                    this.listDynamicClass="ground-glass transin suggestions";
                    return;
                }
                this.listDynamicClass="transin suggestions";

                return ;
            }
            else if(oldvall>0&&vall<=0){
                if(this.isGroundClassNeeded){
                    this.listDynamicClass="ground-glass transout suggestions";
                }
                else{
                    this.listDynamicClass="transout suggestions";
                }
                var timeouter=setTimeout(()=>{
                    this.listDynamicClass="no-border suggestions-hide";
                    clearTimeout(timeouter);
                },500);
                return ;
            }else{
                if(oldvall==0&&vall==0){
                    this.listDynamicClass="no-border suggestions";
                    return;
                }
                this.listDynamicClass="suggestions";
                return ;
            }
        },
        searchSuggestions(keywordVal,searchDataInputsVal){
            var searchDataInputsVal=searchDataInputsVal||this.searchDataInputs;
            var keywordVal=keywordVal||this.keyword;
            var suggestions=[];
            if(keywordVal!=""){
                for(var i=0;i<searchDataInputsVal.length;i++){
                    var searchDataInputsValItem=searchDataInputsVal[i];

                    if(searchDataInputsValItem.indexOf(keywordVal)>-1){
                        suggestions.push(searchDataInputsValItem);
                    }
                }
            }
            this.suggestions=suggestions;
        },
        EmitSearch(){
            this.ifSearch=true;
            console.log("EmitSearch");
            this.suggestions=[];
            this.$emit("search",this.keyword);
        },
        SuggestionClick(suggestion){
            this.ifSearch=true;
            this.keyword=suggestion;
            this.EmitSearch();
        },
    },
    watch:{
        "suggestions.length":{
            handler(val,oldval){
                console.log("suggestions.length begin>>>")
                console.log(val);
                console.log(oldval);
                console.log("suggestions.length end>>>")
                this.suggestionsChanges(val,oldval);
            },
            immediate:true,
            deep:true,
        },
        "keyword":{
            handler(val,oldval){
                if(!this.ifSearch){
                    console.log(val);
                    this.searchSuggestions(val,this.searchDataInputs);
                }
            },
            immediate:true,
            deep:true,
        },
        "searchDataInputs":{
            handler(val,oldval){
                if(!this.ifSearch){
                    console.log(val);
                    this.searchSuggestions(this.keyword,val);
                }
            },
            immediate:true,
            deep:true,
        },
        
    },
    mounted(){
        
            
  
    }
}
</script>