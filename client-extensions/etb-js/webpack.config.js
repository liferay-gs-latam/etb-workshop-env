import path from "path";
import { fileURLToPath } from 'url';
import webpack from 'webpack';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    mode: 'production',
    entry: './src/index.js',
    resolve: {
        extensions: [".js"]
    },
    output: {
        path: path.resolve("build/assets"),
        filename: '[name].bundle.js',
        clean: true,
    },
    plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1,
		}),
	],
}
