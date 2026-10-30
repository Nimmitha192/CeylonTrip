export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return 'LKR 0';
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(amount).replace('LKR', 'LKR ');
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDuration = (days) => {
  if (!days) return '1 Day';
  return days === 1 ? '1 Day' : `${days} Days`;
};
