# PureDubstep 项目总览

## 项目结构
```
/mnt/d/ccDubstep/
├── PureDubstep/          # 后端 (Spring Boot)
├── pure-dubstep-client/  # 前端 (React + Vite)
├── uploads/              # 上传文件目录
├── docker-compose.yml    # Docker 部署配置
└── .env                  # 环境变量
```

## 多会话协作规则

### 终端 A - 后端开发
```bash
cd /mnt/d/ccDubstep/PureDubstep
claude
```
职责: API开发、数据库、Docker

### 终端 B - 前端开发
```bash
cd /mnt/d/ccDubstep/pure-dubstep-client
claude
```
职责: React组件、UI开发

## 常用命令
```bash
# 启动全部服务
cd /mnt/d/ccDubstep && docker-compose up -d --build

# 查看后端日志
docker-compose logs -f backend

# 查看前端日志
docker-compose logs -f frontend
```

## 账号
- 管理员: admin/admin123
- 用户: user/user123
