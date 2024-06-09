'use client'
import { useRouter } from "next/navigation"
import BookInterface from "../interfaces/BookInterface"
import {Image} from 'antd';
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
            <div className="grid grid-cols-4 gap-2 auto-rows-max" style={{padding: 20}}>
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
                                cover={<Image preview={false} alt="bìa sách" src={`https://library-back-425902.df.r.appspot.com/images/${book.image}`} style={{height: 250}} fallback="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ_4drL9dKEWM3Xp5Fcn5mEBTD7aXG6g1D17KEIg8wKJI0tIU7Z"/>}
                                
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