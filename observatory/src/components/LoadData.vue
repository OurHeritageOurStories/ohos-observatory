<script>

var links_to_data = {
    "manufactured":"",
    "playground":"",
    "ai_lab":""
}

export default{
    data(){

    },
    methods:{
        updatedata(choice){
            switch(choice){
                case manufactured:
                case playground:
                case ai_lab:
                default:
                    alert("If you have seen this message, please note down how and let the OHOS TNA team know - it should be unreachable from the UI!")
            }
        }
    }
}

</script>

<template>

<fieldset>

    <div>
        <input type="radio" id="manufactured" name="data-set" value="manufactured" onclick="updatedata(manufactured)">
        <label for="manufactured">Manufactured</label>
    </div>

    <div>
        <input type="radio" id="playground" name="data-set" value="playground" onclick="updatedata(playground)">
        <label for="playground">Playground</label>
    </div>

    <div>
        <input type="radio" id="ai_lab" name="data-set" value="ai_lab" onclick="updatedata(ai_lab)">
        <label for="ai_lab">Ai Lab</label>
    </div>

</fieldset>

</template>

<style>
</style>