#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

if (process.argv.length < 4) {
    process.stdout.write(`Usage: set-env-vars.js <config_in_json_path> <config_out_json_path>`);
    process.exit(1);
}
const [,, inFile, outFile] = process.argv;

let defaultConfig = JSON.parse(fs.readFileSync(path.resolve(inFile), "utf-8"));

if (process.env.APP_NODE_URL) {
    let pluginConfigs = defaultConfig["plugins"];

    let litePluginConfig = pluginConfigs.find(plugin => plugin.uri.match(/^plugin:\/\/aleth.io\/eth-lite/)).config;
    litePluginConfig["nodeUrl"] = process.env.APP_NODE_URL;

    let besuPluginConfig = pluginConfigs.find(plugin => plugin.uri.match(/^plugin:\/\/adetante\/besu/)).config;
    besuPluginConfig["loginUrl"] = `${process.env.APP_NODE_URL}/login`;
}

fs.writeFileSync(path.resolve(outFile), JSON.stringify(defaultConfig, undefined, "\t"));
