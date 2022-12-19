export const NumToFormatStr = (num) => String(num).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
