export interface Notifier {
  resolve: () => void;
  reject: (error: any) => void;
}

export interface LazyCustomElementRegistry {
  hasElement: (url: string) => boolean;
  addElement: (url: string) => Notifier;
  getElementPromise: (url: string) => Promise<void>;
}

let registry = {};

const stripUrlProtocol = (url: string): string => {
  return url.replace(/https?:\/\//, '');
};

const hasElement = (url: string): boolean => {
  return registry.hasOwnProperty(stripUrlProtocol(url));
};

const addElement = (url: string): Notifier => {
  let notifier: Notifier;
  const promise = new Promise<void>(
    (resolve, reject) => (notifier = { resolve, reject })
  );
  registry = Object.assign({}, registry, { [stripUrlProtocol(url)]: promise });
  return notifier!;
};

const getElementPromise = (url: string): Promise<void> => {
  return registry[stripUrlProtocol(url)];
};

export const DefaultLazyElementRegistry: LazyCustomElementRegistry = {
  hasElement,
  addElement,
  getElementPromise,
};
