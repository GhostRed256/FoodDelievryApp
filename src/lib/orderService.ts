import { db } from "./firebase";
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
    query,
    where,
    onSnapshot,
    orderBy,
    Timestamp
} from "firebase/firestore";

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "picked_up" | "delivered" | "cancelled";

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    customerId: string;
    customerName: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    cookId?: string;
    deliveryId?: string;
    deliveryLocation?: {
        lat: number;
        lng: number;
    };
    customerLocation?: {
        lat: number;
        lng: number;
        address: string;
    };
}

const ORDERS_COLLECTION = "orders";

export const orderService = {
    // Create a new order
    async createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) {
        return await addDoc(collection(db, ORDERS_COLLECTION), {
            ...orderData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    },

    // Update order status
    async updateOrderStatus(orderId: string, status: OrderStatus, additionalData: Partial<Order> = {}) {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId);
        await updateDoc(orderRef, {
            status,
            ...additionalData,
            updatedAt: serverTimestamp(),
        });
    },

    // Update delivery location (for live tracking)
    async updateDeliveryLocation(orderId: string, lat: number, lng: number) {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId);
        await updateDoc(orderRef, {
            deliveryLocation: { lat, lng },
            updatedAt: serverTimestamp(),
        });
    },

    // Listen to active orders for a specific role/user
    subscribeToOrders(
        filters: { role: "admin" | "cook" | "delivery" | "customer"; uid?: string },
        onUpdate: (orders: Order[]) => void
    ) {
        let q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));

        if (filters.role === "cook") {
            q = query(q, where("status", "in", ["confirmed", "preparing"]));
        } else if (filters.role === "delivery") {
            q = query(q, where("status", "in", ["ready", "picked_up"]));
        } else if (filters.role === "customer" && filters.uid) {
            q = query(q, where("customerId", "==", filters.uid));
        }

        return onSnapshot(q, (snapshot) => {
            const orders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Order));
            onUpdate(orders);
        });
    },

    // Listen to a single order (for tracking page)
    subscribeToOrder(orderId: string, onUpdate: (order: Order) => void) {
        return onSnapshot(doc(db, ORDERS_COLLECTION, orderId), (doc) => {
            if (doc.exists()) {
                onUpdate({ id: doc.id, ...doc.data() } as Order);
            }
        });
    }
};
