# explorer-besu-plugin

![Build](https://github.com/adetante/explorer-besu-plugin/workflows/Build/badge.svg)

[Alethio Explorer](https://github.com/Alethio/ethereum-lite-explorer) plugin that provides support for Hyperledger Besu authentication.

[Hyperledger Besu supports authentication on JSON-RPC endpoint](https://besu.hyperledger.org/en/stable/HowTo/Interact/APIs/Authentication/) using a Bearer token in the `Authorization` header of JSON-RPC requests.

This plugin overrides the eth-lite `Web3DataSource` to handle Besu authentication and inject the authentication header.

Username and password are kept in memory to refresh the token every 4 minutes (Besu tokens expire after 5 minutes).

## Installation instruction

See [Alethio Lite Explorer documentation](https://github.com/Alethio/ethereum-lite-explorer/blob/master/README.md) for the complete build procedure.

The main steps are:
```
# Clone ethereum-lite-explorer master branch
git clone git@github.com:Alethio/ethereum-lite-explorer.git
# Build
npm install
npm run build
# Install plugins
npm i -g @alethio/cms-plugin-tool
acp install \
    @alethio/explorer-plugin-eth-common \
    @alethio/explorer-plugin-eth-lite \
    @alethio/explorer-plugin-3box \
    @adetante/explorer-besu-plugin
# Copy/edit config.json to dist/ directory (see next section)
```

## Configuration

> :warning: **As eth-lite plugin requires the authentication data adapter to be available during initialization, this plugin must be loaded BEFORE `plugin://aleth.io/eth-lite` in the plugins configuration.**

In `config.json`, add the following plugin definition:
```
"plugins": [
    ...
    {
        "uri": "plugin://adetante/besu?v=1.0.3",
        "config": {
            "loginUrl": "https://my_besu_node/login"
        }
    }
    ...
]
```


* `loginUrl` is the login endpoint.
 When using [Besu default username/password authentication](https://besu.hyperledger.org/en/stable/HowTo/Interact/APIs/Authentication/#username-and-password-authentication), this URL is the JSON-RPC HTTP url with `/login` suffix.
 If you use [Besu JWT public key authentication](https://besu.hyperledger.org/en/stable/HowTo/Interact/APIs/Authentication/#jwt-public-key-authentication), this URL can point to your own token distribution endpoint. Your login endpoint must accept `POST` requests with body `{ "username": "xxx", "password": "xxx" }` and return a JSON response with `{ "token": "xxx" }`

Update the `plugin://aleth.io/eth-lite` configuration with the link to the new data adapter:
```
"plugins": [
    ...,
    {
        "uri": "plugin://aleth.io/eth-lite?v=4.2.0",
        "config": {
            "nodeUrl": "https://my_besu_node",
            "authStoreUri": "adapter://adetante/besu/auth-store"
        }
    },
    ...
]
```

* Add the `authStoreUri` attribute to the eth-lite configuration with the value `adapter://adetante/besu/auth-store` to link eth-lite to this plugin

## Required Besu permissions

The minimum [JSON-RPC permissions](https://besu.hyperledger.org/en/stable/HowTo/Interact/APIs/Authentication/#json-rpc-permissions) required to use Alethio Explorer are:

```
permissions = [
    "eth:getBlockByHash",
    "eth:getBlockByNumber",
    "eth:getBlockTransactionCountByHash",
    "eth:getBlockTransactionCountByNumber",
    "eth:blockNumber",
    "eth:getTransactionByHash",
    "eth:getTransactionReceipt",
    "eth:getBalance",
    "eth:getCode",
    "eth:getUncleByBlockHashAndIndex",
    "eth:getUncleByBlockNumberAndIndex",
    "net:peerCount"
]
```

To be defined in the Besu `toml` credentials file.

## Running in Docker

A Docker image based on [ethereum-lite-explorer](https://hub.docker.com/r/alethio/ethereum-lite-explorer) is available on [Docker Hub](https://hub.docker.com/r/adetante/explorer-besu-plugin).

Just run

```
$ docker run -e APP_NODE_URL="https://my_besu_node" -p 80:80 adetante/explorer-besu-plugin:1.0.3
```

with the environment variable `APP_NODE_URL` referring to the JSON-RPC endpoint of Besu node.

This image uses the default `config.json` file, and sets `${APP_NODE_URL}` as `nodeUrl` for `eth-lite` plugin and `${APP_NODE_URL}/login` as `loginUrl` for Besu plugin. You can override `config.json` by mounting a custom configuration file in `/usr/share/nginx/html/config.json` (see [Alethio Explorer: Running in Docker](https://github.com/Alethio/ethereum-lite-explorer#running-in-docker))
