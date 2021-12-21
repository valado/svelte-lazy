<script lang="ts">
  export let tag: string;
  export let url: string;
  export let isModule: boolean = false;

  type Hook = (tag: string) => Promise<void> | void;
  interface Notifier {
    resolve: () => void;
    reject: (error: any) => void;
  }

  let beforeLoadHook: Hook;
  let afterLoadHook: Hook;
  let customElementContainer: HTMLDivElement;

  const handleHook = (hook: Hook, tag: string): Promise<void> => {
    try {
      return Promise.resolve(hook(tag));
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const stripUrlProtocol = (url: string): string => {
    return url.replace(/https?:\/\//, "");
  };

  const hasElement = (url: string): boolean => {
    // TODO
    // return this.registry.has(stripUrlProtocol(url));
    return false;
  };

  const addElement = (url: string): Notifier => {
    let notifier: Notifier;
    /*
    this.registry.set(
      stripUrlProtocol(url),
      new Promise<void>((resolve, reject) => (notifier = { resolve, reject }))
    );
    */
    return notifier!;
  };

  const loadElement = async (
    url: string | null,
    tag: string,
    isModule?: boolean
  ): Promise<void> => {
    if (!tag) {
      throw new Error(
        `tag for '${url}' not found, the *axLazyElement has to be used on HTML element`
      );
    }

    if (!hasElement(url)) {
      const notifier = addElement(url);

      const script = document.createElement("script") as HTMLScriptElement;
      if (isModule) {
        script.type = "module";
      }
      script.src = url;
      const onLoad = () => {
        if (afterLoadHook) {
          handleHook(afterLoadHook, tag)
            .then(notifier.resolve)
            .catch(notifier.reject);
        } else {
          notifier.resolve();
        }

        cleanup();
      };
      const onError = (error: ErrorEvent) => {
        notifier.reject(error);
        cleanup();
        // Caretaker note: don't put it before the `reject` and `cleanup` since the user may have some
        // custom error handler that will re-throw the error through `throw error`. Hence the code won't
        // be executed, and the promise won't be rejected.
        this.errorHandler.handleError(error);
      };
      // The `load` and `error` event listeners capture `this`. That's why they have to be removed manually.
      // Otherwise, the `LazyElementsLoaderService` is not going to be GC'd.
      function cleanup() {
        script.removeEventListener("load", onLoad);
        script.removeEventListener("error", onError);
      }
      script.addEventListener("load", onLoad);
      script.addEventListener("error", onError);
      if (beforeLoadHook) {
        handleHook(beforeLoadHook, tag)
          .then(() => document.body.appendChild(script))
          .catch(notifier.reject);
      } else {
        document.body.appendChild(script);
      }
    }
    // return this.registry.get(this.stripUrlProtocol(url));
  };

  const addCustomTag = (tag: string) => {
    if (customElements.whenDefined(tag)) {
      const customElement = document.createElement(tag);
      customElementContainer.appendChild(customElement);
    }
  };

  $: loadElement(url, tag, isModule)
    .then((res) => {
      addCustomTag(tag);
    })
    .catch((err) => {
      console.log(err);
    });
</script>

<div bind:this={customElementContainer} />

<style>
</style>
