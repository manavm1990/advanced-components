let target, total, salePrice;

class Dep {
  constructor() {
    // Instantiate a 'storage' Array for 'stored procedures'
    this.subscribers = [];
  }

  // Build a list of 'observers'
  depend() {
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target);
    }
  }

  notify() {
    // Replaces our replay function
    this.subscribers.forEach(subscriber => {
      subscriber();
    });
  }
}

// Each property will be it's own instance of 'Dep.'
let data = (() => ({
  price: 5,
  quantity: 2
}))();

Object.keys(data).forEach(key => {
  const dep = new Dep();

  let internalValue = data[key];

  Object.defineProperty(data, key, {
    // For just the price property

    get() {
      dep.depend();
      return internalValue;
    },

    set(newVal) {
      internalValue = newVal;
      // Create a set method
      dep.notify();
    }
  });
});

let watcher = fxn => {
  target = fxn;
  target();
  target = null;
};

watcher(() => {
  total = data.price * data.quantity;
});

watcher(() => {
  salePrice = data.price * 0.9;
});
