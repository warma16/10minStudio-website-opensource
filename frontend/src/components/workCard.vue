<template>
    <div class="  mb-lg-0">
        <div class="px-4">
            <img class="img-rounded img-center img-fluid col-md-4 "  src="img/ResuxGamePreview.png" style="border-radius:6px;" />
            <div class="pt-4 text-center">
                <h5 class="title">
                    <span class="d-block mb-1" style="color:var(--color-text-1); ">{{name}}</span>
                    <small class="h6 text-muted" style="color:var(--color-text-3); ">{{description}}</small>
                </h5>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            name:"溯 Resux",
            description:"一款基于物理模型的下落式节奏音乐游戏",
        }
    }
}
</script>