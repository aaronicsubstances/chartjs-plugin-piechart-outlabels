import fs from 'fs';

import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

const pkg = JSON.parse(fs.readFileSync('./package.json'));

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.author.url}
 * (c) ${new Date().getFullYear()} ${pkg.author.name}
 * @license ${pkg.license}
 */`

export default [
	{
		input: './src/index.esm.ts',
		external: [
			'chart.js',
			'chart.js/helpers'
		],
		plugins: [
			resolve(), typescript()
		],
		output: {
			sourcemap: true,
			banner: banner,
			globals: {
				'chart.js': 'Chart',
				'chart.js/helpers': 'Chart.helpers'
			},
			file: pkg.module,
			format: 'esm'
		}
	},
	{
		input: './src/index.umd.ts',
		external: [
			'chart.js',
			'chart.js/helpers'
		],
		plugins: [
			resolve(), typescript()
		],
		output: [
			{
				sourcemap: true,
				banner: banner,
				globals: {
					'chart.js': 'Chart',
					'chart.js/helpers': 'Chart.helpers'
				},
				file: pkg.umd,
				format: 'umd'
			},
			{
				sourcemap: true,
				banner: banner,
				globals: {
					'chart.js': 'Chart',
					'chart.js/helpers': 'Chart.helpers'
				},
				file: pkg.unpkg,
				format: 'umd',
				plugins: [terser()]
			}
		]
	},
	{
		input: './src/index.esm.ts',
		external: [
			'chart.js',
			'chart.js/helpers'
		],
		plugins: [
			resolve(), typescript()
		],
		output: {
			sourcemap: true,
			banner: banner,
			globals: {
				'chart.js': 'Chart',
				'chart.js/helpers': 'Chart.helpers'
			},
			file: pkg.types,
			format: 'es',
		},
		plugins: [
			dts({
				respectExternal: true,
				compilerOptions: {
					skipLibCheck: true,
					skipDefaultLibCheck: true,
				},
			}),
		],
	},
]
