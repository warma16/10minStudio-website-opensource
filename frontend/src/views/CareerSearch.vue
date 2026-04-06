<template>
    <a-layout>
        <a-layout-header >
            <div class="row">
                <div class="col-md-2  " >
                    <h1 class="col-md-2  ">搜索</h1>
                </div>
                <a-divider direction="vertical"  class="col-md-1  " />
                <div class="col-md-9  ta_center">
                   <search-input ></search-input>
                </div>
                <div class="">
                    Search Action Area
                </div>
            </div>
        </a-layout-header>
        <a-layout-content>
        </a-layout-content>
    </a-layout>
</template>
<script>
import SearchInput from "../components/SearchInput.vue"
export default {
    data(){
        return {
            mode:"",
        }
    },
    created(){
        this.mode=this.$route.params.mode;
    },
    components:{
        SearchInput
    },
}
</script>
<style scoped>
@media only screen and (max-width: 734px){
    .store-search-wrapper .store-search-bar {
        padding: 22px 16px 17px;
    }
    .store-search-wrapper .store-search-bar .store-search-bar__content {
        padding: 0;
        width: 100%;
        box-sizing: border-box;
        max-width: none;
        height: 100%;
    }
    .store-search-wrapper .store-search-bar .store-search-bar__content .store-search-section-heading {
        text-align: center;
    }
    .store-search-wrapper .store-search-bar .store-search-section-heading {
        margin-bottom: 19px;
        margin-left: 14px;
        
    }
    .store-search-wrapper .store-search-bar .store-search-section-heading, .store-search-wrapper .store-search-bar .store-search-section-input, .store-search-wrapper .store-search-bar .store-search-section-storelist {
        flex-basis: 100%;
        max-width: 100%;
        margin-bottom: 10px;
    }
    .store-search-wrapper .store-search-bar .store-search-section-input {
        margin-bottom: 15px;
    }
    .store-search-wrapper .store-search-bar .store-search-section-heading, .store-search-wrapper .store-search-bar .store-search-section-input, .store-search-wrapper .store-search-bar .store-search-section-storelist {
        flex-basis: 100%;
        max-width: 100%;
        margin-bottom: 10px;
    }
}
@media only screen and (max-width: 1068px){
    .store-search-wrapper .store-search-bar .store-search-bar__content {
        max-width: 980px;
        width: auto;
        padding-left: calc(max(22px, env(safe-area-inset-left)));
        padding-right: calc(max(22px, env(safe-area-inset-left)));
    }
    .store-search-wrapper .store-search-bar .store-search-bar__content .store-search-section-input {
        text-align: center;
    }
}
.store-search-wrapper .store-search-bar {
    background-color: #f2f2f2;
    color: #1d1d1f;
    padding: 8px 0;
    border-bottom: 1px solid hsla(0,0%,73%,.6);
}
.store-search-wrapper .store-search-bar .store-search-bar__content {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    width: 980px;
    max-width: 1018px;
    width: 1018px;
}
.store-search-wrapper .store-search-bar .store-search-section-heading, .store-search-wrapper .store-search-bar .store-search-section-input, .store-search-wrapper .store-search-bar .store-search-section-storelist {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    min-width: 0;
}
.store-search-wrapper .store-search-bar .store-search-section-heading, .store-search-wrapper .store-search-bar .store-search-section-storelist {
    flex-basis: 25%;
    max-width: 25%;
}


.
.store-search-wrapper .store-search-bar .store-search-section-heading .description {
    margin-bottom: 0;
    font-size: 21px;
    line-height: 1.1904761905;
    font-weight: 600;
    letter-spacing: .011em;
    color: #1d1d1f;
}

.store-search-wrapper .store-search-bar .store-search-section-heading, .store-search-wrapper .store-search-bar .store-search-section-input, .store-search-wrapper .store-search-bar .store-search-section-storelist {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    min-width: 0;
}

.store-search-wrapper .store-search-bar .store-search-section-input {
    flex-basis: 50%;
    max-width: 50%;
}

.store-search-wrapper .store-search-bar .store-search-bar__content .store-search-section-input * {
    text-align: left;
}
</style>