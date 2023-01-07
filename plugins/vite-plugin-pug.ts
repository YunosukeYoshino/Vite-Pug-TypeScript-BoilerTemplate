import type { LocalsObject, Options } from "pug";
import { vitePluginPugBuild } from "./vite-plugin-pug-build";
import { vitePluginPugServe } from "./vite-plugin-pug-serve";

// 引数の型定義
type PugSettings = {
  options: Options;
  locals: LocalsObject;
};
//　オプショナルな引数として、options　と　locals　を受け取る
const vitePluginPug = (settings?: {
  build?: Partial<PugSettings>;
  serve?: Partial<PugSettings>;
}) => {
  // build用の options と locals
  const buildSettings = {
    options: { ...settings?.build?.options },
    locals: { ...settings?.build?.locals },
  };
  // serve用の options と locals
  const serveSettings = {
    options: { ...settings?.serve?.options },
    locals: { ...settings?.serve?.locals },
  };

  // それぞれ引数として渡す
  return [
    vitePluginPugBuild({
      options: buildSettings.options,
      locals: buildSettings.locals,
    }),
    vitePluginPugServe({
      options: serveSettings.options,
      locals: serveSettings.locals,
    }),
  ];
};

export default vitePluginPug;
