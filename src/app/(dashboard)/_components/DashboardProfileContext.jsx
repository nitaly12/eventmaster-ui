"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiGet } from "@/lib/client-api";
import { getDefaultSession } from "@/lib/authSession";
import { DEFAULT_PROFILE_AVATAR } from "@/lib/default-avatar";

const DashboardProfileContext = createContext({
  user: getDefaultSession(),
  ready: false,
});

export function DashboardProfileProvider({ children }) {
  const [user, setUser] = useState(getDefaultSession());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      Promise.all([
        apiGet("/api/auth/me"),
        apiGet("/api/user-profile").catch(() => null),
      ])
        .then(([authUser, profile]) => {
          setUser({
            name: authUser.name,
            email: authUser.email,
            avatar: profile?.avatar ?? DEFAULT_PROFILE_AVATAR,
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
