const randomGenerator = (length = 8) => {
    return Math.random().toString(16).substr(2, length)
}

const randomNumberInRange = (min, max) => {
    const delta = max - min;

    return Math.round(min + Math.random() * delta)
}


export {
    randomGenerator,
    randomNumberInRange
}
