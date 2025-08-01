// polyfills.ts (chỉ chạy trên client)
if (typeof window !== 'undefined' && typeof Promise.withResolvers !== 'function') {
  Promise.withResolvers = function<T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}