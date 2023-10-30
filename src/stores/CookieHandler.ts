export function getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

export function setCookie(name: string, value: string) {
    document.cookie = `${name}=${encodeURIComponent(value)}`;
}
