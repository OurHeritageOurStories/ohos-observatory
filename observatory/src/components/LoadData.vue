<script>

var links_to_data = {
    "manufactured":"https://raw.githubusercontent.com/nationalarchives/ohos-poc-1/main/OHOS-PoC/docs/test%20data%20options/multimedia%20types%20triples?token=GHSAT0AAAAAABU6DE6TWYSLNBN3MSYECYXQYVMR24A",
    "playground":"https://raw.githubusercontent.com/nationalarchives/ohos/main/data/HC%20extract%20images%20-%20direct%20image%20references?token=GHSAT0AAAAAABU6DE6TOY43BCN2SDMJXKC6YVMROLA",
    "ai_lab":"awaiting PR"
}



export default{
    methods:{
        update_data(choice){
            //let choice = document.querySelector('input[name="data_set"]:checked').value;
            switch(choice){
                case "manufactured":
                    this.$emit('selected_data',links_to_data.manufactured);
                    break;
                case "playground":
                    this.$emit('selected_data',links_to_data.playground);
                    break;
                case "ai_lab":
                    this.$emit('selected_data',links_to_data.ai_lab);
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
        <input type="radio" id="manufactured" name="data_set" value="manufactured" @click="update_data('manufactured')">
        <label for="manufactured">Manufactured</label>
    </div>

    <div>
        <input type="radio" id="playground" name="data_set" value="playground" @click="update_data('playground')">
        <label for="playground">Playground</label>
    </div>

    <div>
        <input type="radio" id="ai_lab" name="data_set" value="ai_lab" @click="update_data('ai_lab')">
        <label for="ai_lab">Ai Lab</label>
    </div>

</fieldset>

</template>

<style>
</style>