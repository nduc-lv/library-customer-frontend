interface CommentInterface {
    book: string,
    _id: string,
    content: string,
    timeStamp: Date,
    customer: {
        _id: string,
        name: string
    }
}

export default CommentInterface