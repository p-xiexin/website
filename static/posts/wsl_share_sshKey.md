---
description: WSL 共享 Windows SSH 密钥
date: '2026-01-26'
author: 'pxx'
categories:
  - 其他
published: true
---

# WSL 共享 Windows SSH 密钥

在 Windows + WSL2 环境下，WSL 需要使用 SSH key 访问 GitHub 等服务。

## 操作步骤

1. 确认 Windows 已存在 SSH 密钥：

```text
C:\Users\<用户名>\.ssh
```

1. 在 WSL 中创建 SSH 目录并复制密钥：

```bash
mkdir -p ~/.ssh
cp /mnt/c/Users/<用户名>/.ssh/id_rsa* ~/.ssh/
```

1. 设置 SSH 目录和密钥权限：

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

1. 测试 SSH 连接：

```bash
ssh -T git@github.com
```

## 说明

WSL 无法直接使用 `/mnt/c` 下的 Windows 私钥文件，其权限在 Linux 视角下过大，SSH 会忽略该私钥。

将密钥复制到 WSL 的 Linux 文件系统并设置正确权限，是唯一稳定可用的共享方式。