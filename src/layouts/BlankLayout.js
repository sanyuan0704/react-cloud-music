import React from "react";
import { renderRoutes } from "react-router-config";

const Layout = ({ route }) => <>{renderRoutes(route.routes)}</>;

export default Layout;
