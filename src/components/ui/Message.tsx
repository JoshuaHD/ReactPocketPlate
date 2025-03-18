import { Card, CardContent } from "./card.js"

type Message = {
    className?: string,
    type:  "error" | "warning" | "info" | "success" | "message",
    children: React.ReactNode
}
export function Message ({type, children, className}: Message) {
    const typeStyles = {
        message: "message bg-message text-message",
        info: "info bg-info text-info",
        success: "success bg-success text-success",
        warning: "warning bg-warning text-warning",
        error: "error bg-error text-error",
    };

    const style = typeStyles[type ?? "message"]; // Fallback to default

    return (
        <Card className={`m-1 ${style} ${className??""}`}>
            <CardContent>{children}</CardContent>
        </Card>
    );
}