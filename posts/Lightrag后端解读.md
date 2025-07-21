---
description: 解读lightrag后端相关api，适配自己的网页
date: '2025-04-21'
author: 'pxx'
categories:
  - RAG
published: true
---

# 知识库后端架构



> 主要参考[lightrag](https://github.com/Zaituun-social/LightRAG)后端，以`KAG` [OpenSPG](https://github.com/OpenSPG/openspg)界面功能为补充
>
> [KAG用户手册](https://openspg.yuque.com/ndx6g9/0.5/figkrornp0qwelhl)

```pgsql
        +-----------------------------------------+
        |               FastAPI/Flask             |
        |            (Web API Layer)              |
        +-----------------------------------------+
             |              |               |
+----------------+   +----------------+   +-----------------+
|   RAG Retriever|   | RAG Generator  |   | Knowledge Base  |
|   (Retriever)  |   | (Generator)    |   | (Database/API)  |
+----------------+   +----------------+   +-----------------+
```

![](https://openspg.yuque.com/ndx6g9/0.5/figkrornp0qwelhl?inner=VGsNn)

```python
rag = LightRAG(
            working_dir=args.working_dir,
            llm_model_func=azure_openai_model_complete,
            chunk_token_size=int(args.chunk_size),
            chunk_overlap_token_size=int(args.chunk_overlap_size),
            llm_model_kwargs={
                "timeout": args.timeout,
            },
app.include_router(create_document_routes(rag, doc_manager, api_key))
app.include_router(create_query_routes(rag, api_key, args.top_k))
app.include_router(create_graph_routes(rag, api_key))
```


## 文档上传构建模块

### 1. 文档处理 API 总览

| 接口                         | 功能说明                                         | 用户体验                                               | 典型使用场景                             |
| ---------------------------- | ------------------------------------------------ | ------------------------------------------------------ | ---------------------------------------- |
| `POST /documents/scan`       | **自动扫描文件夹**，查找新文档并后台处理         | 无需上传，只要把文件放进指定文件夹，系统自动处理       | 当管理员或系统定期把文件保存到固定目录   |
| `POST /documents/upload`     | 上传一个文件到**固定输入目录**，系统自动开始处理 | 直接上传文件，不需要关注保存位置                       | 用户想添加一个正式文件用于持久存储和处理 |
| `POST /documents/file`       | 上传一个文件到**临时目录**，并立即处理           | 不保存原文件，只做一次性处理                           | 快速测试一个文档内容或临时使用           |
| `POST /documents/file_batch` | 批量上传多个文件进行处理                         | 一次处理多个文件，自动跳过不支持的格式并提示哪些失败了 | 多文档批量导入，如初次接入文档库时       |
| `POST /documents/text`       | 提交一段纯文本并处理                             | 粘贴或输入内容，作为“文档”提交                         | 快速输入一段内容进行知识接入             |
| `POST /documents/texts`      | 提交多段文本一起处理                             | 批量提交文本，效率更高                                 | FAQ、知识点清单等分段内容导入            |

### 2. 状态管理相关 API

| 接口                             | 功能说明                         | 用户体验                                           | 典型使用场景                           |
| -------------------------------- | -------------------------------- | -------------------------------------------------- | -------------------------------------- |
| `GET /documents`                 | 获取当前系统中所有文档的处理状态 | 可以查看每个文档是正在处理、已完成、失败还是等待中 | 用户或管理员查看处理进度或排查失败原因 |
| `GET /documents/pipeline_status` | 获取文档处理“系统”的整体运行状态 | 查看是否有任务正在运行、处理到了哪一批等           | 需要判断当前系统是否空闲、是否卡住了   |
| `DELETE /documents`              | 清空系统中所有文档、向量数据     | 一键清除，重新开始                                 | 测试阶段、系统维护、用户重置数据时使用 |

| 字段名             | 类型         | 含义                               | 举例                                    | 用户怎么看这个字段                             |
| ------------------ | ------------ | ---------------------------------- | --------------------------------------- | ---------------------------------------------- |
| `autoscanned`      | `bool`       | 是否自动扫描目录并开始构图任务     | `true`                                  | 系统是否处于自动监控文件夹、持续抓取文档状态   |
| `busy`             | `bool`       | 当前系统是否正在处理任务           | `true`                                  | 如果为 true，说明现在正在构图，不建议重复提交  |
| `job_name`         | `str`        | 当前任务的名称或类型               | `"indexing files"` / `"indexing texts"` | 能快速判断当前在处理的是上传文件，还是粘贴文本 |
| `job_start`        | `str / None` | 当前任务开始的时间（ISO 时间格式） | `"2025-04-20T14:36:00"`                 | 方便用户推断任务是否运行太久，有没有卡住       |
| `docs`             | `int`        | 要处理的文档总数（排队中或已处理） | `25`                                    | 能看到这批任务总共多少文档                     |
| `batchs`           | `int`        | 任务被分成了多少个批次处理         | `5`                                     | 用于大型数据时并发处理，每批处理几个文档       |
| `cur_batch`        | `int`        | 当前正在处理第几批                 | `3`                                     | 可视化进度条时用，比如“3/5”                    |
| `request_pending`  | `bool`       | 是否有新的任务等待被启动           | `false`                                 | 为 true 表示还有任务在排队，系统稍后会继续跑   |
| `latest_message`   | `str`        | 当前或最近一次处理日志消息         | `"Processing batch 3 of 5"`             | 类似进度提示，用户可据此判断系统卡在哪         |
| `history_messages` | `List[str]`  | 历史日志信息                       | `["Batch 1 done", "Batch 2 done"]`      | 帮助开发者或用户回溯整个处理流程，有无异常     |

### 3. 后台处理逻辑详解

```python
@router.post("/text", response_model=InsertResponse, dependencies=[Depends(optional_api_key)])
async def insert_text(request: InsertTextRequest, background_tasks: BackgroundTasks):
    try:
        background_tasks.add_task(pipeline_index_texts, rag, [request.text])
        return InsertResponse(
            status="success",
            message="Text successfully received. Processing will continue in background.",
        )
    except Exception as e:
        logger.error(f"Error /documents/text: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

async def pipeline_index_texts(rag: LightRAG, texts: List[str]):
    """Index a list of texts

    Args:
        rag: LightRAG instance
        texts: The texts to index
    """
    if not texts:
        return
    await rag.apipeline_enqueue_documents(texts)
    await rag.apipeline_process_enqueue_documents()
```

系统**使用了后台任务机制**，用来处理文档的“构图任务”——也就是文档的上传、解析、索引、生成知识图谱等过程，都是**在后台完成**的。下面是详细的分析和解释：

所谓后台任务（`BackgroundTasks`）指的是：**用户发送请求后，系统立即返回响应，但“重的任务”在后台慢慢处理，不影响用户体验。**以下几个接口都用到了 `BackgroundTasks`：

1. `/documents/upload`
2. `/documents/file`
3. `/documents/file_batch`
4. `/documents/text`
5. `/documents/texts`
6. `/documents/scan`

用户上传文件或提交文本后，系统会**将任务“排队”交给后台处理系统**，主要做以下几件事：

1. **文档识别与解析**

   - 支持多种文件类型（txt, pdf, docx, xlsx, pptx 等）

   - 不同格式的文件有不同的解析方法

   - 识别后抽取出文本内容

2. **构图/索引任务（构建知识图谱或语义索引）**

   - 把解析后的内容送入 RAG 系统处理（可能包括分块、向量化、抽取实体/关系等）

   - 文档被转化为系统“能记住并使用”的知识

3. **异步并发处理**

   - 使用 `asyncio.gather`，多个文件可以**并行处理**，提升速度

   - 不阻塞主线程，系统可以正常响应客户端的其他请求

     

## 知识图谱可视化模块

| 路由                    | 功能描述                         | 参数                                                         | 返回值                                                       |
| ----------------------- | -------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **`/graph/label/list`** | 获取所有图标签                   | 无                                                           | 一个字符串列表，包含所有的图标签，如 `["label1", "label2", "label3"]` |
| **`/graphs`**           | 根据指定标签获取相关的知识图子图 | - `label` (str): 要查询的标签                                                                         - `max_depth` (int): 最大深度，默认为 3                                                       - `min_degree` (int): 最小度数，默认为 0                                                       - `inclusive` (bool): 是否包括包含标签的节点，默认为 `False` | 返回一个字典，表示知识图的结构，键是节点标签，值是节点连接的其他节点列表。如： |




