-- 用户管理系统数据库设计
-- 作者：前端团队
-- 日期：2023-07-01
-- 描述：用户管理系统的数据库表结构设计

-- 创建数据库
CREATE DATABASE IF NOT EXISTS user_admin DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_general_ci;

USE user_admin;

-- 部门表
CREATE TABLE sys_dept (
    dept_id         BIGINT      NOT NULL AUTO_INCREMENT COMMENT '部门ID',
    parent_id       BIGINT      NOT NULL DEFAULT 0 COMMENT '父部门ID',
    dept_name       VARCHAR(50) NOT NULL COMMENT '部门名称',
    order_num       INT         NOT NULL DEFAULT 0 COMMENT '显示顺序',
    leader          VARCHAR(20)          DEFAULT NULL COMMENT '负责人',
    phone           VARCHAR(11)          DEFAULT NULL COMMENT '联系电话',
    email           VARCHAR(50)          DEFAULT NULL COMMENT '邮箱',
    status          CHAR(1)     NOT NULL DEFAULT '0' COMMENT '部门状态（0正常 1停用）',
    create_by       BIGINT               DEFAULT NULL COMMENT '创建者',
    create_time     DATETIME             DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by       BIGINT               DEFAULT NULL COMMENT '更新者',
    update_time     DATETIME             DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (dept_id)
) ENGINE=InnoDB AUTO_INCREMENT=100 COMMENT='部门表';

-- 用户表
CREATE TABLE sys_user (
    user_id         BIGINT      NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    username        VARCHAR(30) NOT NULL COMMENT '用户账号',
    nickname        VARCHAR(30) NOT NULL COMMENT '用户昵称',
    password        VARCHAR(100) NOT NULL COMMENT '密码',
    dept_id         BIGINT               DEFAULT NULL COMMENT '部门ID',
    avatar          VARCHAR(100)         DEFAULT '' COMMENT '头像地址',
    phone           VARCHAR(11)          DEFAULT '' COMMENT '手机号码',
    email           VARCHAR(50)          DEFAULT '' COMMENT '用户邮箱',
    sex             CHAR(1)              DEFAULT '0' COMMENT '用户性别（0男 1女 2未知）',
    status          CHAR(1)              DEFAULT '0' COMMENT '帐号状态（0正常 1停用）',
    login_ip        VARCHAR(128)         DEFAULT '' COMMENT '最后登录IP',
    login_date      DATETIME             DEFAULT NULL COMMENT '最后登录时间',
    create_by       BIGINT               DEFAULT NULL COMMENT '创建者',
    create_time     DATETIME             DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by       BIGINT               DEFAULT NULL COMMENT '更新者',
    update_time     DATETIME             DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    remark          VARCHAR(500)         DEFAULT NULL COMMENT '备注',
    PRIMARY KEY (user_id),
    UNIQUE KEY idx_username (username),
    KEY idx_dept_id (dept_id)
) ENGINE=InnoDB AUTO_INCREMENT=100 COMMENT='用户信息表';

-- 角色表
CREATE TABLE sys_role (
    role_id         BIGINT      NOT NULL AUTO_INCREMENT COMMENT '角色ID',
    role_name       VARCHAR(30) NOT NULL COMMENT '角色名称',
    role_key        VARCHAR(100) NOT NULL COMMENT '角色权限字符串',
    role_sort       INT         NOT NULL COMMENT '显示顺序',
    status          CHAR(1)     NOT NULL DEFAULT '0' COMMENT '角色状态（0正常 1停用）',
    create_by       BIGINT               DEFAULT NULL COMMENT '创建者',
    create_time     DATETIME             DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by       BIGINT               DEFAULT NULL COMMENT '更新者',
    update_time     DATETIME             DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    remark          VARCHAR(500)         DEFAULT NULL COMMENT '备注',
    PRIMARY KEY (role_id)
) ENGINE=InnoDB AUTO_INCREMENT=100 COMMENT='角色信息表';

-- 菜单表
CREATE TABLE sys_menu (
    menu_id         BIGINT      NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
    menu_name       VARCHAR(50) NOT NULL COMMENT '菜单名称',
    parent_id       BIGINT      NOT NULL DEFAULT 0 COMMENT '父菜单ID',
    order_num       INT         NOT NULL DEFAULT 0 COMMENT '显示顺序',
    path            VARCHAR(200)         DEFAULT '' COMMENT '路由地址',
    component       VARCHAR(255)         DEFAULT NULL COMMENT '组件路径',
    is_frame        INT         NOT NULL DEFAULT 1 COMMENT '是否为外链（0是 1否）',
    is_cache        INT         NOT NULL DEFAULT 0 COMMENT '是否缓存（0缓存 1不缓存）',
    menu_type       CHAR(1)     NOT NULL DEFAULT '' COMMENT '菜单类型（M目录 C菜单 F按钮）',
    visible         CHAR(1)     NOT NULL DEFAULT '0' COMMENT '菜单状态（0显示 1隐藏）',
    status          CHAR(1)     NOT NULL DEFAULT '0' COMMENT '菜单状态（0正常 1停用）',
    perms           VARCHAR(100)         DEFAULT NULL COMMENT '权限标识',
    icon            VARCHAR(100)         DEFAULT '#' COMMENT '菜单图标',
    create_by       BIGINT               DEFAULT NULL COMMENT '创建者',
    create_time     DATETIME             DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by       BIGINT               DEFAULT NULL COMMENT '更新者',
    update_time     DATETIME             DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    remark          VARCHAR(500)         DEFAULT NULL COMMENT '备注',
    PRIMARY KEY (menu_id)
) ENGINE=InnoDB AUTO_INCREMENT=2000 COMMENT='菜单权限表';

-- 用户和角色关联表
CREATE TABLE sys_user_role (
    user_id         BIGINT      NOT NULL COMMENT '用户ID',
    role_id         BIGINT      NOT NULL COMMENT '角色ID',
    PRIMARY KEY (user_id, role_id),
    KEY idx_role_id (role_id)
) ENGINE=InnoDB COMMENT='用户和角色关联表';

-- 角色和菜单关联表
CREATE TABLE sys_role_menu (
    role_id         BIGINT      NOT NULL COMMENT '角色ID',
    menu_id         BIGINT      NOT NULL COMMENT '菜单ID',
    PRIMARY KEY (role_id, menu_id),
    KEY idx_menu_id (menu_id)
) ENGINE=InnoDB COMMENT='角色和菜单关联表';

-- 用户数据权限表
CREATE TABLE sys_user_data_scope (
    user_id         BIGINT      NOT NULL COMMENT '用户ID',
    dept_id         BIGINT      NOT NULL COMMENT '部门ID',
    PRIMARY KEY (user_id, dept_id)
) ENGINE=InnoDB COMMENT='用户数据权限表';

-- 重置密码令牌表
CREATE TABLE sys_password_reset (
    reset_id        BIGINT      NOT NULL AUTO_INCREMENT COMMENT '重置ID',
    user_id         BIGINT      NOT NULL COMMENT '用户ID',
    token           VARCHAR(100) NOT NULL COMMENT '重置令牌',
    expire_time     DATETIME    NOT NULL COMMENT '过期时间',
    create_time     DATETIME    DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (reset_id),
    UNIQUE KEY idx_token (token),
    KEY idx_user_id (user_id)
) ENGINE=InnoDB AUTO_INCREMENT=100 COMMENT='密码重置令牌表';

-- 初始化数据

-- 初始化部门数据
INSERT INTO sys_dept (dept_id, parent_id, dept_name, order_num, leader, phone, email, status, create_by)
VALUES (1, 0, '总公司', 1, '张三', '13800138000', 'zhangsan@example.com', '0', 1);

INSERT INTO sys_dept (dept_id, parent_id, dept_name, order_num, leader, phone, email, status, create_by)
VALUES (2, 1, '研发部门', 1, '李四', '13800138001', 'lisi@example.com', '0', 1);

INSERT INTO sys_dept (dept_id, parent_id, dept_name, order_num, leader, phone, email, status, create_by)
VALUES (3, 1, '测试部门', 2, '钱七', '13800138002', 'qianqi@example.com', '0', 1);

INSERT INTO sys_dept (dept_id, parent_id, dept_name, order_num, leader, phone, email, status, create_by)
VALUES (4, 1, '运维部门', 3, '孙八', '13800138003', 'sunba@example.com', '1', 1);

INSERT INTO sys_dept (dept_id, parent_id, dept_name, order_num, leader, phone, email, status, create_by)
VALUES (5, 2, '前端组', 1, '王五', '13800138004', 'wangwu@example.com', '0', 1);

INSERT INTO sys_dept (dept_id, parent_id, dept_name, order_num, leader, phone, email, status, create_by)
VALUES (6, 2, '后端组', 2, '赵六', '13800138005', 'zhaoliu@example.com', '0', 1);

INSERT INTO sys_dept (dept_id, parent_id, dept_name, order_num, leader, phone, email, status, create_by)
VALUES (7, 0, '市场部门', 2, '周九', '13800138006', 'zhoujiu@example.com', '0', 1);

INSERT INTO sys_dept (dept_id, parent_id, dept_name, order_num, leader, phone, email, status, create_by)
VALUES (8, 0, '财务部门', 3, '吴十', '13800138007', 'wushi@example.com', '0', 1);

-- 初始化菜单数据
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon)
VALUES (1, '系统管理', 0, 1, '/system', NULL, 1, 0, 'M', '0', '0', '', 'system');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon)
VALUES (2, '用户管理', 1, 1, 'user', 'system/user/index', 1, 0, 'C', '0', '0', 'system:user:list', 'user');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon)
VALUES (3, '角色管理', 1, 2, 'role', 'system/role/index', 1, 0, 'C', '0', '0', 'system:role:list', 'peoples');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon)
VALUES (4, '部门管理', 1, 3, 'dept', 'system/dept/index', 1, 0, 'C', '0', '0', 'system:dept:list', 'tree');

-- 用户按钮权限
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon)
VALUES (100, '用户查询', 2, 1, '', '', 1, 0, 'F', '0', '0', 'system:user:query', '#');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon)
VALUES (101, '用户新增', 2, 2, '', '', 1, 0, 'F', '0', '0', 'system:user:add', '#');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon)
VALUES (102, '用户修改', 2, 3, '', '', 1, 0, 'F', '0', '0', 'system:user:edit', '#');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon)
VALUES (103, '用户删除', 2, 4, '', '', 1, 0, 'F', '0', '0', 'system:user:remove', '#');

-- 角色按钮权限
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon)
VALUES (200, '角色查询', 3, 1, '', '', 1, 0, 'F', '0', '0', 'system:role:query', '#');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon)
VALUES (201, '角色新增', 3, 2, '', '', 1, 0, 'F', '0', '0', 'system:role:add', '#');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon)
VALUES (202, '角色修改', 3, 3, '', '', 1, 0, 'F', '0', '0', 'system:role:edit', '#');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon)
VALUES (203, '角色删除', 3, 4, '', '', 1, 0, 'F', '0', '0', 'system:role:remove', '#');

-- 部门按钮权限
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon)
VALUES (300, '部门查询', 4, 1, '', '', 1, 0, 'F', '0', '0', 'system:dept:query', '#');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon)
VALUES (301, '部门新增', 4, 2, '', '', 1, 0, 'F', '0', '0', 'system:dept:add', '#');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon)
VALUES (302, '部门修改', 4, 3, '', '', 1, 0, 'F', '0', '0', 'system:dept:edit', '#');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon)
VALUES (303, '部门删除', 4, 4, '', '', 1, 0, 'F', '0', '0', 'system:dept:remove', '#');

-- 初始化角色数据
INSERT INTO sys_role (role_id, role_name, role_key, role_sort, status, remark, create_by)
VALUES (1, '管理员', 'admin', 1, '0', '超级管理员', 1);

INSERT INTO sys_role (role_id, role_name, role_key, role_sort, status, remark, create_by)
VALUES (2, '测试人员', 'test', 2, '0', '测试人员', 1);

INSERT INTO sys_role (role_id, role_name, role_key, role_sort, status, remark, create_by)
VALUES (3, '开发人员', 'dev', 3, '0', '开发人员', 1);

INSERT INTO sys_role (role_id, role_name, role_key, role_sort, status, remark, create_by)
VALUES (4, '项目经理', 'pm', 4, '0', '项目经理', 1);

INSERT INTO sys_role (role_id, role_name, role_key, role_sort, status, remark, create_by)
VALUES (5, '市场人员', 'market', 5, '0', '市场人员', 1);

-- 初始化用户数据 - 默认密码为123456的MD5加密
INSERT INTO sys_user (user_id, username, nickname, password, dept_id, phone, email, status, create_by)
VALUES (1, 'admin', '管理员', 'e10adc3949ba59abbe56e057f20f883e', 1, '13800138000', 'admin@example.com', '0', 1);

INSERT INTO sys_user (user_id, username, nickname, password, dept_id, phone, email, status, create_by)
VALUES (2, 'test', '测试用户', 'e10adc3949ba59abbe56e057f20f883e', 2, '13800138001', 'test@example.com', '0', 1);

INSERT INTO sys_user (user_id, username, nickname, password, dept_id, phone, email, status, create_by)
VALUES (3, 'dev', '开发用户', 'e10adc3949ba59abbe56e057f20f883e', 5, '13800138002', 'dev@example.com', '1', 1);

INSERT INTO sys_user (user_id, username, nickname, password, dept_id, phone, email, status, create_by)
VALUES (4, 'pm', '项目经理', 'e10adc3949ba59abbe56e057f20f883e', 6, '13800138003', 'pm@example.com', '0', 1);

INSERT INTO sys_user (user_id, username, nickname, password, dept_id, phone, email, status, create_by)
VALUES (5, 'marketing', '市场专员', 'e10adc3949ba59abbe56e057f20f883e', 7, '13800138004', 'marketing@example.com', '0', 1);

-- 用户角色关联数据
INSERT INTO sys_user_role (user_id, role_id) VALUES (1, 1);
INSERT INTO sys_user_role (user_id, role_id) VALUES (2, 2);
INSERT INTO sys_user_role (user_id, role_id) VALUES (3, 3);
INSERT INTO sys_user_role (user_id, role_id) VALUES (4, 4);
INSERT INTO sys_user_role (user_id, role_id) VALUES (5, 5);

-- 角色菜单关联数据
-- 管理员角色拥有所有菜单权限
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 1);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 2);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 3);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 4);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 100);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 101);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 102);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 103);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 200);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 201);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 202);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 203);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 300);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 301);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 302);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (1, 303);

-- 测试人员角色拥有用户管理和部分角色管理权限
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (2, 1);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (2, 2);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (2, 3);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (2, 100);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (2, 200);

-- 开发人员角色拥有用户管理和角色管理权限
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (3, 1);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (3, 2);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (3, 3);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (3, 100);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (3, 101);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (3, 102);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (3, 200);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (3, 201);
INSERT INTO sys_role_menu (role_id, menu_id) VALUES (3, 202);

-- 用户数据权限
-- 管理员可访问所有部门数据
INSERT INTO sys_user_data_scope (user_id, dept_id) VALUES (1, 1);
INSERT INTO sys_user_data_scope (user_id, dept_id) VALUES (1, 2);
INSERT INTO sys_user_data_scope (user_id, dept_id) VALUES (1, 3);
INSERT INTO sys_user_data_scope (user_id, dept_id) VALUES (1, 4);
INSERT INTO sys_user_data_scope (user_id, dept_id) VALUES (1, 5);
INSERT INTO sys_user_data_scope (user_id, dept_id) VALUES (1, 6);
INSERT INTO sys_user_data_scope (user_id, dept_id) VALUES (1, 7);
INSERT INTO sys_user_data_scope (user_id, dept_id) VALUES (1, 8);

-- 测试人员可访问研发部门数据
INSERT INTO sys_user_data_scope (user_id, dept_id) VALUES (2, 2);

-- 开发人员可访问前端组数据
INSERT INTO sys_user_data_scope (user_id, dept_id) VALUES (3, 5);

-- 项目经理可访问后端组和前端组数据
INSERT INTO sys_user_data_scope (user_id, dept_id) VALUES (4, 5);
INSERT INTO sys_user_data_scope (user_id, dept_id) VALUES (4, 6); 