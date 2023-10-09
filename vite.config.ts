import * as fs from "fs";
import * as path from "path";
import { defineConfig, Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { ViteMinifyPlugin } from "vite-plugin-minify";

const postBuild: Plugin = {
    name: "post-build",

    async closeBundle() {
        const filePath = path.join(__dirname, "dist", "index.html");
        const content = fs.readFileSync(filePath, "utf-8");

        fs.writeFileSync(filePath, content.replaceAll("\n", ""));
    },
};

export default defineConfig({
    plugins: [
        viteSingleFile({
            removeViteModuleLoader: true,
        }),
        ViteMinifyPlugin(),
        postBuild,
    ],

    build: {
        minify: "terser",
    },

    server: {
        port: 4000,
        strictPort: true,

        hmr: {
            port: 4000,
            protocol: "wss",
            clientPort: 443,
        },
    },
});
