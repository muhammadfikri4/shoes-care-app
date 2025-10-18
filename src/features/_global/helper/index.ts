export const convertQueryParamsToObject = <T= Record<string, string>>(
    queryParams: string
): T => {
    const query = new URLSearchParams(queryParams);
    const object: Record<string, string> = {};
    for (const [key, value] of query) {
        object[key] = value;
    }
    return object as T;
}

export const convertObjectToQueryParams = (object?: Record<string, string | number | null | undefined>): string => {
    if (!object || typeof object !== 'object' || Array.isArray(object)) {
        return '';
    }

    const query = new URLSearchParams();
    Object.keys(object).forEach(key => {
        const value = object[key];
        if (typeof value === 'string' || typeof value === 'number') {
            query.append(key, value.toString());
        }
    });

    return query.toString();
}

export const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
    }).format(number);
};

export const FormatIDTime = (date: Date) => {
    const dates = new Date(date);
    // const format = dates.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
    // return format
    const timezoneOffset = 7 * 60; // 7 hours converted to minutes
    const localDate = new Date(dates.getTime() + timezoneOffset * 60 * 1000);

    // Convert to ISO string without affecting the timezone
    const isoString = localDate.toISOString()
    return isoString
}

export function formatSize(size: number): string {
    if (size < 1024) {
      return `${size} bytes`;
    } else if (size < 1048576) {
      return `${(size / 1024).toFixed(2)}KB`;
    } else if (size < 1073741824) {
      return `${(size / 1048576).toFixed(2)}MB`;
    } else {
      return `${(size / 1073741824).toFixed(2)}GB`;
    }
  }