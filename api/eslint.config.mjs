import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";

export default [
	{
		languageOptions: {
			globals: {
				es2021: "readonly",
				node: "readonly",
			},
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
			},
			parser: typescriptEslintParser,
		},
		plugins: {
			"@typescript-eslint": typescriptEslintPlugin,
		},
		rules: {
			"indent": ["error", "tab"],
			"quotes": ["error", "double"],
			"semi": ["error", "always"],
		},
	},
	{
		files: ["*.ts", "*.tsx"],
		languageOptions: {
			parser: typescriptEslintParser,
		},
		rules: {
		},
	},
];
