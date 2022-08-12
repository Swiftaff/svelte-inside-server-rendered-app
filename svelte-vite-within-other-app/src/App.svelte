<script>
    export let name;
    let counter = 0;
    let incr = () => counter++;
</script>

<main>
    <h1>Hello {name}!</h1>
    <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
    <div on:click={incr}>Counter:{counter}</div>
</main>

<style>
    div {
        user-select: none;
        cursor: pointer;
        background-color: pink;
        width: 100px;
        height: 40px;
        padding-top: 15px;
        margin-left: calc((100% - 100px) / 2);
        border-radius: 5px;
    }
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
