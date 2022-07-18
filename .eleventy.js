module.exports = (config) => {
	config.addPassthroughCopy({ './src/scripts.js': './scripts.js' });
	config.addPassthroughCopy('./src/assets/');

	return {
		dir: {
			input: 'src',
			output: '_dist',
		},
	};
};
