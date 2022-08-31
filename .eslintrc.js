module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
		"vue/setup-compiler-macros": true
	},
	extends: [
		"plugin:vue/vue3-recommended",
		"eslint:recommended",
		"@vue/typescript/recommended"
	],
	parserOptions: {
		ecmaVersion: "latest"
	},
	rules: {
		"no-console": process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		"no-debugger": process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		indent: ['warn', 'tab'],
		"vue/no-v-html": 'off',
		"vue/no-deprecated-slot-attribute": 'off',
		"@typescript-eslint/no-explicit-any": 'off',
		'vue/script-setup-uses-vars': 'error',
		"vue/html-indent": ['warn', 'tab', {
			"attribute": 1,
			"baseIndent": 1
		}],
		"semi": ['error', 'always'],
		"no-mixed-spaces-and-tabs": ['off']
	},
	overrides: [
		{
			files: [
				"cypress/e2e/**.{cy,spec}.{js,ts,jsx,tsx}"
			],
			extends: [
				"plugin:cypress/recommended"
			],
		},
	],
};
