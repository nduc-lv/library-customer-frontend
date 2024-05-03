import BookInterface from "./BookInterface";

interface RecordInterface {
    _id: string,
    book: BookInterface,
    customer: string,
    numberOfBooks: number,
    status: string,
    timeStart: string,
    timeEnd: string
}
export default RecordInterface