(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('crypto')) :
	typeof define === 'function' && define.amd ? define(['crypto'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.create = global.create || {}, global.create.uid = factory(global.crypto)));
})(this, (function (crypto) { 'use strict';

	function getAugmentedNamespace(n) {
	  var f = n.default;
		if (typeof f == "function") {
			var a = function () {
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	const urlAlphabet =
	  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

	const POOL_SIZE_MULTIPLIER = 128;
	let pool, poolOffset;
	let fillPool = bytes => {
	  if (!pool || pool.length < bytes) {
	    pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
	    crypto.randomFillSync(pool);
	    poolOffset = 0;
	  } else if (poolOffset + bytes > pool.length) {
	    crypto.randomFillSync(pool);
	    poolOffset = 0;
	  }
	  poolOffset += bytes;
	};
	let random = bytes => {
	  fillPool((bytes -= 0));
	  return pool.subarray(poolOffset - bytes, poolOffset)
	};
	let customRandom = (alphabet, defaultSize, getRandom) => {
	  let mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1;
	  let step = Math.ceil((1.6 * mask * defaultSize) / alphabet.length);
	  return (size = defaultSize) => {
	    let id = '';
	    while (true) {
	      let bytes = getRandom(step);
	      let i = step;
	      while (i--) {
	        id += alphabet[bytes[i] & mask] || '';
	        if (id.length === size) return id
	      }
	    }
	  }
	};
	let customAlphabet$1 = (alphabet, size = 21) =>
	  customRandom(alphabet, size, random);
	let nanoid = (size = 21) => {
	  fillPool((size -= 0));
	  let id = '';
	  for (let i = poolOffset - size; i < poolOffset; i++) {
	    id += urlAlphabet[pool[i] & 63];
	  }
	  return id
	};

	var nanoid$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		urlAlphabet: urlAlphabet,
		random: random,
		customRandom: customRandom,
		customAlphabet: customAlphabet$1,
		nanoid: nanoid
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(nanoid$1);

	const { customAlphabet } = require$$0;
	function createUid() {
	    const nanoid = customAlphabet("1234567890abcdef", 16);
	    return nanoid();
	}
	var create_uid = createUid;

	return create_uid;

}));
