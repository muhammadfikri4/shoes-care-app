import { ListItem } from "./DropdownRevamp";

export const dataFetching = (
  isFetching: boolean,
  data: ListItem[]
): ListItem[] => {
  if (isFetching) {
    return [
      {
        label: "Loading...",
        value: "",
      },
    ];
  }

  if (!data.length) {
    return [
      {
        label: "No Data",
        value: "",
      },
    ];
  }
  return data as ListItem[];
};
