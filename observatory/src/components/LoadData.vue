<script>

var links_to_data = {
    "manufactured":"dave",
    "playground":"bob",
    "ai_lab":"will"
}



export default{
    methods:{
        update_data(choice){
            let choice = document.querySelector('input[name="data_set"]:checked').value;
            switch(choice){
                case manufactured:
                    this.emits('selected_data',links_to_data.manufactured);
                    break;
                case playground:
                    this.emits('selected_data',links_to_data.playground);
                    break;
                case ai_lab:
                    this.emits('selected_data',links_to_data.ai_lab);
                    break;
                default:
                    alert("If you have seen this message, please note down how and let the OHOS TNA team know - it should be unreachable from the UI!")
            }
        }
    },
    emits:['selected_data']
}
</script>

<template>

<fieldset>

    <div>
        <input type="radio" id="manufactured" name="data_set" value="manufactured" @click="update_data">
        <label for="manufactured">Manufactured</label>
    </div>

    <div>
        <input type="radio" id="playground" name="data_set" value="playground" @click="update_data">
        <label for="playground">Playground</label>
    </div>

    <div>
        <input type="radio" id="ai_lab" name="data_set" value="ai_lab" @click="update_data">
        <label for="ai_lab">Ai Lab</label>
    </div>

</fieldset>

</template>

<style>
</style>