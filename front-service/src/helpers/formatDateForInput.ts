const formatDateForInput = (dateString: Date | false): string => {
  if (dateString) {
    dateString = new Date(dateString);
    const year = dateString.getFullYear();
    const month = (dateString.getMonth() + 1).toString().padStart(2, "0"); // getMonth() est basé sur 0, donc +1
    const day = dateString.getDate().toString().padStart(2, "0");
    const hour = dateString.getHours().toString().padStart(2, "0");
    const minute = dateString.getMinutes().toString().padStart(2, "0");
    const second = dateString.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  } else {
    const today = new Date();
    const oneMonthLater = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const year = oneMonthLater.getFullYear();
    const month = (oneMonthLater.getMonth() + 1).toString().padStart(2, "0");
    const day = oneMonthLater.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}T00:00:00`;
  }
};
export default formatDateForInput;
