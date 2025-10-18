import { convertQueryParamsToObject } from "@features/_global/helper";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import { ButtonHTMLAttributes, PropsWithChildren, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Pagination } from "../Pagination";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {}

interface IPageLayoutProps extends PropsWithChildren {
  children?: React.ReactNode;
  title?: string;
  showPagination?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  action?: {
    buttonProps?: ButtonProps;
    buttonTitle?: string;
    show?: boolean;
    link?: {
      to?: string;
    };
    colorButton?: string;
  };
  headBackground?: string;
  searchField?: boolean;
  searchPlaceholder?: string;
}

export const PageLayout: React.FC<IPageLayoutProps> = ({
  children,
  pagination = { currentPage: 1, totalPages: 1, onPageChange: () => {} },
  showPagination,
  title,
  action,
  headBackground = "gray",
  searchField = false,
  searchPlaceholder = "search kambing..",
}) => {
  const renderAction = () => {
    if (action?.show && action.link) {
      return (
        <Link to={action.link.to as string}>
          <Button
            {...action?.buttonProps}
            size="sm"
            color={action?.colorButton || "blue"}
            variant="gradient"
          >
            {action?.buttonTitle}
          </Button>
        </Link>
      );
    }

    if (action?.show) {
      return (
        <Button
          {...action?.buttonProps}
          size="sm"
          color={action?.colorButton || "blue"}
          variant="gradient"
        >
          {action?.buttonTitle}
        </Button>
      );
    }
    return null;
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = convertQueryParamsToObject(searchParams.toString());

  const handeSearchChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        setSearchParams({ ...queryParams, search: e.target.value });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [searchField, searchParams]
    );

  return (
    <div>
      <Card>
        <CardHeader
          variant="gradient"
          color={headBackground}
          className="mb-4 p-6 flex justify-between items-center flex-wrap"
        >
          {title && (
            <Typography variant="h6" color="white">
              {title}
            </Typography>
          )}
          <div className="md:mt-0 mt-4">
          {renderAction()}
          </div>
        </CardHeader>
        {searchField && (
          <div className="w-72 ms-auto mx-4">
            <Input
              onChange={handeSearchChange}
              placeholder={searchPlaceholder}
              label="Search"
              // className="bg-transparent text-gray-800 p-1.5 w-full border border-solid border-black duration-200 outline-none rounded-md focus:outline focus:outline-gray-600"
            />
          </div>
        )}
        <CardBody className="overflow-x-auto px-4 py-2">
          <>{children}</>
        </CardBody>
      </Card>
      {showPagination && <Pagination {...pagination} />}
    </div>
  );
};
