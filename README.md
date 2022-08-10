# Getting svelte to work in an existing app

## Step 1 - start with your main repo

```js
|_ mainrepo/                // root of your main repo
   |_ www/                  // webroot - local webserver runs from here
   |  |_ index.html         // your main homepage
   |  |_ assets/            // some assets
   |     |_ images/
   |     ...
   |  |_ otherpages.html    // other pages etc
   |  ...
   |_ src/                  // maybe the src of your mainrepo
```

## Step 2 - install svelte and vite into a subfolder

Follow instructions here: `https://svelte.dev/` e.g.

1. run cmd.exe and `cd mainrepo` directory, or open VS Code and open the `mainrepo` folder and `Ctrl-~` to get to the command prompt Terminal
1. install node (including npm) `https://nodejs.org/en/download/`
1. `npm create vite@latest src-svelte -- --template svelte`
1. This should create the `src-svelte` directory inside mainrepo
1. `cd src-svelte`
1. `npm i` creates a `node_modules` folder and installs all the dependencies in there. It should already be .gitignore
1. `npm run dev` and visit the localhost:XXXX site which the terminal provides. It should show a default example Svelte/Vite app in development mode
1. In dev mode you can edit the `mainrepo/src-svelte/src/App.svelte` and the localhost will hot-reload to show the changes immediately during development mode
1. mainrepo now looks like this...

```js
/*
|_ mainrepo/
   |_ www/
   |  |_ index.html
   |  |_ assets/
   |     |_ images/
   |     ...
   |  |_ otherpages.html
   |  ...
   |_ src/
*/
   |_ src-svelte/
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

## Step 3.a - embed the demo svelte app on page load into an 'app' div in your main app

Nothing fancy, just build the same demo svelte app for production and make it appear in a div in your app...

1. `npm run build`
2. `/dist/` folder is created, containing a demo index.html, and built assets

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
4. ...but we want to embed it into the main app, so copy the relevant built files into e.g. an `assets-svelte/` folder in the root of the main repo

-   index.xxxx.css
-   index.xxxx.js
-   svelte.xxxx.svg

5. Then paste the two lines from the `dist/index.html` into the head of your `mainrepo/www/index.html`

```html
<script type="module" crossorigin src="/assets-svelte/index.xxxx.js"></script>
<link rel="stylesheet" href="/assets-svelte/index.xxxx.css" />
```

6. And paste the target div into your `mainrep/www/index.html` where you want the demo svelte app to appear. By default the svelte app bundle creates an app which immediately attaches to a div with id `app` on page load

```html
<div id="app"></div>
```

7. See next section if you want to have more control over when and where the svelte app appears

## Step 3.b - embed the demo svelte app dynamically, with optional props, and into a div with any id

Embedding a svelte app to appear in one div immediately is usually fine. But there are other scenarios where you might like more control, like:

-   you just want to make a LITTLE bit of your app reactive because most of it works fine being server-rendered
-   or you want multiple little bits of your app to be reactive
-   or you want to add a fancy interface to appear only when you click a button in one or multiple places based on the same svelte app
-   or be able to server-render a list of companies as json in your html markup, for the svelte app to consume when it starts
