export const extractDbLinks = (sql: string): string[] => {
    const links = new Set<string>();
    const re = /@([A-Za-z0-9_#$]+)/g; // matches @MLMT01 / @FOO_2 etc.
    let m: RegExpExecArray | null;
    while ((m = re.exec(sql)) !== null) links.add(m[1]);
    return Array.from(links);
};
