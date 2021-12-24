import type { LazyCustomElementRegistry } from './Registry';
export type Hook = (tag: string) => Promise<void> | void;

export const handleHook = (hook: Hook, tag: string): Promise<void> => {
  try {
    return Promise.resolve(hook(tag));
  } catch (err) {
    return Promise.reject(err);
  }
};

export const loadElement = async (
  lazyElementRegistry: LazyCustomElementRegistry,
  url: string | null,
  tag: string,
  isModule?: boolean,
  beforeLoadHook?: Hook,
  afterLoadHook?: Hook
): Promise<void> => {
  if (!tag) {
    throw new Error(`tag for '${url}' not found`);
  }

  if (!lazyElementRegistry.hasElement(url)) {
    const notifier = lazyElementRegistry.addElement(url);

    const script = document.createElement('script') as HTMLScriptElement;
    if (isModule) {
      script.type = 'module';
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
    };
    function cleanup() {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
    }
    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);
    const attachScript = () => {
      document.body.appendChild(script);
    };
    if (beforeLoadHook) {
      handleHook(beforeLoadHook, tag).then(attachScript).catch(notifier.reject);
    } else {
      attachScript();
    }
  }
  return lazyElementRegistry.getElementPromise(url);
};

export const addCustomTag = (
  elContainer: HTMLDivElement,
  content: HTMLDivElement,
  tag: string
) => {
  if (elContainer && customElements.whenDefined(tag)) {
    const customElement = document.createElement(tag);
    customElement.append(content);
    elContainer.replaceChildren(customElement);
  }
};
