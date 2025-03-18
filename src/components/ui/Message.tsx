import { Card, CardContent } from "./card.js"

type Message = {
    className?: string,
    type:  "error" | "warning" | "info" | "success" | "message",
    children: React.ReactNode,
    standalone?: boolean,
}
export function Message ({type, children, className, standalone}: Message) {
    const typeStyles = {
        message: "message bg-message text-message",
        info: "info bg-info text-info",
        success: "success bg-success text-success",
        warning: "warning bg-warning text-warning",
        error: "error bg-error text-error",
    };

    const style = typeStyles[type ?? "message"]; // Fallback to default

    return (
        <Card className={`m-1 ${standalone && "w-96 mx-auto my-24"} ${style} ${className??""}`}>
            <CardContent>{children}</CardContent>
        </Card>
    );
}