import axios from 'axios';

// All requests use axios.defaults.baseURL from REACT_APP_BACKEND_URL

export const marketsApi = {
  async list(limit = 20) {
    const { data } = await axios.get('/api/markets/list', { params: { limit } });
    return data.markets;
  },
  async coin(symbol) {
    const { data } = await axios.get(`/api/markets/coin/${symbol}`);
    return data.coin;
  }
};

export const ordersApi = {
  async quote({ symbol, amountUSD, amountSDG }) {
    const { data } = await axios.post('/api/orders/quote', { symbol, amountUSD, amountSDG });
    return data.quote;
  },
  async create({ quoteId, paymentMethod }) {
    const { data } = await axios.post('/api/orders/create', { quoteId, paymentMethod });
    return data.order;
  },
  async confirmPayment({ orderId, reference }) {
    const { data } = await axios.post('/api/orders/confirm-payment', { orderId, reference });
    return data.order;
  },
  async get(orderId) {
    const { data } = await axios.get(`/api/orders/${orderId}`);
    return data.order;
  },
  async transactions() {
    const { data } = await axios.get('/api/transactions');
    return data.transactions;
  }
};

export const inboxApi = {
  async threads() {
    const { data } = await axios.get('/api/inbox/threads');
    return data.threads;
  },
  async createThread({ subject, category }) {
    const form = new FormData();
    form.append('subject', subject);
    form.append('category', category);
    const { data } = await axios.post('/api/inbox/threads', form);
    return data.thread;
  },
  async postMessage({ threadId, text }) {
    const form = new FormData();
    form.append('text', text);
    const { data } = await axios.post(`/api/inbox/threads/${threadId}/messages`, form);
    return data.message;
  }
};

export const kycApi = {
  async submitBasic({ fullName, dob, email, phone }) {
    const form = new FormData();
    form.append('fullName', fullName);
    form.append('dob', dob);
    form.append('email', email);
    form.append('phone', phone);
    const { data } = await axios.post('/api/kyc/submit-basic', form);
    return data;
  },
  async upload({ email, fileType, file }) {
    const form = new FormData();
    form.append('email', email);
    form.append('fileType', fileType);
    form.append('file', file);
    const { data } = await axios.post('/api/kyc/upload', form);
    return data;
  },
  async status(email) {
    const { data } = await axios.get('/api/kyc/status', { params: { email } });
    return data;
  }
};