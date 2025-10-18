export const storage = {
    get: <T = string>(key: string) => localStorage.getItem(key) as T,
    set: <T = string>(key: string, value: T) => localStorage.setItem(key, value as string),
    delete: <T = string>(key: string, value: T) => localStorage.setItem(key, value as string),
}