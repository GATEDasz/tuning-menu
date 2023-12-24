import React, {
  Context,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";
import { isEnvBrowser } from "../utils/misc";
import { debugData } from "../utils/debugData";

const VisibilityCtx = createContext<VisibilityProviderValue | null>(null);

interface VisibilityProviderValue {
  setVisible: (visible: boolean) => void;
  setFocus: (focus: boolean) => void;
  visible: boolean;
  focus: boolean;
}

// This should be mounted at the top level of your application, it is currently set to
// apply a CSS visibility value. If this is non-performant, this should be customized.
export const VisibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [focus, setFocus] = useState(false);

  useNuiEvent<boolean>("setVisible", setVisible);
  useNuiEvent<boolean>("setFocus", setFocus);
  debugData([
    {
      action: "setVisible",
      data: {
        visible: true,
      },
    },
  ]);

  // Handle pressing escape/backspace
  useEffect(() => {
    // Only attach listener when we are visible
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (!visible) return;
      if (e.code === "ControlLeft") {
        if (visible && !isEnvBrowser()) {
          fetchNui("setFocus");
          console.log("Sent setFocus event");
        }
      }
      if (["Escape"].includes(e.code)) {
        if (!isEnvBrowser()) {
          fetchNui("hideFrame");
          console.log("Sent hideFrame event");
        } else {
          setVisible(!visible);
        }
      }
    };

    if (visible) {
      window.addEventListener("keydown", keyHandler);
    } else {
      window.removeEventListener("keydown", keyHandler);
    }

    return () => window.removeEventListener("keydown", keyHandler);
  }, [visible]);

  return (
    <VisibilityCtx.Provider
      value={{
        visible,
        focus,
        setVisible,
        setFocus,
      }}
    >
      <div
        style={{ visibility: visible ? "visible" : "hidden", height: "100%" }}
      >
        {children}
      </div>
    </VisibilityCtx.Provider>
  );
};

export const useVisibility = () =>
  useContext<VisibilityProviderValue>(
    VisibilityCtx as Context<VisibilityProviderValue>,
  );
