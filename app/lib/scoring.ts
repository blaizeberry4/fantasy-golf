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

    return score.toString()
}
