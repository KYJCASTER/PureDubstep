# PureDubstep 项目进度记录

## 最近更新 (2026-02-16)

### 本次完善内容
1. **播放统计功能** - 前端播放器在播放时自动记录播放次数
2. **热门榜单** - 首页展示热门曲目，Tracks页面支持按热门排序
3. **曲目搜索** - Tracks页面支持搜索功能
4. **播放次数显示** - TrackCard和播放器显示播放次数

### 数据扩展
- 新增8位Dubstep艺人 (Knife Party, 守信, Mala, Loefah, Truth, Friction, Alix Perez等)
- 新增15+首热门曲目
- 总计：20位艺人，25+首曲目

### 技术更新
- 修复Lombok编译问题，更新Spring Boot版本为3.3.5
- 修复JWT和Spring Security兼容性问题

### 当前运行状态 ✅
- 前端运行: http://localhost:5174
- 后端运行: http://localhost:8080
- 数据库: MySQL (WSL)

### 账号
- 管理员: admin / admin123
- 普通用户: user / user123

---

## 项目概述
- **项目名称**: PureDubstep - Dubstep音乐推荐网站
- **技术栈**: Spring Boot 4.0.2 (后端) + React 18 + Vite + TailwindCSS (前端)
- **数据库**: MySQL 8.0
- **认证**: JWT Token
- **设计风格**: 黑白色调美漫风 (American Comic Book Style)

---

## 已完成功能

### 后端 (Spring Boot)
1. ✅ 用户模块 - 注册/登录/JWT认证
2. ✅ 音乐模块 - CRUD、分页、搜索、热门/最新排序
3. ✅ 艺术家模块 - 列表、详情、关联音乐
4. ✅ 收藏模块 - 添加/取消收藏
5. ✅ 播放列表模块 - 创建、编辑、删除、添加曲目
6. ✅ 邮箱订阅模块 - 新增 (实体/Repository/Service/Controller)

### 前端 (React)
1. ✅ 首页 - 热门曲目、最新发布、热门艺人
2. ✅ 曲目列表 - 分页、筛选、搜索
3. ✅ 艺术家列表/详情
4. ✅ 用户收藏/歌单
5. ✅ 个人中心
6. ✅ 登录/注册页面
7. ✅ 全局音乐播放器
8. ✅ 中文化 - 所有页面文本已改为中文
9. ✅ 订阅组件 - 首页底部

### 设计系统
1. ✅ 黑白色调 + 红色强调
2. ✅ 漫画风格 - 粗边框(4-5px)、硬阴影、半调纹理
3. ✅ Framer Motion 页面过渡动画
4. ✅ 响应式布局

---

## 数据初始化
- 管理员账号: admin / admin123
- 普通用户: user / user123
- 艺术家: 12位知名Dubstep艺人 (Skrillex, Nero, Excision等)
- 曲目: 10首示例曲目

---

## 文件结构

```
/mnt/d/ccDubstep/
├── PureDubstep/                    # 后端项目
│   ├── src/main/java/puredubstep/
│   │   ├── entity/               # 实体类
│   │   │   ├── User.java
│   │   │   ├── Track.java
│   │   │   ├── Artist.java
│   │   │   ├── Favorite.java
│   │   │   ├── Playlist.java
│   │   │   └── Subscription.java  # 新增
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── config/
│   │   │   └── DataInitializer.java  # 初始化数据
│   │   └── security/
│   └── pom.xml
│
└── pure-dubstep-client/           # 前端项目
    ├── src/
    │   ├── components/
    │   │   ├── Header.tsx
    │   │   ├── MusicPlayer.tsx
    │   │   ├── TrackCard.tsx
    │   │   ├── ArtistCard.tsx
    │   │   ├── PlaylistCard.tsx
    │   │   ├── Subscribe.tsx      # 新增
    │   │   └── PageTransition.tsx
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Tracks.tsx
    │   │   ├── Artists.tsx
    │   │   ├── ArtistDetail.tsx
    │   │   ├── TrackDetail.tsx
    │   │   ├── Favorites.tsx
    │   │   ├── Playlists.tsx
    │   │   ├── PlaylistDetail.tsx
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   └── Profile.tsx
    │   ├── context/
    │   │   ├── AuthContext.tsx
    │   │   └── MusicPlayerContext.tsx
    │   ├── services/api.ts
    │   ├── types/
    │   └── index.css              # 漫画设计系统
    └── package.json
```

---

## 启动命令

### 前端 (已配置)
```bash
cd /mnt/d/ccDubstep/pure-dubstep-client
npm run dev
# 访问 http://localhost:5173
```

### 后端 (需配置Java环境)
```bash
# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-17
cd D:\ccDubstep\PureDubstep
mvnw.cmd spring-boot:run

# Linux/Mac
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
cd /mnt/d/ccDubstep/PureDubstep
./mvnw spring-boot:run
# API: http://localhost:8080
```

---

## 待完成任务
1. 后端需配置Java环境才能启动

## 近期更新 (2025-02-16)
### 新增功能
1. ✅ 播放统计功能 - 前端播放器在播放时自动记录播放次数
2. ✅ 热门榜单 - 首页展示热门曲目，Tracks页面支持按热门排序
3. ✅ 曲目搜索 - Tracks页面支持搜索功能
4. ✅ 播放次数显示 - TrackCard和播放器显示播放次数

### 数据扩展
- 新增8位Dubstep艺人 (Knife Party, 守信, Mala, Loefah, Truth, Friction, Alix Perez等)
- 新增15+首热门曲目
- 总计：20位艺人，25+首曲目

---

## 注意事项
- 前端运行正常，后端需要Java环境
- 数据库使用MySQL，需确保MySQL服务运行
- 默认数据库名: puredubstep
