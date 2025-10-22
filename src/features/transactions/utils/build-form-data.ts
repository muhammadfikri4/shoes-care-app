import { TransactionCreationDTO } from "../../../core/model/transaction";

export const buildFormData = (data: TransactionCreationDTO) => {
  const formData = new FormData();
  formData.append("customerEmail", data.customerEmail);
  formData.append("customerName", data.customerName);
  formData.append("customerPhone", data.customerPhone);
  formData.append("paymentMethod", data.paymentMethod);
  formData.append("usePromo", String(data.usePromo));
  formData.append("promoCode", data.promoCode);
  formData.append("cashPaid", String(data.cashPaid));
  data.items.forEach((it, i) => {
    formData.append(`items[${i}][name]`, it.name);
    formData.append(`items[${i}][price]`, String(it.price));
    formData.append(`items[${i}][estimateDay]`, String(it.estimateDay));
    if (it.note) formData.append(`items[${i}][note]`, it.note);
    if (it.file) formData.append(`items[${i}][file]`, it.file);
  });

  return formData;
};
