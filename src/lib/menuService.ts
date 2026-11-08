import { db } from "./firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

export interface ItemOverride {
    isAvailable?: boolean; // false = unavailable / out of stock today, true = available
    price?: number;        // custom price for standard / single variant
    variantPrices?: Record<string, number>; // custom price per variant name
    updatedAt?: number;
}

export type MenuOverrides = Record<string, ItemOverride>;

const MENU_CONFIG_COLLECTION = "menu_config";
const DAILY_MENU_DOC = "daily_overrides";
const STORAGE_KEY = "foodnjoy_menu_overrides";

export const menuService = {
    // Read cached overrides from localStorage for instant initial render
    getCachedOverrides(): MenuOverrides {
        if (typeof window === "undefined") return {};
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    },

    // Save to localStorage cache
    setCachedOverrides(overrides: MenuOverrides) {
        if (typeof window === "undefined") return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
            window.dispatchEvent(new CustomEvent("menuOverridesUpdated", { detail: overrides }));
        } catch {}
    },

    // Real-time listener for menu availability and custom prices
    subscribeToOverrides(onUpdate: (overrides: MenuOverrides) => void): () => void {
        // Immediately notify with cached overrides to prevent layout shifts
        const cached = this.getCachedOverrides();
        if (Object.keys(cached).length > 0) {
            onUpdate(cached);
        }

        const docRef = doc(db, MENU_CONFIG_COLLECTION, DAILY_MENU_DOC);

        return onSnapshot(
            docRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = (snapshot.data()?.items || {}) as MenuOverrides;
                    this.setCachedOverrides(data);
                    onUpdate(data);
                } else {
                    onUpdate({});
                }
            },
            (error) => {
                console.warn("Firestore menu overrides listener warning:", error);
                // Fallback to cache if network is slow or offline
                onUpdate(this.getCachedOverrides());
            }
        );
    },

    // Fetch once
    async getOverrides(): Promise<MenuOverrides> {
        try {
            const docRef = doc(db, MENU_CONFIG_COLLECTION, DAILY_MENU_DOC);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                const data = (snapshot.data()?.items || {}) as MenuOverrides;
                this.setCachedOverrides(data);
                return data;
            }
        } catch (e) {
            console.warn("getOverrides failed:", e);
        }
        return this.getCachedOverrides();
    },

    // Set item availability (true = available today, false = unavailable/sold out)
    async setItemAvailability(itemId: string, isAvailable: boolean): Promise<void> {
        const current = await this.getOverrides();
        const updated: MenuOverrides = {
            ...current,
            [itemId]: {
                ...current[itemId],
                isAvailable,
                updatedAt: Date.now()
            }
        };

        this.setCachedOverrides(updated);
        const docRef = doc(db, MENU_CONFIG_COLLECTION, DAILY_MENU_DOC);
        await setDoc(docRef, { items: updated, lastUpdated: Date.now() }, { merge: true });
    },

    // Update item price for a specific variant
    async setItemPrice(itemId: string, variantName: string, newPrice: number): Promise<void> {
        const current = await this.getOverrides();
        const existingItem = current[itemId] || {};
        const existingVariantPrices = existingItem.variantPrices || {};

        const updated: MenuOverrides = {
            ...current,
            [itemId]: {
                ...existingItem,
                price: newPrice,
                variantPrices: {
                    ...existingVariantPrices,
                    [variantName]: newPrice
                },
                updatedAt: Date.now()
            }
        };

        this.setCachedOverrides(updated);
        const docRef = doc(db, MENU_CONFIG_COLLECTION, DAILY_MENU_DOC);
        await setDoc(docRef, { items: updated, lastUpdated: Date.now() }, { merge: true });
    },

    // Bulk set availability (e.g. mark entire category available or unavailable)
    async setBulkAvailability(itemIds: string[], isAvailable: boolean): Promise<void> {
        const current = await this.getOverrides();
        const updated: MenuOverrides = { ...current };
        itemIds.forEach(id => {
            updated[id] = {
                ...updated[id],
                isAvailable,
                updatedAt: Date.now()
            };
        });

        this.setCachedOverrides(updated);
        const docRef = doc(db, MENU_CONFIG_COLLECTION, DAILY_MENU_DOC);
        await setDoc(docRef, { items: updated, lastUpdated: Date.now() }, { merge: true });
    },

    // Reset all overrides back to factory default menu
    async resetAllOverrides(): Promise<void> {
        this.setCachedOverrides({});
        const docRef = doc(db, MENU_CONFIG_COLLECTION, DAILY_MENU_DOC);
        await setDoc(docRef, { items: {}, lastUpdated: Date.now() });
    }
};
