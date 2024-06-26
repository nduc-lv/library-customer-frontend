interface BookInterface {
    _id: string,
    name: string,
    image: string
    genres: Array<{
        _id: string,
        name: string,
        __v: number
    }>,
    authors: Array<{
        _id: string,
        name: string,
        __v: number
    }
    >,
    review: string,
    quantity: number,
    __v: number
}
export default BookInterface