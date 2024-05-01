'use client'
import {useState, useEffect, useContext} from 'react'
import CommentInterface from '../interfaces/CommentInterface';
import http from '../utils/http';
import { Pagination } from 'antd';
import type { PaginationProps } from 'antd';
import { Input } from 'antd';
import { Button } from 'antd';
import { UserContext } from '../context/CustomerContext';
const { TextArea } = Input;
import { Modal, Space } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;
export default function Comments({bookId}: {bookId:string}){
    const [comments, setComments] = useState<Array<CommentInterface>>();
    const [page, setPage] = useState<number>(1);
    const [changedContent, setChangedContent] = useState<string>("");
    const [totalPages, setTotalPages] = useState<number>(-1);
    const [loading, setLoading] = useState<boolean>(false);
    const [commentId, setCommentId] = useState<string>("");
    const [value, setValue] = useState('');
    const {id} = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
      };
    
    const handleOk = async () => {
        try {
            setLoading(true);
            await http.postWithAutoRefreshToken("/changeComment", {
                commentId,
                content: changedContent,
            }, {useAccessToken: true});
            setLoading(false);
            await getComments();
            setOpen(false);
        }
        catch (e){
            console.log(e);
        }
      };
    
    const handleCancel = () => {
        setOpen(false);
    };
    const getComments = async () => {
        try {
            const data = await http.getWithAutoRefreshToken(`/getComments/${bookId}?limit=10&page=${page}`, {useAccessToken: false});
            console.log(data);
            if (data.comments){
                setComments([...data.comments]);
            }
            setTotalPages(curr => data.totalPages);
        }
        catch (e) {
            console.log(e);
        }
    }
    const onChangePage: PaginationProps['onChange'] = (pageNumber:number) => {
        setPage(current => pageNumber)
      };
    const postComment = async () => {
        if (!id){
            alert("Dang nhap")
        }
        else if (!value){
            alert("Noi dung rong")
        }
        else{
            try {
                await http.postWithAutoRefreshToken("/addComment", {bookId: bookId, content: value}, {useAccessToken:true});
                await getComments();
                setValue(curr => "");
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    const showDeleteConfirm = () => {
        confirm({
          title: 'Are you sure delete this task?',
          icon: <ExclamationCircleFilled />,
          content: 'Delete comment',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            http.postWithAutoRefreshToken('/deleteComment', {commentId}, {useAccessToken: true})
            .then(() => {getComments()})
            .catch((e) => {console.log(e)});
          },
          onCancel() {
            console.log('Cancel');
          },
    });}
    useEffect(() => {
        getComments();
    }, [page])
    if (!comments) {
        return (
            <>
                Loading....
            </>
        )
    }
    if (comments.length == 0) {
        return (
            <div>
                <div>
            <TextArea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Controlled autosize"
                autoSize={{ minRows: 3, maxRows: 5 }}
            />
            <Button onClick = {postComment}> Post </Button>
            </div>
                Sách chưa có bình luận nào
            </div>
        )
    } 
    return (
        <>
            {/* post comment */}
            <div>
            <TextArea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Controlled autosize"
                autoSize={{ minRows: 3, maxRows: 5 }}
            />
            <Button onClick = {postComment}> Post </Button>
            </div>
            {comments.map((comment) => {
                return (
                    <div key = {comment._id}>
                        <div>{comment.customer.name}</div>
                        <div>{comment.content}</div>
                        {comment.customer._id == id ? <Button onClick={() => {setCommentId(curr => comment._id); setChangedContent(curr => comment.content);showModal()}}>Change comment</Button>: <></>}
                        {comment.customer._id == id ? <Button onClick={() => {setCommentId(curr => comment._id); showDeleteConfirm();}}>Delete Comment</Button> : <></>}
                        {/* Modal */}
                    </div>
                )
            })}
            <Modal
                            open={open}
                            title="Title"
                            onOk={handleOk}
                            onCancel={handleCancel}
                            footer={[
                                <Button key="back" onClick={handleCancel}>
                                  Return
                                </Button>,
                                <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                                  Submit
                                </Button>
                            ]}
                            
                        >
                            <TextArea
                                value={changedContent}
                                onChange={(e) => setChangedContent(e.target.value)}
                                autoSize={{ minRows: 3, maxRows: 5 }}                            
                            >
                            </TextArea>
                        </Modal>
            <Pagination current={page} total={totalPages * 10} onChange={onChangePage}></Pagination>
        </>
    )
}