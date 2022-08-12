# Embedding svelte within an existing server-rendered app

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

The root of this repo pretends to be a server-rendered app. It has a basic webserver in it with html pages to demonstrate various ways of embedding svelte apps.

Install node (including npm) `https://nodejs.org/en/download/`.
Then run this command to start the webserver at http://127.0.0.1:12345

```
node www
```

## Step 2 - install svelte into a subfolder

Assuming you want to keep the Svelte source alongside your server-rendered-app source.

We won't follow instructions here: `https://svelte.dev/` as that installs svelte and vite which is not quite ready to use at end 2022.
Instead we'll just use Svelte and Rollup which is fine for simple svelte apps: https://github.com/sveltejs/template#svelte-app

1. run cmd.exe and `cd mainrepo` directory, or open VS Code and open the `mainrepo` folder and `Ctrl-~` to get to the command prompt Terminal
1. create a directory to hold each svelte app inside a general `svelteapps` directory
1. `cd svelteapps`
1. `npx degit sveltejs/template nnameofnewsvelteapp`
1. This should create the `nameofnewsvelteapp` directory inside `mainrepo/svelteapps`
1. `cd nameofnewsvelteapp`
1. `npm i` creates a `node_modules` folder and installs all the dependencies in there (dependecies are defined in the `package.json` and `package-lock.json`)
1. Development dirs like `node_modules` should already be .gitignore so ignore the same files if using another SCM before committing any changes
1. `npm run dev` to run dev mode, and visit the `http://localhost:XXXX` site which the terminal provides. It should show a default example Svelte app running independent of the example webserver for the mainrepo at `http://127.0.0.1:12345`
1. In dev mode you can now edit the top level svelte file `mainrepo/svelteapps/nameofnewsvelteapp/src/App.svelte` and the localhost page will hot-reload to show the changes immediately
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
         |_ .vscode
         |_ node_modules/
         |_ public/
         |_ src/
            |_ App.svelte
            |_ main.js
            ...
         |_ .gitignore
         |_ index.html
         |_ jsconfig.json
         |_ package-lock.json
         |_ package.json
         |_ README.md
         |_ vite.config.js
```

## Step 3 - default: embed the demo svelte app on page load into an 'app' div in your main app

Nothing fancy, just build the same demo svelte app for production and make it appear in a div in your server-based app...

1. `npm run build` creates a `mainrepo/src-svelte/dist/` folder containing a demo index.html, and built assets

```js
/*
|_ mainrepo/
   |  ...
   |_ src/
   |_ src-svelte/
      |_ .vscode
*/
      |_ dist/
         |_ assets/
            |_ index.xxxx.css
            |_ index.xxxx.js
            |_ svelte.xxxx.svg
         |_ index.html
         |_ vite.svg
/*
      |_ node_modules/
      ...
      |_ vite.config.js
*/
```

3. You could point your webserver at the `mainrepo/src-svelte/dist/` folder to see the same demo svelte app in production...
4. ...but we want to embed it into the existing server-rendered app
5. So copy the relevant built files into your main repo web root e.g. `mainrepo/www/assets-svelte/`

-   index.xxxx.css
-   index.xxxx.js
-   svelte.xxxx.svg

6. Then paste the two lines from the demo html page `mainrepo/src-svelte/dist/index.html` into the head of your main html page `mainrepo/www/index.html`

```html
<script type="module" crossorigin src="/assets-svelte/index.xxxx.js"></script>
<link rel="stylesheet" href="/assets-svelte/index.xxxx.css" />
```

7. And paste the target div into your main html page `mainrep/www/index.html` where you want the demo svelte app to appear. By default the svelte app bundle creates an app which immediately attaches to a div with id `app` on page load

```html
<div id="app"></div>
```

8. See next section if you want to have more control over when and where the svelte app appears

## Step 4 - advanced: embed the demo svelte app dynamically, with optional props (properties), and into divs with any id

The default way to embed a svelte app (called 'app') to appear in one div (also called 'app') on page load is usually fine.
But there are other scenarios where you might like more control, like:

-   you need different naming because it clashes with other js or divs called 'app'
-   you want multiple little bits of your app to embed svelte apps
-   you want to add a fancy svelte interface to appear dynamically only when you click a button
-   you want the same svelte app to appear dynamically in multiple places (e.g. a popup edit interface for each row in a 1000 row table)
-   you want to server-render a list of companies as json in your html markup, for svelte apps to consume as props when they load

### Step 4 a - embed the demo svelte app on page load, but at a different div id

1. Edit `mainrepo/src-svelte/src/main.js` and change the id from `"app"` to the required id

```js
import "./app.css";
import App from "./App.svelte";

const app = new App({
    target: document.getElementById("app"),
});

export default app;
```

2. Edit `mainrepo/src-svelte/index.html` to change the id here too to check it works in dev mode first `<div id="app"></div>`
3. Rebuild the svelte code and copy build files to mainrepo again, checking that `mainrepo/www/index.html` has the same id div to attach to

### Step 4 b - embed the demo svelte app dynamically, and at a different div id

1. Edit `mainrepo/src-svelte/src/main.js` to remove the target from the build process, so that you can define the target in your server-based app code instead

```js
import "./app.css";
import App from "./App.svelte";

/* remove...
const app = new App({
    target: document.getElementById("app"), // <-- just change this id as needed
});

export default app;
*/

export default function (target) {
    new App({ target });
}
```

2. Edit `mainrepo/src-svelte/index.html` with some jQuery or JavaScript to test in dev mode and trigger the load of the svelte app dynamically, e.g.

```html
<body>
    <!-- note: different id -->
    <div id="dynamicSvelteApp"></div>
    <script type="module" src="/src/main.js"></script>

    <!-- whatever trigger you want, e.g. a button -->
    <button id="button">attach svelte app to #dynamicSvelteApp div above</button>
    <script>
        let button = document.getElementById("button");
        button.addEventListener("click", attachSvelteApp);

        function attachSvelteApp() {
            // calls the svelte 'app' with the target of the div to attach to
            let target = document.getElementById("dynamicSvelteApp");
            app(target);
        }
    </script>
</body>
```

3. Rebuild the svelte code and copy build files to mainrepo again
4. Update your server-based app code in `mainrepo/index.html` with similar jQuery or JavaScript to trigger the load of the svelte app.
