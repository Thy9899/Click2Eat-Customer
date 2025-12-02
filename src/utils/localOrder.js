const LAST_ORDER_KEY = "lastOrder";

export const saveLastOrderToLocal = (order) => {
  const data = {
    order,
    timestamp: new Date().getTime(),
  };
  localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(data));
};

export const loadLastOrderFromLocal = () => {
  const data = JSON.parse(localStorage.getItem(LAST_ORDER_KEY));
  if (!data) return null;

  const now = new Date().getTime();
  const oneHour = 60 * 60 * 1000;

  if (now - data.timestamp > oneHour) {
    localStorage.removeItem(LAST_ORDER_KEY);
    return null;
  }

  return data.order;
};

export const removeLastOrderFromLocal = () => {
  localStorage.removeItem(LAST_ORDER_KEY);
};
