import { resolve } from "path";
import { defineConfig } from "vite";
import vitePluginPug from "./plugins/vite-plugin-pug";

export default defineConfig({
    root: "src",
    build: {
        emptyOutDir: true,//build時に空にする。
        outDir: resolve(__dirname, "dist"),
        rollupOptions: {
            input: {
                main: resolve(__dirname, "src", "index.pug"),
            },
        },
    },
    plugins: [
        // options と locals の設定例
        vitePluginPug({
            build: {
                locals: { hoge: "hoge" },
                options: { pretty: true },
            },
            serve: {
                locals: { hoge: "hoge" },
                options: { pretty: true },
            },
        }),
    ],
});
