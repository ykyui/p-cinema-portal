
export const httpAuthResHelper = (e: Response) => {
    if (e.status == 401) {
        window.location.reload()
        return
    }
    return e
}

export const arrayGen = (lenght) => {
    const temp = []
    for (let index = 0; index < lenght; index++) {
        temp.push(undefined)
    }
    return temp
}