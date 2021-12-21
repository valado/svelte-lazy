<script lang="ts">
  import Counter from './lib/components/Counter.svelte';
  import WebComponentsLoader from './lib/components/WebComponentsLoader.svelte';

  export let title: string;
</script>

<main>
  <p>{title}</p>
  <Counter />
  <WebComponentsLoader
    tag={'wired-button'}
    url={'https://unpkg.com/wired-elements@1.0.0/dist/wired-elements.bundled.js'}
  />
</main>

<style>
</style>
