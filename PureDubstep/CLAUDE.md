# PureDubstep 后端 (Spring Boot)

## 职责范围
- PureDubstep 项目目录下的所有代码
- Spring Boot API 开发
- MySQL 数据库相关
- 文件上传/静态资源服务
- Docker 容器管理

## 目录
/workspace → /mnt/d/ccDubstep/PureDubstep

## 常用命令
```bash
# 构建项目
./mvnw clean package -DskipTests

# 运行测试
./mvnw test

# Docker 相关
cd /mnt/d/ccDubstep && docker-compose up -d --build
docker-compose logs -f backend
```

## 注意事项
- 不要修改前端代码 (pure-dubstep-client/)
- 前端静态资源在 /mnt/d/ccDubstep/pure-dubstep-client/dist
- 上传文件在 /mnt/d/ccDubstep/uploads
