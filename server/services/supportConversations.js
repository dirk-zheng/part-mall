const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const STORE_FILE = process.env.SUPPORT_CONVERSATIONS_FILE
  ? path.resolve(process.env.SUPPORT_CONVERSATIONS_FILE)
  : path.join(__dirname, '..', 'data', 'support-conversations.json');

function emptyStore() {
  return { conversations: [], messages: [] };
}

function readStore() {
  if (!fs.existsSync(STORE_FILE)) return emptyStore();
  try {
    const parsed = JSON.parse(fs.readFileSync(STORE_FILE, 'utf-8'));
    return {
      conversations: Array.isArray(parsed.conversations) ? parsed.conversations : [],
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
    };
  } catch (error) {
    throw new Error(`Unable to read support conversations: ${error.message}`);
  }
}

function writeStore(store) {
  const temporaryFile = `${STORE_FILE}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(store, null, 2), 'utf-8');
  fs.renameSync(temporaryFile, STORE_FILE);
}

function publicConversation(conversation) {
  if (!conversation) return null;
  return { ...conversation };
}

function findActiveCustomerConversation(store, customerId) {
  return store.conversations
    .filter((item) => item.customerId === customerId && item.status !== 'closed')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] || null;
}

function createConversation(customer) {
  const store = readStore();
  let conversation = findActiveCustomerConversation(store, customer.id);
  if (conversation) {
    return { conversation: publicConversation(conversation), messages: listMessages(store, conversation.id) };
  }

  const now = new Date().toISOString();
  conversation = {
    id: uuidv4(),
    customerId: customer.id,
    customerName: customer.name || customer.username,
    customerUsername: customer.username,
    status: 'bot_active',
    assignedTo: null,
    assignedName: null,
    claimedBy: null,
    priority: 'normal',
    botEnabled: true,
    lastMessage: '',
    lastMessageAt: now,
    createdAt: now,
    updatedAt: now,
    resolvedAt: null,
  };
  store.conversations.push(conversation);
  appendMessageToStore(store, conversation, {
    senderType: 'bot',
    senderId: 'bot',
    senderName: 'Miss Lin · AI Assistant',
    content: 'Welcome to Driveline Wheels. Tell us your market, popular vehicle models and target wheel styles. I can help first, or you can request a sales representative at any time.',
  });
  writeStore(store);
  return { conversation: publicConversation(conversation), messages: listMessages(store, conversation.id) };
}

function listMessages(store, conversationId) {
  return store.messages
    .filter((message) => message.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-200);
}

function appendMessageToStore(store, conversation, input) {
  const now = new Date().toISOString();
  const message = {
    id: uuidv4(),
    conversationId: conversation.id,
    senderType: input.senderType,
    senderId: input.senderId,
    senderName: input.senderName,
    content: String(input.content || '').trim(),
    internalNote: Boolean(input.internalNote),
    createdAt: now,
    readAt: null,
  };
  store.messages.push(message);
  conversation.lastMessage = message.content.slice(0, 120);
  conversation.lastMessageAt = now;
  conversation.updatedAt = now;
  return message;
}

function updateConversation(conversationId, updater) {
  const store = readStore();
  const conversation = store.conversations.find((item) => item.id === conversationId);
  if (!conversation) throw new Error('Conversation not found');
  const result = updater({ store, conversation, appendMessage: (message) => appendMessageToStore(store, conversation, message) });
  conversation.updatedAt = new Date().toISOString();
  writeStore(store);
  return { conversation: publicConversation(conversation), result };
}

function getConversation(conversationId) {
  const store = readStore();
  const conversation = store.conversations.find((item) => item.id === conversationId);
  if (!conversation) throw new Error('Conversation not found');
  return { conversation: publicConversation(conversation), messages: listMessages(store, conversationId) };
}

function getCustomerConversation(customer) {
  return createConversation(customer);
}

function listConversations() {
  return readStore().conversations
    .map(publicConversation)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

module.exports = {
  getCustomerConversation,
  getConversation,
  listConversations,
  updateConversation,
};
