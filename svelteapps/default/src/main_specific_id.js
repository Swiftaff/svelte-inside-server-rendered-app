import App from "./App.svelte";
const app = new App({ target: document.getElementById("specific_id"), props: { name: "world" } });
export default app;
