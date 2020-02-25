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

let data = (() => ({
  price: 5,
  quantity: 2
}))();

// Should have separate 'Dep' instance for each property else all fxns. will run each time. 🙅🏽‍♂️
const deps = {};

Object.keys(data).forEach(key => {
  deps[key] = new Dep();
});

const observedData = new Proxy(data, {
  get(obj, key) {
    deps[key].depend();
    return obj[key];
  },
  set(obj, key, newValue) {
    obj[key] = newValue;
    deps[key].notify();
  }
});

let watcher = fxn => {
  target = fxn;
  target();
  target = null;
};

watcher(() => {
  total = observedData.price * observedData.quantity;
});

watcher(() => {
  salePrice = observedData.price * 0.9;
});
