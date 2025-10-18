import { Children, ReactNode } from "react";

interface EachableProps<T> {
  datas?: T[];
  render: (item: T, index: number, list: T[]) => ReactNode;
}

export const Eachable = <T extends object>({
  datas,
  render,
}: EachableProps<T>) => {
  return Children.toArray(datas?.map((e, i, arr) => render(e as T, i, arr)));
};
