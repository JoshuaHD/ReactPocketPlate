import { Link } from "@tanstack/react-router";
import React from "react";

export default function TanstackLink ({to, className, children}: {to: string, className?: string, children: React.ReactNode}) {
    
    return <Link to={to} className={className}>{children}</Link>
}