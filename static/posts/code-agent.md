---
description: CodeAgent配置教程以及常见问题解决方案
date: '2026-06-30'
author: 'pxx'
categories:
  - Agent
published: true
---

# 内网环境下CodeAgent配置

> [LiteLLM - 入门指南 | liteLLM 网关](https://docs.litellm.com.cn/)
> [快速开始 | CLIProxyAPI](https://help.router-for.me/cn/introduction/quick-start.html)
> [CLI – Codex |OpenAI 开发者](https://developers.openai.com/codex/cli)
> [CLI 参考 - Claude Code Docs](https://code.claude.com/docs/zh-CN/cli-reference)

公司内网环境中，部门大模型服务对本地 IP 做了白名单限制，因此采用以下部署方式：

- LiteLLM 运行在本地机器
- Claude Code/Codex 运行在服务器端，用于实际代码编写
- Claude Code/Codex 通过本地 LiteLLM 代理访问内网大模型服务

整体链路：

```text
Claude Code/Codex Server
        ↓
本地 LLM Proxy
        ↓
内网大模型服务 / OpenAI Compatible API
```

## 1. LiteLLM 配置

安装

```bash
# 建议使用虚拟环境
python3 -m venv .venv
source .venv/bin/activate

# 安装 LiteLLM
pip install 'litellm[proxy]'

# 验证
litellm --version
```


文件示例：`config.yaml`

```yaml
model_list:
  - model_name: litellm
    litellm_params:
      model: <MODEL_PROVIDER>/<MODEL_NAME>
      api_base: http://<INTERNAL_MODEL_SERVICE_IP>:<PORT>/v1
      api_key: <INTERNAL_API_KEY>
      use_chat_completions_api: true

litellm_settings:
  set_verbose: false
  drop_params: true
  modify_params: true
  use_chat_completions_url_for_anthropic_messages: true
```

在本地启动 LiteLLM：

```bash
litellm --config config.yaml --port 4000
```

| 配置项                                            | 说明                                                 |
| ------------------------------------------------- | ---------------------------------------------------- |
| `model_name`                                      | Claude Code 中使用的模型名称                         |
| `model`                                           | LiteLLM 转发到后端的模型标识                         |
| `api_base`                                        | 内网模型服务地址，需脱敏                             |
| `api_key`                                         | 内网模型服务密钥，必须脱敏                           |
| `drop_params`                                     | 丢弃后端不支持的参数                                 |
| `modify_params`                                   | 自动适配请求参数                                     |
| `use_chat_completions_url_for_anthropic_messages` | 将 Anthropic Messages 请求转为 Chat Completions 接口 |

## 2. Claude Code 配置

```bash
# 需要 Node.js 18+
node -v
npm -v

# 全局安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 验证
claude --version
```


claude 的用户级配置文件默认位于：`~/.claude/settings.json`

```json
{
  "env": {
    "NO_PROXY": "localhost,127.0.0.1,<INTERNAL_MODEL_SERVICE_IP>,.example.internal",
    "DISABLE_TELEMETRY": "1",
    "DISABLE_ERROR_REPORTING": "1",
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:4000",
    "ANTHROPIC_AUTH_TOKEN": "<PROXY_PROXY_KEY>",
    "NODE_TLS_REJECT_UNAUTHORIZED": "0"
  },
  "model": "<MODEL_NAME>"
}
```

| 配置项                         | 说明                                  |
| ------------------------------ | ------------------------------------- |
| `ANTHROPIC_BASE_URL`           | 指向本地 LLM Proxy                    |
| `ANTHROPIC_AUTH_TOKEN`         | LiteLLM Proxy 认证 token              |
| `model`                        | 必须与 LiteLLM 中的 `model_name` 一致 |
| `NO_PROXY`                     | 内网地址需加入直连列表                |
| `DISABLE_TELEMETRY`            | 关闭遥测                              |
| `DISABLE_ERROR_REPORTING`      | 关闭错误上报                          |
| `NODE_TLS_REJECT_UNAUTHORIZED` | 内网证书场景下可关闭 TLS 校验         |

## 3. CLIProxyAPI配置

```yaml
host: "127.0.0.1"
port: 4000

api-keys:
  - "<PROXY_API_KEY>"

debug: true
request-retry: 1

openai-compatibility:
  - name: "123"
    base-url: "<INTERNAL_MODEL_SERVICE_IP>"
    api-key-entries:
      - api-key: "<INTERNAL_API_KEY>"
    models:
      - name: "<INTERNAL_MODEL_NAME>"
        alias: "glm"
```

启动

```bash
./cli-proxy-api --config ./config.yaml
nohup ~/.codex/cli-proxy-api -config ~/.codex/cliproxy-config.yaml > ~/.codex/proxy.log 2>&1 &
tail -f ~/proxy.log
```

## 4. Codex 配置

> [feat（responses）：明确处理Ram-Pavith · 聊天完成转换→响应中未受支持的内置工具类型 ·拉取请求 #27652 ·BerriAI/litellm](https://github.com/BerriAI/litellm/pull/27652)

推荐安装方式：

```bash
# macOS / Linux
curl -fsSL https://chatgpt.com/codex/install.sh | sh

# 验证
codex --version
```

也可通过 npm 安装：

```bash
npm install -g @openai/codex

codex --version
```


Codex 的用户级配置文件默认位于：`~/.codex/config.toml`

官方配置支持在 `config.toml` 中声明模型、模型供应商、`base_url` 和环境变量认证；也可以通过自定义 `model_providers` 接入代理或兼容 OpenAI 的服务

```toml
[model_providers.llm-local]
name = "Local Proxy"
base_url = "http://127.0.0.1:4000/v1"
env_key = "PROXY_API_KEY"
wire_api = "responses"
```

进入代码目录后运行：

```bash
$env:LITELLM_API_KEY = "sk-123"
cd /path/to/project
codex
codex resume # 选择历史对话 --last默认上一次对话
codex -m glm -c model_provider=llm-local
```

## 5. 代理测试

验证:

```bash
curl http://localhost:4000/health

curl "http://localhost:4000/v1/models" \
  -H "Authorization: Bearer <PROXY_PROXY_KEY>"
  
  
curl "http://localhost:4000/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <PROXY_PROXY_KEY>" \
  --data-raw '{
    "model": "<MODEL_NAME>",
    "messages": [
      {
        "role": "user",
        "content": "hello"
      }
    ]
  }'

# codex需要验证这个，目前已不支持chat/completion
curl "http://localhost:4000/v1/responses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <PROXY_PROXY_KEY>" \
  --data-raw '{
    "model": "<MODEL_NAME>",
    "input": "hello"
  }'
```

1. 配置不得保留真实 IP、API Key、Token、域名等敏感信息，使用环境变量。
2. ProxyLLM 必须部署在具备内网模型服务白名单权限的本地机器。
4. 内网环境建议关闭遥测和错误上报，避免外发请求。

## 6. 常见问题

### 6.1 Codex 提示 Missing environment variable

原因：`env_key` 写成了 token 值，而不是环境变量名。

错误示例：

```toml
env_key = "sk-xxxx"
```

正确示例：

```toml
env_key = "PROXY_CODEX_API_KEY"
```

并在 shell 中设置：

```bash
export PROXY_CODEX_API_KEY="<PROXY_CODEX_API_KEY>"
```

### 6.2 Codex 报 tools[].type illegal

原因通常是 Codex 的 Responses API tools 与后端 Chat Completions 支持的 tools schema 不一致。处理优先级：

1. 优先使用 CLIProxyAPI 的 Responses 兼容模式验证。
2. 若仍失败，在代理层过滤非标准 tools，仅保留后端支持的 function tools。
3. 若需要完整 Codex agent 能力，建议实现专用 Responses -> Chat Completions Adapter。

### 6.4 Claude Code 无法连接 LiteLLM

排查顺序：

```bash
curl http://127.0.0.1:4000/health
curl http://127.0.0.1:4000/v1/models -H "Authorization: Bearer <PROXY_CLAUDE_API_KEY>"
```

确认：

```text
ANTHROPIC_BASE_URL=http://127.0.0.1:4000
ANTHROPIC_AUTH_TOKEN=<PROXY_CLAUDE_API_KEY>
model=PROXY_CLAUDE_MODEL
```

注意不要误写成：

```
ANTHROPIC_API_KEY=<PROXY_CLAUDE_API_KEY>
```

在该代理模式下，Claude Code 需要通过 `ANTHROPIC_BASE_URL` 指向 本地LLM，并通过 `ANTHROPIC_AUTH_TOKEN` 传递代理认证 token。`ANTHROPIC_API_KEY` 容易触发默认 Anthropic API 鉴权路径，导致没有正确走本地 LLM Proxy。