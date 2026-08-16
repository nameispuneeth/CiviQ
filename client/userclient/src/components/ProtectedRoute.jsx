import { Navigate, Outlet, useLocation } from "react-router-dom";

import { getUser } from "../lib/auth";

// Route guard for everything that needs a signed-in citizen. Used as a layout
// route in App.jsx, so a new protected page is one line inside the block rather
// than another copy of the same check.
//
// This decides before rendering. The per-page useEffect checks it replaces ran
// *after* the first paint, so the protected page flashed on screen before the
// redirect fired.
//
// It is not a security boundary — anyone can write a fake token into
// localStorage. The server is what actually enforces this: userRoute.js runs
// jwt.verify before it touches any data.
export default function ProtectedRoute() {
  const location = useLocation();

  if (!getUser()) {
    // `replace` keeps the protected URL out of history, so Back after logging
    // in doesn't bounce the user straight to the login screen again. `from`
    // lets a later change send them where they were originally headed.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
