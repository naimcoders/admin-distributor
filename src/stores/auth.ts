import {
  Distributor,
  getDistributorApiInfo,
} from "src/api/distributor.service";
import { FbAuth } from "src/firebase";
import { create } from "zustand";

interface authUser {
  user?: Distributor;
  isLoading: boolean;
  setUser: () => void;
}

export const setUser = create<authUser>((set) => ({
  user: undefined,
  isLoading: false,
  setUser: async () => {
    set({
      isLoading: true,
    });
    FbAuth.onAuthStateChanged(
      async (user) => {
        if (user) {
          const distributUser = await getDistributorApiInfo().findById(
            `${user.uid}`
          );
          set({
            user: distributUser,
          });
        }
        set({
          isLoading: false,
        });
      },
      (e) => {
        console.log("Error, : ", JSON.stringify(e));
        set({
          isLoading: false,
        });
      }
    );
  },
}));
