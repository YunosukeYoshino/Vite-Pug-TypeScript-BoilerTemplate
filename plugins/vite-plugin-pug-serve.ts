import fs from "fs";
import { send } from "vite";
import type { ViteDevServer, Plugin } from "vite";
import { compileFile } from "pug";
import type { LocalsObject, Options } from "pug";

// 引数の型定義
type PugSettings = {
  options: Options;
  locals: LocalsObject;
};

const transformPugToHtml = (
  server: ViteDevServer,
  path: string,
  options: Options,
  locals: LocalsObject
) => {
  try {
    // options と locals を compileFile にセットする
    const compiled = compileFile(path, options)(locals);
    return server.transformIndexHtml(path, compiled);
  } catch (error) {
    console.log(error);
    return server.transformIndexHtml(path, "Pug Compile Error");
  }
};
// options と locals を引数として受け取る
export const vitePluginPugServe = ({
  options,
  locals,
}: PugSettings): Plugin => {
  return {
    name: "vite-plugin-pug-serve",
    enforce: "pre",
    apply: "serve",
    handleHotUpdate(context) {
      context.server.ws.send({
        type: "full-reload",
      });
      return [];
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const root = server.config.root;
        let fullReqPath = root + req.url;

        if (fullReqPath.endsWith("/")) {
          fullReqPath += "index.html";
        }

        if (fullReqPath.endsWith(".html")) {
          if (fs.existsSync(fullReqPath)) {
            return next();
          }

          const pugPath = `${
            fullReqPath.slice(0, Math.max(0, fullReqPath.lastIndexOf("."))) ||
            fullReqPath
          }.pug`;
          if (!fs.existsSync(pugPath)) {
            return send(req, res, "404 Not Found", "html", {});
          }

          // options と locals も渡す
          const html = await transformPugToHtml(
            server,
            pugPath,
            options,
            locals
          );
          return send(req, res, html, "html", {});
        } else {
          return next();
        }
      });
    },
  };
};
