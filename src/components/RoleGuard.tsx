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
            <div className="flex min-h-screen items-center justify-center bg-[#070a07]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-9 w-9 animate-spin text-amber-400" />
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-400/80">Authenticating Access...</p>
                </div>
            </div>
        );
    }

    if (!profile || !allowedRoles.includes(profile.role)) {
        return null;
    }

    return <>{children}</>;
}
