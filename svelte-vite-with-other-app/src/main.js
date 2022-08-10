import "./app.css";
import App from "./App.svelte";

export default function (target, props) {
    new App({
        target,
        props,
    });
}
