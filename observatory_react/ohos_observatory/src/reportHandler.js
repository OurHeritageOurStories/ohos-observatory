import {Metric} from "web-vitals";

function reportHandler(Metric){
    console.log(Metric);
    const payload = JSON.stringify(Metric);
    const url = "/analytics";
    if (navigator.sendBeacon){
        navigator.sendBeacon(url, payload);
    } else {
        fetch(url, {payload, method: "POST", keepalive: true});
    }
}

export default reportHandler;