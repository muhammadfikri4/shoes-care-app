import LogoHIMTILoader from "@core/assets/loader/HIMTI.svg";

interface SimpleLoadingProps {
  ColSpan?: number;
  isTable?: boolean;
}

export const SimpleLoadingTable: React.FC<SimpleLoadingProps> = ({
  ColSpan,
  isTable = true,
}) => {
  return (
    <>
      {isTable ? (
        <tr>
          <td colSpan={ColSpan}>
            <div className="flex items-center justify-center py-10 w-full">
              <img
                className="h-full w-[100px] object-cover"
                src={LogoHIMTILoader}
                alt="Loading..."
              />
            </div>
          </td>
        </tr>
      ) : (
        <div className="flex items-center justify-center py-10 w-full">
          <img
            className="h-full w-[100px] object-cover"
            src={LogoHIMTILoader}
            alt="Loading..."
          />
        </div>
      )}
    </>
  );
};
