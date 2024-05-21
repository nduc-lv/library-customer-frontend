'use client'
import { useRouter } from "next/navigation"
import BookInterface from "../interfaces/BookInterface"
import { Card } from 'antd';
const { Meta } = Card;
export default function Books({books}: {books: Array<BookInterface> | undefined}){
    const router = useRouter();
    if (!books) {
        return <div className="flex justify-center items-center">
            Loading....
        </div>
    }
    if (books.length == 0){
        return(<div className="flex justify-center items-center" style={{marginTop: 20}}>
                Không tìm thấy sách
            </div>
        )
    }
    return (
        <>
            <div className="grid grid-cols-4 gap-3 auto-rows-max" style={{padding: 20}}>
                {books.map((book) => {
                    return (
                        // <div className= "cursor-pointer" key =  {book._id} onClick = {() => router.push(`/bookDetails/${book._id}`)}>
                        //         <div>
                        //             {book.name}
                        //         </div>
                        //         <div>
                        //             {book.authors.map(
                        //                 (author) => {
                        //                     return (
                        //                         <div key={author._id}>
                        //                             {author.name}
                        //                         </div>
                        //                     )
                        //                 }
                        //             )}
                        //         </div>
                        //         <div>
                        //             {book.genres.map(
                        //                 (genre) => {
                        //                     return (
                        //                         <div key = {genre._id}>
                        //                             {genre.name}
                        //                         </div>
                        //                     )
                        //                 }
                        //             )}
                        //         </div>
                        // </div>
                        <div key={book._id} onClick = {() => router.push(`/bookDetails/${book._id}`)}>
                            <Card
                                hoverable
                                cover={<img alt="example" src={book.image} style={{height: 250}}/>}
                                
                            >
                                <Meta title={book.name} description={book.authors.map((author) => author.name).join(",")} />
                            </Card>
                        </div>
                    )
                })}
            </div>
        </>
    )
}