export default function sleep(callbackFn, ms) {
  return new Promise((resolve) =>
    setTimeout(() => {
      callbackFn();
      resolve();
    }, ms)
  );
}
