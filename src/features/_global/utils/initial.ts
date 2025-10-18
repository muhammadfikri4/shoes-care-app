export function initial(name: string) {
    if (!name) return '';
    const splitName = name.split(' ');
    const initial: string[] = [];
    splitName.forEach(e => {
      if (initial.length > 1) return;
      initial.push(e[0]);
    });
    const init = initial.join('').toUpperCase();
    return `${init?.[0] || '?'}${init?.[1] || ''}`
  }