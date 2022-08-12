<script>
    export let name;
    let counter = 0;
    const incr = () => counter++;
</script>

<main>
    <div class="table">
        <table>
            <tr>
                <td><a href="/">Default</a> |</td>
                <td><a href="/specific_id.html">Specific ID</a> |</td>
                <td><a href="/dynamic_attach.html">Dynamic Attach</a></td>
            </tr>
        </table>
    </div>
    <h1>Hello {name}!</h1>
    <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
    <button on:click={incr}>Counter increment: {counter}</button>
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    .table {
        width: 300px;
        text-align: center;
        padding-left: calc(50% - 150px);
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
