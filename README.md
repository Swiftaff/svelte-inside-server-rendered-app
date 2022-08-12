# Embedding svelte within an existing server-rendered app

Just some notes and instructions on how to use Svelte in an existing app, rather than greenfield or Sveltekit.

Why? Maybe you just want to make a LITTLE bit of your server-rendered app reactive because most of it works fine as is, but trying to make a modern front-end interface using imperitive JavaScript or jQuery is turning into unmaintainable spaghetti code (finding divs by ID, parsing text values and updating the dom manually based on click events).

Svelte (and Vue and React etc) allow you to write clean logic, organised into sub-components, where the interface AUTOMATICALLY updates based on your data models.

However, the svelte config and build process can be frustrating to learn - see below for some basics.

## Step 1 - start with your main repo

```js
|_ mainrepo/                // root of your main repo
   |_ www/                  // webroot - local webserver runs from here
   |  |_ index.html         // your main homepage
   |  |_ assets/            // some assets
   |     ...
   |  |_ otherpages.html    // other pages etc
   |  ...
   |_ src/                  // maybe the src of your mainrepo
```

The root of this repo pretends to be a server-rendered app. It has a basic webserver in it with html pages to demonstrate various ways of embedding svelte apps. You don't need to use this bit at all - it's just an example, use your usual dev webserver!

Install node (including npm) `https://nodejs.org/en/download/`.
Then run this command to start the webserver at `http://127.0.0.1:12345`

```
node www
```

## Step 2 - install svelte into a subfolder

Assuming you want to keep the Svelte source alongside your server-rendered-app source.

We won't follow instructions here: `https://svelte.dev/` as that installs svelte using vite which is not quite ready to use at end 2022.
Instead we'll just use Svelte, Degit and Rollup which is fine for small/medium svelte apps: https://github.com/sveltejs/template#svelte-app

1. run cmd.exe and `cd mainrepo` directory, or open VS Code and open the `mainrepo` folder and `Ctrl-~` to get to the command prompt Terminal
1. create a general `svelteapps` directory to hold each svelte app inside
1. `cd svelteapps`
1. `npx degit sveltejs/template nameofnewsvelteapp`
1. This should create the `nameofnewsvelteapp` directory inside `mainrepo/svelteapps` with the start of a new svelte app
1. `cd nameofnewsvelteapp`
1. `npm i` creates a `node_modules` folder and installs all the dependencies in there (dependecies are defined in the `package.json` and `package-lock.json`)
1. Development dirs like `node_modules` should already be .gitignore so ignore the same files if using another SCM before committing any changes
1. `npm run dev` to run dev mode, and visit the `http://localhost:XXXX` site which the terminal provides. It should show a default example Svelte app running independent of the example webserver for the mainrepo at `http://127.0.0.1:12345`
1. In dev mode you can now edit the top level svelte file `mainrepo/svelteapps/nameofnewsvelteapp/src/App.svelte` and the localhost page will hot-reload to show the changes immediately
1. This page is created from the static files inside `public`, and the `build` sub-directory where the app's JS & CSS has been auto-compiled
1. You can get rid of the `scripts` directory assuming you won't use TypeScript, and remove or modify the `README.md` as needed
1. mainrepo now looks like this...

```js
/*
|_ mainrepo/
   |_ www/
   |  |_ index.html
   |  |_ assets/
   |     ...
   |  |_ otherpages.html
   |  ...
   |_ src/
*/
   |_ svelteapps/
      |_ nameofnewsvelteapp
         |_ node_modules/
         |_ public
            |_ build
               |_ bundle.css
               |_ bundle.js
               _| bundle.js.map
            |_ favicon.png
            |_ global.css
            |_ index.html
         |_ src/
            |_ App.svelte
            |_ main.js
         |_ .gitignore
         |_ package-lock.json
         |_ package.json
         |_ README.md
         |_ vite.config.js
```

## Step 3 - default: embed the demo svelte app on page load at the bottom of the body in your main app

Nothing fancy, just build the same demo svelte app for production and make it appear in your server-based app...

1. `npm run build` creates the files in the `public/build` directory. This command gets called as part of `npm run dev` anyway, which is why the build has already happened, but running build turns on minification too using the `production` flag shown below.
1. To then use the build files in production, you could continually manually copy/paste them from `public/build` into your `mainrepo/www` directory, but it's easier to adjust the build script to output a copy of these where you need them. The build script is in `rollup.config.js` and the main part is lengthy due to comments. It can be shortened to:

```js
export default {
    input: "src/main.js",
    output: { sourcemap: true, format: "iife", name: "app", file: "public/build/bundle.js" },
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
```

3. To add extra build outputs, just export an array of two or more objects, e.g. in this case for `dev` and `prod`, instead of just one object for both, and then update the `output` path in the second. You can also simplify the new `prod` object removing the dev features, e.g.

```js
const dev = {
    input: "src/main.js",
    output: { sourcemap: true, format: "iife", name: "app", file: "public/build/bundle.js" },
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
const prod = {
    input: "src/main.js",
    output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        file: "<path-to-mainrepo>/mainrepo/www/svelte_bundles/default/bundle.js",
    },
    plugins: [
        svelte(),
        css({ output: "bundle.css" }),
        resolve({ browser: true, dedupe: ["svelte"] }),
        commonjs(),
        terser(),
    ],
};
export default [dev, prod];
```

4. Then to embed the svelte app, paste these two lines into the head of your main html page `www/index.html` or wherever it is

```html
<script defer src="/svelte_bundles/default/bundle.j"></script>
<link rel="stylesheet" href="/svelte_bundles/default/bundle.css" />
```

6. Now check your mainrepo webserver and the svelte app should appear in that div!

7. See next section if you want to have more control over when and where the svelte app appears

## Step 4 - different embedding options, and managing multiple svelte apps

The default way to embed a svelte app to appear in the body on page load is OK. But there are other scenarios where you might like more control, like:

-   you need different naming because it clashes with other js called 'app'
-   you don't want it to appear only at bottom of the body
-   you want multiple little bits of your app to be svelte apps
-   you want a fancy svelte interface to appear dynamically only when you click a button
-   you want the same svelte app to appear dynamically in multiple places (e.g. a popup edit interface for each row in a 1000 row table)
-   you want to server-render a list of companies as json in your html markup, for svelte apps to consume as props when they load

### Step 4 a - embed the demo svelte app in a specific div, not just in body

1. By default svelte creates an app which immediately attaches to the bottom of the body on page load. Instead paste the target div into your main html pages where you want the demo svelte app to appear in `www/index.html` and also in `public/index.html`.

```html
<div id="specific_div_id"></div>
```

2. Edit `main.js` and change the target from `document.body` to the required div id

```js
import App from "./App.svelte";
const app = new App({
    target: document.getElementById("specific_div_id"), // <---
    props: { name: "world" },
});
export default app;
```

3. Run dev code, or rebuild and test your dev and mainrepo pages.

### Step 4 b - dynamically attach the svelte app on-demand, instead of on page load - and with server-rendered props

1. Edit `main.js` to remove the targetting from the build process, so that you can define the target in your server-based app code instead

```js
import App from "./App.svelte";
export default function (options) {
    new App(options);
}
```

2. Edit `public/index.html` & `www/index.html` to add some jQuery or JavaScript to trigger the load of the svelte app dynamically like a button click, e.g.

```html
<body>
    <!-- whatever trigger you want, e.g. a button -->
    <button id="button">attach svelte app to #dynamicSvelteApp div above</button>
    <div id="dynamicSvelteApp"></div>
    <script>
        let button = document.getElementById("button");
        button.addEventListener("click", attachSvelteApp);

        function attachSvelteApp() {
            // calls the svelte 'app' with the target of the div to attach to
            let target = document.getElementById("dynamicSvelteApp");
            let props = { name: "universe" };
            app({ target, props });
        }
    </script>
</body>
```

3. Note the `props` property - this is also now outside of the bundling, so your server-rendered app can generate data for the svelte app to consume from markup (in case that is easier than having to build a js api for it to consume instead)

4. Run dev code, or rebuild and test your dev and mainrepo pages.
