<script lang="ts">
  import {
    DefaultLazyElementRegistry,
    LazyCustomElementRegistry,
  } from '../Registry';
  import { loadElement, addCustomTag, Hook } from '../CustomElementLoader';
  export let tag: string;
  export let url: string;
  export let isModule: boolean | undefined = false;
  export let beforeLoadHook: Hook | undefined = undefined;
  export let afterLoadHook: Hook | undefined = undefined;
  export let customLazyElementRegistry: LazyCustomElementRegistry | undefined =
    DefaultLazyElementRegistry;

  let customElementContainer: HTMLDivElement;
  let customElementContent: HTMLDivElement;
  let loading = true;
  let error = false;

  $: loadElement(
    customLazyElementRegistry,
    url,
    tag,
    isModule,
    beforeLoadHook,
    afterLoadHook
  )
    .then(() => {
      loading = false;
      addCustomTag(customElementContainer, customElementContent, tag);
    })
    .catch((err) => {
      console.log(err);
      loading = false;
      error = true;
    });
</script>

{#if loading}
  <slot name="loading" />
{/if}
{#if error}
  <slot name="error" />
{/if}
{#if !loading && !error}
  <div bind:this={customElementContainer}>
    <div bind:this={customElementContent}>
      <slot name="content" />
    </div>
  </div>
{/if}

<style>
</style>
