import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";

const production = !process.env.ROLLUP_WATCH;

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
                stdio: ["ignore", "inherit", "inherit"],
                shell: true,
            });

            process.on("SIGTERM", toExit);
            process.on("exit", toExit);
        },
    };
}

const default_dev = {
    input: "src/main.js",
    output: { sourcemap: true, format: "iife", name: "app", file: "public/build/default/bundle.js" },
    plugins: [
        svelte({ compilerOptions: { dev: !production } }),
        css({ output: "bundle.css" }),
        resolve({ browser: true, dedupe: ["svelte"] }),
        commonjs(),
        !production && serve(),
        !production && livereload("public"),
        production && terser(),
    ],
    watch: { clearScreen: false },
};
const plugins = [
    svelte(),
    css({ output: "bundle.css" }),
    resolve({ browser: true, dedupe: ["svelte"] }),
    commonjs(),
    terser(),
];
const default_prod = {
    input: "src/main.js",
    output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        file: "H:/Development/temp-svelte-project/www/svelte_bundles/default/bundle.js",
    },
    plugins,
};

const clone = (obj) => {
    return { ...JSON.parse(JSON.stringify(obj)), plugins };
};

// specific id example
const specific_id_dev = clone(default_dev);
const specific_id_prod = clone(default_prod);
specific_id_dev.input = "src/main_specific_id.js";
specific_id_dev.output.file = "public/build/specific_id/bundle.js";
specific_id_prod.input = "src/main_specific_id.js";
specific_id_prod.output.file = "H:/Development/temp-svelte-project/www/svelte_bundles/specific_id/bundle.js";

// dynamic attach example
const dynamic_attach_dev = clone(default_dev);
const dynamic_attach_prod = clone(default_prod);
dynamic_attach_dev.input = "src/main_dynamic_attach.js";
dynamic_attach_dev.output.file = "public/build/dynamic_attach/bundle.js";
dynamic_attach_prod.input = "src/main_dynamic_attach.js";
dynamic_attach_prod.output.file = "H:/Development/temp-svelte-project/www/svelte_bundles/dynamic_attach/bundle.js";

export default [default_dev, default_prod, specific_id_dev, specific_id_prod, dynamic_attach_dev, dynamic_attach_prod];
