import { RouterProvider } from "react-router-dom";
import { router } from "./Router";

import { AdminProvider } from "./contexts/AdminContext";

function App() {
  return (
    <AdminProvider>
      <RouterProvider router={router} />
    </AdminProvider>
  );
}

export default App;
