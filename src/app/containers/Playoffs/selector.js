export const westSelector = series => {
    const west = series.filter(serie => serie.confName === 'West')
    const first = west.filter(serie => serie.roundNum === '1')
    const second = west.filter(serie => serie.roundNum === '2')
    const final = west.filter(serie => serie.roundNum === '3')
    return {
        first: first.length === 0 ? [] : first,
        second: second.length === 0 ? [] : second,
        final: final.length === 0 ? [] : final,
    }
}

export const eastSelector = series => {
    const east = series.filter(serie => serie.confName === 'East')
    const first = east.filter(serie => serie.roundNum === '1')
    const second = east.filter(serie => serie.roundNum === '2')
    const final = east.filter(serie => serie.roundNum === '3')
    return {
        first: first.length === 0 ? [] : first,
        second: second.length === 0 ? [] : second,
        final: final.length === 0 ? [] : final,
    }
}

export const finalSelector = series => {
    const final = series.find(serie => serie.roundNum === '4')
    if (final) {
        return [final]
    } else {
        return []
    }
}
