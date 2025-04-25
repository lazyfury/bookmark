
import type { Bookmark } from "../data/bookmarks";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
export function LinkCard({ link }: { link: Bookmark }) {
    const icon = link.icon ? link.icon : "https://www.google.com/s2/favicons?domain=" + link.href;
    const text = link.text ? link.text : link.href;
    const host = new URL(link.href).host;
    const cutUrl = link.href.length > 72 ? link.href.slice(0, 30) + "..." : link.href;
    const cutText = text.length > 72 ? text.slice(0, 30) + "..." : text;
    return (
        <Card className=" flex flex-row gap-1 items-start p-2 transition duration-200 ease-in-out" style={{'boxShadow':'0 0 0px rgba(0,0,0,0.1)'}}>
            <img src={icon} width={16} height={16} className="mr-1 w-5 h-5" />
            <div className="flex flex-col flex-grow">
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-500">
                    {cutText}
                </a>
                <span className="text-xs" style={{'whiteSpace':'wrap','wordBreak':'break-all'}}> {cutUrl}</span>
                <a href={'//' + host} target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-400">
                    @{host}
                </a>

                <div>
                    {link.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-gray-500 mr-1 mt-1">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>
        </Card>
    );
}

