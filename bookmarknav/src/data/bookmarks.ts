import { useEffect, useState } from "react";
import importbookmarks from "./bookmark.json" assert { type: "json" };

export type Bookmark = {
    id: string;
    text: string;
    href: string;
    icon: string;
    tags: string[];
}

const getUniqueId = () => {
    return Math.random().toString(36).substring(2, 9);
}

const getUniqueTags = (bookmarks: Bookmark[]) => {
    let tags: string[] = bookmarks.map(item => item.tags).flat()
    tags = [...new Set(tags)];
    tags = tags.map((tag: string) => tag.toLowerCase());

    // count tags 
    let countedtags = tags.map((tag: string) => {
        const count = bookmarks.filter((bookmark: Bookmark) => bookmark.tags.includes(tag)).length;
        return {
            tag: tag,
            count: count
        };
    }
    );

    // sort tags by count
    countedtags = countedtags.sort((a: any, b: any) => {
        return b.count - a.count;
    });

    return countedtags;
}

export default function useBookmarks() {
    let _bookmarks = importbookmarks.map((bookmark: any) => {
        bookmark.id = getUniqueId();
        bookmark.tags = bookmark.tags.map((tag: string) => tag.toLowerCase());
        return bookmark as Bookmark;
    })

    const tags = getUniqueTags(_bookmarks);

    const [bookmarks, setBookmarks] = useState<Bookmark[]>(_bookmarks);
    const [tag, setTag] = useState<string>("");
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        const filteredBookmarks = _bookmarks.filter((bookmark: Bookmark) => {
            const tagMatch = tag ? bookmark.tags.includes(tag.toLowerCase()) : true;
            const searchMatch = search ? bookmark.text.toLowerCase().includes(search.toLowerCase()) : true;
            return tagMatch && searchMatch;
        });
        setBookmarks(filteredBookmarks);
    }, [tag, search]);

    return {
        bookmarks,
        tags,
        tag,
        setTag,
        search,
        setSearch
    }
}