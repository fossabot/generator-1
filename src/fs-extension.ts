export interface Extension {
	readonly _tag: "Extension";
	readonly value: string;
}

export const extension = (value: string): Extension => ({
	_tag: "Extension",
	value,
});

export const extensionToString = (extension: Extension): string =>
	extension.value;

export const extensionEquals = (e1: Extension, e2: Extension): boolean =>
	extensionToString(e1) === extensionToString(e2);
