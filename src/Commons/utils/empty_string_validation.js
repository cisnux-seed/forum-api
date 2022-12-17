/* eslint-disable no-extend-native */
Object.defineProperty(String.prototype, 'isEmpty', {
  enumerable: false,
  get() {
    return this.trim().length === 0;
  },
});
