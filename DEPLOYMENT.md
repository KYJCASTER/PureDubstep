# PureDubstep 部署指南

> 以下步骤需要你**手动执行**，我已经为你准备好了所有配置文件。

---

## 前置要求

- Docker Desktop (Windows/Mac) 或 Docker Engine (Linux)
- Docker Compose

---

## 快速部署

### 1. 复制环境变量文件

在项目根目录执行：

```bash
# Windows (PowerShell)
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

### 2. 修改 .env 文件（可选）

用记事本或编辑器打开 `.env` 文件，修改数据库密码：

```
DB_PASSWORD=你的MySQL密码
```

### 3. 启动服务

```bash
# 构建并启动所有服务
docker-compose up --build

# 或者以后台模式运行
docker-compose up -d --build
```

### 4. 访问网站

- **前端**: http://loca
- lhost
- **后端 API**: http://localhdocker logs -n 200 puredubstep-backendost:8080
- **Swagger 文档**: http://localhost/swagger-ui.html

---

## 常用命令

```bash
# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重新构建并启动
docker-compose up --build

# 删除所有数据（重置数据库）
docker-compose down -v
```

---

## 账号信息

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin123 |
| 普通用户 | user | user123 |

---

## 故障排查

### 端口被占用

如果 80 端口被占用，修改 `docker-compose.yml` 中 frontend 的端口：

```yaml
frontend:
  ports:
    - "8081:80"  # 改为 8081
```

### 数据库连接失败

确保 `.env` 文件中的 `DB_PASSWORD` 与 `docker-compose.yml` 中的 MySQL 密码一致。

### 首次登录失败

首次启动后等待 10-15 秒让数据库初始化完成，然后重试登录。

---

## 生产环境建议

1. **修改 JWT 密钥** - 在 `.env` 中使用更复杂的密钥
2. **使用域名** - 配置 Nginx 反向代理并添加 SSL 证书
3. **数据备份** - 定期备份 MySQL 数据卷
4. **日志管理** - 集成 ELK 或 Loki 进行日志收集
