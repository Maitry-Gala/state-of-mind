export function extractTweetId(url: string): string {
    return url.match(/status\/(\d+)/)?.[1] ?? "";
}