const formatDateForInput = (): string => {
  const today = new Date();
  const oneMonthLater = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const year = oneMonthLater.getFullYear();
  const month = (oneMonthLater.getMonth() + 1).toString().padStart(2, "0");
  const day = oneMonthLater.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}T23:59:59`;
};
export default formatDateForInput;
