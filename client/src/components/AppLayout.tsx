import { Outlet } from "react-router-dom";
import { LeftMenu } from "./LeftMenu";

export function AppLayout() {
  return (
    <div className="app-home">
      <LeftMenu />
      <div className="app-main-wrap">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
