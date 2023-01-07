import fs from "fs";
import type { Plugin } from "vite";
import { compileFile } from "pug";
import type { LocalsObject, Options } from "pug";

// 引数の型定義
type PugSettings = {
  options: Options;
  locals: LocalsObject;
};
// options と locals を引数として受け取る
export const vitePluginPugBuild = ({
  options,
  locals,
}: PugSettings): Plugin => {
  const pathMap: Record<string, string> = {};
  return {
    name: "vite-plugin-pug-build",
    enforce: "pre",
    apply: "build",
    resolveId(source: string) {
      if (source.endsWith(".pug")) {
        const dummy = `${
          source.slice(0, Math.max(0, source.lastIndexOf("."))) || source
        }.html`;
        pathMap[dummy] = source;
        return dummy;
      }
    },
    load(id: string) {
      if (id.endsWith(".html")) {
        if (pathMap[id]) {
          // options locals を compileFile にセットする
          const html = compileFile(pathMap[id], options)(locals);
          return html;
        }
        return fs.readFileSync(id, "utf-8");
      }
    },
  };
};
