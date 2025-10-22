import { TransactionCreationDTO } from "../../../core/model/transaction";

export const defaultValue: TransactionCreationDTO = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  paymentMethod: "QRIS",
  usePromo: false,
  cashPaid: 0,
  promoCode: "",
  items: [
    {
      rack: { id: "", name: "" },
      name: "",
      price: 0,
      estimateDay: 0,
      file: undefined,
      note: undefined,
    },
  ],
};
