-- Driveline Wheels MySQL database schema
-- MySQL version: 8.0+
-- Design rule: every business table contains only one business ID and one JSON data column.

CREATE DATABASE IF NOT EXISTS `part_mall`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE `part_mall`;

-- 普通用户、销售员与管理员账号
-- user_data: username, password, role(user|seller|admin), name, createdAt, updatedAt
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` VARCHAR(191) NOT NULL,
  `user_data` JSON NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB;

-- 商品、库存及商品展示信息
-- product_data: name, category, price, stock, image, description, createdAt, updatedAt
CREATE TABLE IF NOT EXISTS `products` (
  `product_id` VARCHAR(191) NOT NULL,
  `product_data` JSON NOT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB;

-- 用户购物车；直接使用 user_id，做到每个用户一条购物车记录
-- cart_data: userId, items[{ productId, quantity }], updatedAt
CREATE TABLE IF NOT EXISTS `carts` (
  `user_id` VARCHAR(191) NOT NULL,
  `cart_data` JSON NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB;

-- 用户混装/混柜清单； 直接使用 user_id
-- mixed_load_data: items[{ productId, quantity }], updatedAt
CREATE TABLE IF NOT EXISTS `mixed_loads` (
  `user_id` VARCHAR(191) NOT NULL,
  `mixed_load_data` JSON NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB;

-- 公开询价与登录用户询价
-- quote_data: reference, userId, name, company, country, email, phone, productInterest,
--             quantity, message, status, source, createdAt, updatedAt
CREATE TABLE IF NOT EXISTS `quotes` (
  `quote_id` VARCHAR(191) NOT NULL,
  `quote_data` JSON NOT NULL,
  PRIMARY KEY (`quote_id`)
) ENGINE=InnoDB;

-- news-blog 后台文章
-- article_data: title, slug, excerpt, content, authorId, authorName, status, createdAt, updatedAt
CREATE TABLE IF NOT EXISTS `articles` (
  `article_id` VARCHAR(191) NOT NULL,
  `article_data` JSON NOT NULL,
  PRIMARY KEY (`article_id`)
) ENGINE=InnoDB;

-- FAQ 后台内容
-- faq_data: question, answer, category, sortOrder, status, authorId, createdAt, updatedAt
CREATE TABLE IF NOT EXISTS `faqs` (
  `faq_id` VARCHAR(191) NOT NULL,
  `faq_data` JSON NOT NULL,
  PRIMARY KEY (`faq_id`)
) ENGINE=InnoDB;

-- 用户与销售人员的即时聊天房间
-- im_room_data: members[], memberNames{}, lastMessage, updatedAt, createdAt
CREATE TABLE IF NOT EXISTS `im_rooms` (
  `im_room_id` VARCHAR(191) NOT NULL,
  `im_room_data` JSON NOT NULL,
  PRIMARY KEY (`im_room_id`)
) ENGINE=InnoDB;

-- 用户与销售人员的即时聊天消息
-- im_message_data: roomId, senderId, senderName, content, timestamp, readBy[]
CREATE TABLE IF NOT EXISTS `im_messages` (
  `im_message_id` VARCHAR(191) NOT NULL,
  `im_message_data` JSON NOT NULL,
  PRIMARY KEY (`im_message_id`)
) ENGINE=InnoDB;

-- AI 客服问答记录；当前代码未持久化，落库后可用于历史记录和问题分析
-- support_message_data: userId, userMessage, aiReply, matchedKeyword, timestamp
CREATE TABLE IF NOT EXISTS `support_messages` (
  `support_message_id` VARCHAR(191) NOT NULL,
  `support_message_data` JSON NOT NULL,
  PRIMARY KEY (`support_message_id`)
) ENGINE=InnoDB;

-- 机器人与人工共用的客服会话
-- conversation_data: customerId, customerName, status(bot_active|waiting_human|human_active|resolved|closed),
--                    assignedTo, assignedName, priority, botEnabled, lastMessageAt, createdAt, updatedAt, resolvedAt
CREATE TABLE IF NOT EXISTS `support_conversations` (
  `support_conversation_id` VARCHAR(191) NOT NULL,
  `support_conversation_data` JSON NOT NULL,
  PRIMARY KEY (`support_conversation_id`)
) ENGINE=InnoDB;

-- 统一客服消息；机器人、客户、销售员、管理员与系统消息位于同一时间线
-- message_data: conversationId, senderType(customer|bot|seller|admin|system), senderId,
--               senderName, content, internalNote, createdAt, readAt
CREATE TABLE IF NOT EXISTS `support_conversation_messages` (
  `support_conversation_message_id` VARCHAR(191) NOT NULL,
  `support_conversation_message_data` JSON NOT NULL,
  PRIMARY KEY (`support_conversation_message_id`)
) ENGINE=InnoDB;
