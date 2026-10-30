export const printItinerary = () => {
  window.print();
};

export const shareTripUrl = (tripId) => {
  const url = `${window.location.origin}/trips/${tripId}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url);
    return true;
  }
  return false;
};
