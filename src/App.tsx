import React from "react";

import {
    Refine,
    LegacyAuthProvider as AuthProvider,
} from "@refinedev/core";
import {
    notificationProvider,
    RefineSnackbarProvider,
    ReadyPage,
    ErrorComponent,
} from "@refinedev/mui";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";

import InventoryIcon from '@mui/icons-material/Inventory';
import WebStoriesIcon from '@mui/icons-material/WebStories';
import ReceiptIcon from '@mui/icons-material/Receipt';

import dataProvider from "@refinedev/simple-rest";
import routerProvider from "@refinedev/react-router-v6/legacy";
import axios, { AxiosRequestConfig } from "axios";
import { Title, Sider, Layout, Header } from "components/layout";
import { ColorModeContextProvider } from "contexts";
import { CredentialResponse } from "interfaces/google";
import { parseJwt } from "utils/parse-jwt";

import {
    Login,
    Home,
} from "pages";

import { FebestList, FebestEdit, FebestCreate } from "./pages/febest";
import { AutoplusList, AutoplusEdit, AutoplusCreate } from "./pages/autoplus";
import { LogList } from "./pages/logs";
import {OrderList} from "./pages/orders";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (request.headers) {
        request.headers["Authorization"] = `Bearer ${token}`;
    } else {
        request.headers = {
            Authorization: `Bearer ${token}`,
        };
    }

    return request;
});

function App() {
    const authProvider: AuthProvider = {
        login: async ({ credential }: CredentialResponse) => {
            const profileObj = credential ? parseJwt(credential) : null;

            if (profileObj) {
                const response = await fetch(
                    "/api/v1/users",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: profileObj.name,
                            email: profileObj.email,
                            avatar: profileObj.picture,
                        }),
                    },
                );

                const data = await response.json();

                if (response.status === 200) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify({
                            ...profileObj,
                            avatar: profileObj.picture,
                            userid: data._id,
                        }),
                    );
                } else {
                    return Promise.reject();
                }
            }
            localStorage.setItem("token", `${credential}`);

            return Promise.resolve();
        },
        logout: () => {
            const token = localStorage.getItem("token");

            if (token && typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                axios.defaults.headers.common = {};
                window.google?.accounts.id.revoke(token, () => {
                    return Promise.resolve();
                });
            }

            return Promise.resolve();
        },
        checkError: () => Promise.resolve(),
        checkAuth: async () => {
            const token = localStorage.getItem("token");

            if (token) {
                return Promise.resolve();
            }
            return Promise.reject();
        },

        getPermissions: async () => null,
        getUserIdentity: async () => {
            const user = localStorage.getItem("user");
            if (user) {
                return Promise.resolve(JSON.parse(user));
            }
        },
    };

    return (
        <ColorModeContextProvider>
            <CssBaseline />
            <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
            <RefineSnackbarProvider>
                <Refine
                    dataProvider={dataProvider("http://localhost:8000/api/v1")}
                    notificationProvider={notificationProvider}
                    ReadyPage={ReadyPage}
                    catchAll={<ErrorComponent />}
                    resources={[
                        {
                            name: "Febest",
                            list: FebestList,
                            create: FebestCreate,
                            edit: FebestEdit,
                            icon: <InventoryIcon/>,
                        },
                        {
                            name: "Autoplus",
                            list: AutoplusList,
                            create: AutoplusCreate,
                            edit: AutoplusEdit,
                            icon: <InventoryIcon/>,
                        },
                        {
                            name: "Orders",
                            list: OrderList,
                            icon: <ReceiptIcon/>,
                        },
                        {
                            name: "Logs",
                            list: LogList,
                            icon: <WebStoriesIcon/>,
                        },
                    ]}
                    Title={Title}
                    Sider={Sider}
                    Layout={Layout}
                    Header={Header}
                    legacyRouterProvider={routerProvider}
                    legacyAuthProvider={authProvider}
                    LoginPage={Login}
                    DashboardPage={Home}
                />
            </RefineSnackbarProvider>
        </ColorModeContextProvider>
    );
}

export default App;
