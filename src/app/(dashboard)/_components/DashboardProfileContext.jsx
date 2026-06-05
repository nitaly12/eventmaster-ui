"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiGet } from "@/lib/client-api";
import { getDefaultSession } from "@/lib/authSession";

const DashboardProfileContext = createContext({
  user: getDefaultSession(),
  ready: false,
});

export function DashboardProfileProvider({ children }) {
  const [user, setUser] = useState(getDefaultSession());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      apiGet("/api/user-profile")
        .then((profile) => {
          setUser({
            name: profile.name,
            email: profile.email,
            avatar: profile.avatar ?? "/images/Ellipse 44.png",
          });
        })
        .catch(() => {
          setUser(getDefaultSession());
        })
        .finally(() => setReady(true));
    };

    loadUser();
    window.addEventListener("user-profile-updated", loadUser);
    return () => window.removeEventListener("user-profile-updated", loadUser);
  }, []);

  return (
    <DashboardProfileContext.Provider value={{ user, ready }}>
      {children}
    </DashboardProfileContext.Provider>
  );
}

export function useDashboardProfile() {
  return useContext(DashboardProfileContext);
}
