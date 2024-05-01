'use client'
import { useRouter } from "next/navigation"
import BookInterface from "../interfaces/BookInterface"

export default function Books({books}: {books: Array<BookInterface> | undefined}){
    const router = useRouter();
    if (!books) {
        return <>
            Loading....
        </>
    }
    if (books.length == 0){
        return<>
            Không tìm thấy sách
        </>
    }
    return (
        <>
            <div>
                {books.map((book) => {
                    return (
                        <div className= "cursor-pointer" key =  {book._id} onClick = {() => router.push(`/bookDetails/${book._id}`)}>
                                <div>
                                    {book.name}
                                </div>
                                <div>
                                    {book.authors.map(
                                        (author) => {
                                            return (
                                                <div key={author._id}>
                                                    {author.name}
                                                </div>
                                            )
                                        }
                                    )}
                                </div>
                                <div>
                                    {book.genres.map(
                                        (genre) => {
                                            return (
                                                <div key = {genre._id}>
                                                    {genre.name}
                                                </div>
                                            )
                                        }
                                    )}
                                </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}