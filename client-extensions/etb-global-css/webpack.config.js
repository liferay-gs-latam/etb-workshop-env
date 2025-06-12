import path from "path";
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import webpack from 'webpack';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    mode: 'production',
    entry: './src/index.scss',
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ],
            },
        ],
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
        new MiniCssExtractPlugin({
            filename: 'main.bundle.css',
        }),
    ],
}
