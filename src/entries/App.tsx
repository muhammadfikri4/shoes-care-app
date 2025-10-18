import { queryClient } from "@core/libs/query/query";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "@core/utils/routes";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import "leaflet/dist/leaflet.css";
import 'react-toastify/dist/ReactToastify.css';
import "react-day-picker/style.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <RouterProvider router={router} />
          <ToastContainer />
        </LocalizationProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
