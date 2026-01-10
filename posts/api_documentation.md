---
description: 魔改openai api协议说明
date: '2025-11-04'
author: 'pxx'
categories:
  - LLM
  - RAG
published: false
---



# API 使用说明文档

## 概述

本 API 完全兼容 OpenAI Chat Completions 协议，可直接使用 OpenAI SDK 进行调用。在此基础上，我们扩展了以下功能：

- **智能知识库检索**：支持 RAG/KAG 多模态文档问答
- **图像理解能力**：自动 OCR 识别并理解图片内容
- **工具调用能力**：集成 MCP 协议，支持多轮自主工具调用

**兼容性说明**：您可以直接使用现有的 OpenAI SDK 代码，只需修改 `base_url` 和 `api_key` 即可无缝迁移。



**Base URL**：`http://<your-host>/v1`

**主要接口**：

- `POST /v1/chat/completions` —— 兼容 OpenAI ChatCompletions，扩展多轮思考、RAG/KAG、MCP、图像识别
- `POST /v1/mcp/connect` —— 连接 MCP 工具服务器
- `GET  /v1/mcp/tools` —— 查看已加载的 MCP 工具列表

**鉴权方式**：`Authorization: Bearer <API_KEY>`

## 快速开始

**基础对话**

更多详情请查看 [Chat Completions | OpenAI API Reference](https://platform.openai.com/docs/api-reference/chat/create)

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://your-domain:port/v1",
    api_key="YOUR_API_KEY"
)

# 标准调用（完全兼容 OpenAI）
response = client.chat.completions.create(
    model="your-model-name",
    messages=[{"role": "user", "content": "Hello"}]
)
```

**认证方式**

使用标准的 Bearer Token 认证：

```http
Authorization: Bearer YOUR_API_KEY
```

## 扩展功能详解

### 1. 知识库检索（RAG/KAG）

#### 功能说明

通过 `extra.file_search` 字段启用知识库检索，系统会自动：
- 识别项目类型（RAG 或 KAG）
- 将相关文档注入对话上下文
- 基于增强后的上下文生成回答

#### 参数配置

```json
{
  "model": "your-model-name",
  "messages": [
    {"role": "user", "content": "请分析公司Q3季度的销售数据"}
  ],
  "extra": {
    "file_search": {
      "vector_store_ids": ["project-id-1", "project-id-2"],
      "max_num_results": 5
    }
  }
}
```

| 参数 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `vector_store_ids` | array | 知识库项目 ID 列表，支持多项目联合检索 | **必填** |
| `max_num_results` | integer | 返回的最大文档数 | RAG: 5<br>KAG: 20 |

#### RAG 与 KAG 的区别

**RAG 模式**（传统向量检索）：
- 检索接口：`POST /query/query`
- 返回结果：相似度排序的文档片段
- 适用场景：通用文档问答、知识查询

**KAG 模式**（知识增强图谱检索）：

- 检索接口：`POST /kag/reasoning_context`
- 返回结果：包含文档片段、知识图谱关系、推理过程
- 适用场景：复杂推理、多跳问答、关系分析

系统会根据项目配置（`grag_enable` 字段）自动选择检索模式。

#### 流式响应中的检索结果

在 `stream: true` 模式下，检索到的文档会优先以特殊格式返回：

```json
{
  "id": "chatcmpl-abc123",
  "choices": [{
    "index": 0,
    "delta": {
      "role": "file_search",
      "annotations": [{
        "id": "chunk-123",
        "filename": "财务报表.pdf (ID: file-456)",
        "content": "Q3季度营收增长15%..."
      }]
    },
    "finish_reason": null
  }]
}
```

#### KAG 检索结果结构

KAG 模式会返回三类信息：

1. **文档片段**（chunks）
   
   ```json
   {
     "id": "chunk-123",
     "filename": "报告.pdf (ID: file-456)",
     "content": "原始文档内容..."
   }
   ```
   
2. **知识图谱**（graph）
   ```json
   {
     "id": "graph_0",
     "filename": "知识图谱",
     "content": "**相关实体：**\n- 销售额\n- Q3季度\n\n**知识关系：**\n- 销售额 → 增长 → 15%"
   }
   ```

3. **推理过程**（memory）
   ```json
   {
     "id": "memory_0",
     "filename": "推理过程 (GraphRAGExecutor)",
     "content": "基于知识图谱分析，Q3季度的核心数据包括..."
   }
   ```

#### Python 示例

```python
from openai import OpenAI

client = OpenAI(base_url=f"<server_url>/v1", api_key="<api-key>")

# 多项目联合检索
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "对比技术文档和财务数据"}
    ],
    extra={
        "file_search": {
            "vector_store_ids": ["tech-docs", "finance-docs"],
            "max_num_results": 10
        }
    },
    stream=True  # 流式查看检索过程
)

for chunk in response:
    delta = chunk.choices[0].delta
    if getattr(delta, "reasoning_content", None):
        print(delta.reasoning_content, end="", flush=True)
        reasoning_text += delta.reasoning_content
    if getattr(delta, "role", None) == "file_search":
        annotations = getattr(delta, "annotations", [])
        if annotations:
            print("\n📄 RAG 查询结果：", flush=True)
            for i, ann in enumerate(annotations, start=1):
                doc_id = ann.get("id", "")
                filename = ann.get("filename", "")
                print(f"  {i}. 文档ID: {doc_id}", flush=True)
                print(f"     文件名: {filename}", flush=True)
                # 仅显示内容前 100 个字符作为预览
                preview = ann.get("content", "")
                preview = preview.replace("\n", " ")[:100]
                print(f"     内容预览: {preview}...", flush=True)
                print("  ──────────────────────────────", flush=True)
    elif delta.content:
        print(delta.content, end="", flush=True)
```

#### 非流式响应中的 Trace

在非流式模式下，完整的检索过程会记录在响应的 `trace` 字段中：

```json
{
  "id": "chatcmpl-abc123",
  "choices": [...],
  "trace": [
    {
      "type": "rag_context",
      "docs": [
        {
          "id": "chunk-123",
          "filename": "报告.pdf",
          "content": "文档内容..."
        }
      ]
    },
    {
      "type": "assistant",
      "step": 0,
      "message": {...}
    }
  ]
}
```

```python
from openai import OpenAI

client = OpenAI(base_url=f"<server_url>/v1", api_key="<api-key>")

# RAG 检索示例
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "总结公司财报的核心内容"}
    ],
    extra={
        "file_search": {
            "vector_store_ids": ["finance-docs"],
            "max_num_results": 5
        }
    }
)

msg = response.choices[0].message
if hasattr(response, "trace"):
    for step in response.trace:
        if step["type"] == "rag_context":
            for doc in step["docs"]:
                print(f"📄 {doc['filename']}: {doc['content'][:200]}...")
print(msg.reasoning_content if hasattr(msg, "trace") else "")
print(msg.content)
```



### 2. 图像识别（OCR）

参考 [How to use vision-enabled chat models - Azure OpenAI in Microsoft Foundry Models | Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/gpt-with-vision?view=foundry-classic&utm_source=chatgpt.com&tabs=rest)

#### 功能说明

支持在消息中直接包含图片，系统会：
1. 自动提取所有 `image_url` 类型的内容
2. 调用 OCR 服务（`/api/ocr`）进行文字识别
3. 将识别结果作为系统消息注入对话
4. 模型基于图片文字内容进行理解和推理

#### 使用方法

```python
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "请分析这张图片中的文字并总结要点"
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "data:image/png;base64,iVBORw0KGgo..."
                    }
                }
            ]
        }
    ]
)
```

#### 图片格式要求

- **格式支持**：PNG、JPEG、GIF 等常见格式
- **编码方式**：仅支持 Data URL 格式（`data:image/*;base64,...`）
- **推荐尺寸**：1024px 以内（自动压缩）

#### OCR 配置参数

OCR 服务使用以下默认配置：
- `mode`: `describe`（描述模式）
- `base_size`: `1024`（基础尺寸）
- `image_size`: `640`（图像尺寸）
- `crop_mode`: `true`（裁剪模式）

#### 处理流程

```
用户请求 → 提取图片 → 调用 OCR API → 注入识别结果 → 模型推理
```

识别结果会以如下格式注入：

```json
{
  "role": "system",
  "content": "[Image 1 OCR]: 这是识别到的文字内容...\n[Image 2 OCR]: 第二张图片的内容..."
}
```

#### 多图片处理

```python
from openai import OpenAI

client = OpenAI(base_url=f"<server_url>/v1", api_key="<api-key>")

IMG_PATH = "./test.jpg"

# Function to encode a local image into data URL
def local_image_to_data_url(image_path):
    # Guess the MIME type of the image based on the file extension
    mime_type, _ = guess_type(image_path)
    if mime_type is None:
        mime_type = 'application/octet-stream'  # Default MIME type if none is found

    # Read and encode the image file
    with open(image_path, "rb") as image_file:
        base64_encoded_data = base64.b64encode(image_file.read()).decode('utf-8')

    # Construct the data URL
    return f"data:{mime_type};base64,{base64_encoded_data}"

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "对比这两张报表的差异"},
                {"type": "image_url", "image_url": {"url": local_image_to_data_url(img_path)}},
            ]
        }
    ]
)

msg = response.choices[0].message
print(msg.content)
```

#### 错误处理

如果 OCR 处理失败，会返回错误信息：

```
[Image 1 OCR Failed]: Request timed out. The server may be taking too long to respond.
```

模型会继续执行，但无法获取该图片的文字内容。

### 3. MCP 工具调用

#### 功能说明

集成 MCP (Model Context Protocol)，支持模型自主调用外部工具。系统会：
- 自动识别模型的工具调用需求
- 执行工具并获取结果
- 将结果反馈给模型继续推理
- 支持最多 10 轮迭代调用

#### 连接 MCP 服务器

```bash
# 连接 MCP 服务器
curl -X POST http://your-domain:port/v1/mcp/connect \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://mcp-server:8080/sse"
  }'

# 响应
{
  "status": "ok",
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "search_documents",
        "description": "搜索文档库",
        "parameters": {...}
      }
    }
  ]
}
```

#### 查询可用工具

```bash
curl http://your-domain:port/v1/mcp/tools

# 响应
{
  "tools": [...]
}
```

#### 工具调用流程

```
用户请求 → 模型决策 → 调用工具 → 获取结果 → 继续推理 → 重复或结束
```

最多支持 10 轮迭代，超过后返回错误：
```json
{
  "detail": "Reached max tool call iterations"
}
```

#### 流式响应中的工具调用

```json
// 1. 模型发起工具调用
{
  "choices": [{
    "delta": {
      "tool_calls": [{
        "index": 0,
        "id": "call_abc123",
        "function": {
          "name": "search_documents",
          "arguments": "{\"query\":\"财报\"}"
        }
      }]
    }
  }]
}

// 2. 工具执行结果
{
  "choices": [{
    "delta": {
      "role": "tool",
      "content": "{\"results\": [...]}",
      "tool_call_id": "call_abc123"
    }
  }]
}

// 3. 模型基于结果继续回答
{
  "choices": [{
    "delta": {
      "content": "根据检索结果..."
    }
  }]
}
```

#### Python 示例

```python
# MCP 工具会自动被调用，无需额外配置
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "帮我搜索最新的产品文档"}
    ],
    stream=True
)

for chunk in response:
    delta = chunk.choices[0].delta
    if getattr(delta, "reasoning_content", None):
        print(delta.reasoning_content, end="", flush=True)
        reasoning_text += delta.reasoning_content
    if getattr(delta, "tool_calls", None):
        for tc in delta.tool_calls:
            if tc.function and tc.function.name:
                print(f"\n🛠 调用函数: {tc.function.name}")
            if tc.function and tc.function.arguments:
                print(tc.function.arguments, end="", flush=True)
    elif getattr(delta, "role", None) == "tool":
        tool_call_id = getattr(delta, "tool_call_id", None)
        tool_name = getattr(delta, "name", None)
        tool_content = getattr(delta, "content", None)
        print(f"\n📦 工具返回结果({tool_name}, id={tool_call_id}): {tool_content}")
    elif delta.content:
        print(delta.content, end="", flush=True)
        response_text += delta.content
```

#### 非流式响应中的 Trace

```json
{
  "trace": [
    {
      "type": "assistant",
      "step": 0,
      "message": {...},
      "tool_calls": [...]
    },
    {
      "type": "tool_result",
      "step": 0,
      "tool_call_id": "call_abc123",
      "tool_name": "search_documents",
      "arguments": {"query": "财报"},
      "result": "{\"results\": [...]}"
    },
    {
      "type": "assistant",
      "step": 1,
      "message": {...}
    }
  ]
}
```

## 组合使用示例

### 场景：智能文档分析助手

结合知识库检索、图像识别、工具调用三大能力：

```python
import base64
from mimetypes import guess_type
from openai import OpenAI

client = OpenAI(base_url=f"<server_url>/v1", api_key="<api-key>")

IMG_PATH = "./test.jpg"

# Function to encode a local image into data URL
def local_image_to_data_url(image_path):
    # Guess the MIME type of the image based on the file extension
    mime_type, _ = guess_type(image_path)
    if mime_type is None:
        mime_type = 'application/octet-stream'  # Default MIME type if none is found

    # Read and encode the image file
    with open(image_path, "rb") as image_file:
        base64_encoded_data = base64.b64encode(image_file.read()).decode('utf-8')

    # Construct the data URL
    return f"data:{mime_type};base64,{base64_encoded_data}"

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "分析这张财报截图，并对比知识库中的历史数据"},
                {"type": "image_url", "image_url": {"url": "data:image/png;base64,..."}}
            ]
        }
    ],
    extra={
        "file_search": {
            "vector_store_ids": ["finance-kb"],
            "max_num_results": 5
        }
    },
    stream=True
)

# 处理流式响应
for chunk in response:
    delta = chunk.choices[0].delta
    if getattr(delta, "reasoning_content", None):
        print(delta.reasoning_content, end="", flush=True)
    if getattr(delta, "tool_calls", None):
        for tc in delta.tool_calls:
            if tc.function and tc.function.name:
                print(f"\n🛠 调用函数: {tc.function.name}")
            if tc.function and tc.function.arguments:
                print(tc.function.arguments, end="", flush=True)
    if getattr(delta, "role", None) == "file_search":
        annotations = getattr(delta, "annotations", [])
        if annotations:
            print("\n📄 RAG 查询结果：", flush=True)
            for i, ann in enumerate(annotations, start=1):
                doc_id = ann.get("id", "")
                filename = ann.get("filename", "")
                print(f"  {i}. 文档ID: {doc_id}", flush=True)
                print(f"     文件名: {filename}", flush=True)
                # 仅显示内容前 100 个字符作为预览
                preview = ann.get("content", "")
                preview = preview.replace("\n", " ")[:100]
                print(f"     内容预览: {preview}...", flush=True)
                print("  ──────────────────────────────", flush=True)
    elif getattr(delta, "role", None) == "tool":
        tool_call_id = getattr(delta, "tool_call_id", None)
        tool_name = getattr(delta, "name", None)
        tool_content = getattr(delta, "content", None)
        print(f"\n📦 工具返回结果({tool_name}, id={tool_call_id}): {tool_content}")
    elif delta.content:
        print(delta.content, end="", flush=True)

```

## 技术规格

### 限制说明

| 项目 | 限制 |
|------|------|
| MCP 工具调用迭代次数 | 最多 10 轮 |
| OCR 请求超时 | 30 秒 |
| 知识库检索超时 | 依赖后端服务配置 |
| 图片数量 | 建议不超过 5 张/请求 |

### 性能优化建议

1. **知识库检索**
   - 合理设置 `max_num_results`，避免上下文过长
   - RAG 模式建议 5-10 条，KAG 模式建议 10-20 条

2. **图像处理**
   - 建议压缩图片至 1024px 以内
   - 使用高质量扫描件以提升 OCR 准确率

3. **流式输出**
   - 对于长文本生成场景强烈建议启用 `stream: true`
   - 提升用户体验，减少等待时间

## 错误处理

### 常见错误

```json
// 1. API Key 无效
{
  "detail": "API Key 无效: Invalid or expired key"
}

// 2. 模型未配置
{
  "error": {
    "message": "Model 'xxx' not found in database.",
    "type": "invalid_request_error",
    "param": "model",
    "code": "model_not_found"
  }
}

// 3. MCP 未连接
{
  "detail": "MCP连接失败: Connection refused"
}

// 4. RAG 检索失败
// 流式响应中会跳过检索，直接基于原始上下文回答
// 非流式响应中会在 trace 中记录错误
{
  "trace": [
    {
      "type": "rag_error",
      "message": "Connection timeout"
    }
  ]
}
```
