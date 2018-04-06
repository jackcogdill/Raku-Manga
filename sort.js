const numCompare = (a, b) => {
    const normal = (c, d) => {
        if (c < d) return -1;
        if (c > d) return 1;
        return 0;
    };

    // Find index of first different character
    const len = Math.min(a.length, b.length);
    let i = 0;
    while (i < len && a[i] === b[i]) i += 1;
    if (i === len) return a.length - b.length; // Sort by length

    // Sort by number
    const findNum = s => s.slice(i).match(/^\d+/);
    const ma = findNum(a);
    const mb = findNum(b);
    if (ma === null || mb === null) {
        return normal(a, b); // Could not find number
    }

    // Cast matches
    const na = Number(ma[0]);
    const nb = Number(mb[0]);
    return na - nb;
};

module.exports = { numCompare };
