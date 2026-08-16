const { test } = require("node:test");
const assert = require("node:assert");
const suma = require("./suma");

test("Suma 1 + 2 es igual a 3", () => {
  assert.strictEqual(suma(1, 2), 3);
});

