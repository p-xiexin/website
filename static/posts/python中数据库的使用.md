---
description: SQLAlchemy数据库Schema的学习记录
date: '2025-05-27'
author: 'pxx'
categories:
  - SQL
published: true
---

# SQLAlchemy数据库Schema定义

## 前言

SQLAlchemy是Python中最流行的ORM（对象关系映射）框架，它允许我们用Python类来定义数据库表结构，用对象操作来代替SQL语句。本文将详细介绍如何使用SQLAlchemy定义数据库Schema。

## 1. 基础概念

### 什么是ORM？
ORM（Object-Relational Mapping）是一种编程技术，用于在面向对象编程语言和关系数据库之间建立映射关系。简单来说，就是让我们可以用操作对象的方式来操作数据库。

### SQLAlchemy的核心组件
- **Engine**: 数据库连接引擎
- **Base**: 声明式基类
- **Model**: 数据模型类
- **Session**: 数据库会话

## 2. 环境准备

```python
# 安装SQLAlchemy
pip install sqlalchemy

# 基本导入
from sqlalchemy import create_engine, Column, String, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.sql import func
```

## 3. 创建基础Schema

### 3.1 声明基类

```python
from sqlalchemy.ext.declarative import declarative_base

# 创建声明式基类
Base = declarative_base()
```

所有的模型类都需要继承这个Base类。

### 3.2 定义第一个模型

```python
class User(Base):
    __tablename__ = 'users'  # 指定表名
    
    # 定义列
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False, unique=True)
    email = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=func.now())
    is_active = Column(Boolean, default=True)
```

## 4. 列类型详解

### 4.1 基本数据类型

```python
from sqlalchemy import String, Integer, Float, Boolean, DateTime, Text, Date, Time

class Product(Base):
    __tablename__ = 'products'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100))        # 字符串，最大长度100
    price = Column(Float)             # 浮点数
    description = Column(Text)        # 长文本
    is_available = Column(Boolean)    # 布尔值
    created_date = Column(Date)       # 日期
    created_time = Column(Time)       # 时间
    created_at = Column(DateTime)     # 日期时间
```

### 4.2 列约束参数

```python
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, 
                primary_key=True,      # 主键
                autoincrement=True)    # 自增
    
    username = Column(String(50), 
                     nullable=False,   # 不能为空
                     unique=True)      # 唯一约束
    
    email = Column(String(100), 
                   nullable=False,
                   index=True)         # 创建索引
    
    age = Column(Integer, 
                 default=18)           # 默认值
    
    created_at = Column(DateTime, 
                       default=func.now())  # 默认当前时间
    
    updated_at = Column(DateTime, 
                       default=func.now(), 
                       onupdate=func.now()) # 更新时自动更新时间
```

## 5. 关系定义

### 5.1 一对多关系 (One-to-Many)

```python
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)
    
    # 定义关系：一个用户有多篇文章
    posts = relationship("Post", back_populates="author")

class Post(Base):
    __tablename__ = 'posts'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200))
    content = Column(Text)
    author_id = Column(Integer, ForeignKey('users.id'))  # 外键
    
    # 定义关系：一篇文章属于一个用户
    author = relationship("User", back_populates="posts")
```

### 5.2 多对多关系 (Many-to-Many)

```python
from sqlalchemy import Table

# 创建关联表
user_role_table = Table('user_roles', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('role_id', Integer, ForeignKey('roles.id'))
)

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50))
    
    # 多对多关系
    roles = relationship("Role", secondary=user_role_table, back_populates="users")

class Role(Base):
    __tablename__ = 'roles'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    
    # 多对多关系
    users = relationship("User", secondary=user_role_table, back_populates="roles")
```

### 5.3 一对一关系 (One-to-One)

```python
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50))
    
    # 一对一关系
    profile = relationship("UserProfile", back_populates="user", uselist=False)

class UserProfile(Base):
    __tablename__ = 'user_profiles'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True)
    bio = Column(Text)
    
    # 一对一关系
    user = relationship("User", back_populates="profile")
```

### 5.4 自引用关系 (Self-referential)

```python
class Category(Base):
    __tablename__ = 'categories'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    parent_id = Column(Integer, ForeignKey('categories.id'))
    
    # 自引用关系
    parent = relationship("Category", remote_side=[id], back_populates="children")
    children = relationship("Category", back_populates="parent")
```

## 6. 高级Schema功能

### 6.1 索引定义

```python
from sqlalchemy import Index

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50))
    email = Column(String(100))
    created_at = Column(DateTime)
    
    # 方法1：在列定义时创建索引
    phone = Column(String(20), index=True)
    
    # 方法2：使用__table_args__创建复合索引
    __table_args__ = (
        Index('ix_user_email_created', 'email', 'created_at'),  # 复合索引
        Index('ix_user_username', 'username', unique=True),     # 唯一索引
    )
```

### 6.2 表约束

```python
from sqlalchemy import CheckConstraint, UniqueConstraint

class Product(Base):
    __tablename__ = 'products'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    price = Column(Float)
    category = Column(String(50))
    
    __table_args__ = (
        # 检查约束：价格必须大于0
        CheckConstraint('price > 0', name='check_positive_price'),
        
        # 唯一约束：名称和分类的组合必须唯一
        UniqueConstraint('name', 'category', name='uq_name_category'),
    )
```

### 6.3 级联删除

```python
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50))
    
    # 级联删除：删除用户时，相关的文章也会被删除
    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")

class Post(Base):
    __tablename__ = 'posts'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200))
    author_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    
    author = relationship("User", back_populates="posts")
```

## 7. 实际应用示例

让我们创建一个完整的博客系统Schema：

```python
from sqlalchemy import create_engine, Column, String, Integer, DateTime, Boolean, Text, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.sql import func

Base = declarative_base()

# 文章标签关联表（多对多）
post_tag_table = Table('post_tags', Base.metadata,
    Column('post_id', Integer, ForeignKey('posts.id')),
    Column('tag_id', Integer, ForeignKey('tags.id'))
)

class User(Base):
    """用户模型"""
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False, unique=True)
    email = Column(String(100), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # 关系定义
    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")

class Category(Base):
    """分类模型"""
    __tablename__ = 'categories'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    description = Column(Text)
    parent_id = Column(Integer, ForeignKey('categories.id'))
    created_at = Column(DateTime, default=func.now())
    
    # 自引用关系
    parent = relationship("Category", remote_side=[id], back_populates="children")
    children = relationship("Category", back_populates="parent")
    posts = relationship("Post", back_populates="category")

class Tag(Base):
    """标签模型"""
    __tablename__ = 'tags'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(30), nullable=False, unique=True)
    created_at = Column(DateTime, default=func.now())
    
    # 多对多关系
    posts = relationship("Post", secondary=post_tag_table, back_populates="tags")

class Post(Base):
    """文章模型"""
    __tablename__ = 'posts'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    summary = Column(Text)
    is_published = Column(Boolean, default=False)
    view_count = Column(Integer, default=0)
    author_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # 关系定义
    author = relationship("User", back_populates="posts")
    category = relationship("Category", back_populates="posts")
    tags = relationship("Tag", secondary=post_tag_table, back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    
    # 索引定义
    __table_args__ = (
        Index('ix_post_author_created', 'author_id', 'created_at'),
        Index('ix_post_published', 'is_published'),
    )

class Comment(Base):
    """评论模型"""
    __tablename__ = 'comments'
    
    id = Column(Integer, primary_key=True)
    content = Column(Text, nullable=False)
    post_id = Column(Integer, ForeignKey('posts.id'), nullable=False)
    author_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    parent_id = Column(Integer, ForeignKey('comments.id'))  # 支持回复评论
    is_approved = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    
    # 关系定义
    post = relationship("Post", back_populates="comments")
    author = relationship("User", back_populates="comments")
    parent = relationship("Comment", remote_side=[id], back_populates="replies")
    replies = relationship("Comment", back_populates="parent")
```

## 8. 数据库操作基础

### 8.1 创建数据库连接和表

```python
# 创建数据库引擎
engine = create_engine('sqlite:///blog.db', echo=True)

# 创建所有表
Base.metadata.create_all(engine)

# 创建会话
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session = SessionLocal()
```

### 8.2 基本CRUD操作

```python
# 创建用户
user = User(username="john_doe", email="john@example.com", password_hash="hashed_password")
session.add(user)
session.commit()

# 查询用户
user = session.query(User).filter(User.username == "john_doe").first()

# 更新用户
user.email = "newemail@example.com"
session.commit()

# 删除用户
session.delete(user)
session.commit()

# 关闭会话
session.close()
```

## 9. 最佳实践

### 9.1 命名规范
- 表名使用复数形式的蛇形命名：`users`, `blog_posts`
- 字段名使用蛇形命名：`created_at`, `user_id`
- 类名使用帕斯卡命名：`User`, `BlogPost`

### 9.2 性能优化
- 合理使用索引，特别是外键和经常查询的字段
- 对于大文本字段使用`Text`类型而不是`String`
- 使用`lazy loading`控制关系数据的加载时机

### 9.3 安全性
- 敏感信息如密码要进行哈希处理
- 使用参数化查询防止SQL注入
- 合理设置字段长度限制

## 10. 总结

SQLAlchemy提供了强大而灵活的Schema定义能力，通过声明式语法让我们能够：

1. **直观地定义数据模型**：用Python类表示数据库表
2. **灵活地处理关系**：支持各种类型的表关系
3. **强大的约束支持**：索引、唯一约束、检查约束等
4. **自动化操作**：自动生成SQL、自动时间戳等

掌握这些基础知识后，你就可以开始构建复杂的数据库应用了。记住，良好的Schema设计是应用成功的基础，值得花时间仔细规划。

## 参考资源

- [SQLAlchemy官方文档](https://docs.sqlalchemy.org/)
- [SQLAlchemy ORM教程](https://docs.sqlalchemy.org/en/14/orm/tutorial.html)
- [数据库设计最佳实践](https://www.sqlstyle.guide/)