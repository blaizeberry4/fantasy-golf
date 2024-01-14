export const parseScore = (score: string | null | undefined): number | null => {
    if (score === null || score === undefined) {
        return null
    }

    if (score === 'E') {
        return 0
    }

    return parseInt(score)
}

export const presentScore = ( score: number | null | undefined ): string | null => {
    if (score === null || score === undefined) {
        return null
    }

    if (score === 0) {
        return 'E'
    }

    return score > 0 ? '+' + score.toString() : score.toString()
}

export const parseThru = (thru: string | null | undefined): number => {
    if (thru === null || thru === undefined) {
        return 0
    }

    if (thru === 'F' || thru === 'CUT' || thru === 'WD' || thru === 'DQ' || thru === 'F*' || thru === '-') {
        return 18
    }

    if (thru === '-') {
        return 0
    }

    return parseInt(thru.replace('*', ''))
}