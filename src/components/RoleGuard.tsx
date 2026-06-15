"use client";

import { useAuth, UserRole } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!profile || !allowedRoles.includes(profile.role))) {
            router.push("/login");
        }
    }, [profile, loading, allowedRoles, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!profile || !allowedRoles.includes(profile.role)) {
        return null;
    }

    return <>{children}</>;
}
