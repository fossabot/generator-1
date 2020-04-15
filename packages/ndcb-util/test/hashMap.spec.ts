import { hashMap } from "../src/hashMap";

describe("hashMap", () => {
	for (const {
		entries,
		hash,
		equals,
		has,
		get,
	} of require("./fixtures/hashMap")) {
		const map = hashMap(entries, hash, equals);
		describe("has", () => {
			for (const { key, expected } of has || []) {
				test(
					expected
						? "return `true` if the key is in the map"
						: "returns `false` if the key is not in the map",
					() => {
						expect(map.has(key)).toEqual(expected);
					},
				);
			}
		});
		describe("get", () => {
			for (const { key, otherwise, expected } of get || []) {
				test(
					expected !== null
						? "returns the value with the associated key"
						: "returns `null` if there is no value associated with the key",
					() => {
						expect(map.get(key, otherwise)).toEqual(expected);
					},
				);
			}
		});
	}
});
