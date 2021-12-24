<script lang="ts">
  import Counter from './lib/components/Counter.svelte';
  import WebComponentsLazy from './lib/components/WebComponentsLazy.svelte';
  import type { Hook } from './lib/CustomElementLoader';

  export let title: string;
  let beforeLoadHook: Hook = (tag: string) => {
    console.log('beforeLoadHook: ' + tag);
  };
  let afterLoadHook: Hook = (tag: string) => {
    console.log('afterLoadHook: ' + tag);
  };
  interface DynamicWebcomponent {
    tag: string;
    url: string;
    module?: boolean;
    content?: string;
    onClick?: () => void;
  }
  const components: DynamicWebcomponent[] = [
    {
      tag: 'wired-button',
      url: 'https://unpkg.com/wired-elements@1.0.0/dist/wired-elements.bundled.js',
      content: 'Toogle order',
      onClick: () => {
        console.log('toggle clicked');
        components.reverse();
      },
    },
    {
      tag: 'mwc-switch',
      url: 'https://unpkg.com/@material/mwc-switch@0.18.0/mwc-switch.js?module',
      module: true,
    },
  ];
</script>

<main>
  <p>{title}</p>
  <Counter />
  {#each components as item, index}
    <div class="item-margin">
      <WebComponentsLazy
        tag={item.tag}
        url={item.url}
        {beforeLoadHook}
        {afterLoadHook}
        isModule={item.module}
      >
        <div slot="content" on:click={item.onClick}>
          {#if item.content}
            {item.content}
          {/if}
        </div>
        <div slot="loading">Loading ...</div>
        <div slot="error">Error loading {index}</div>
      </WebComponentsLazy>
    </div>
  {/each}
</main>

<style>
  .item-margin {
    margin: 20px;
  }
</style>
