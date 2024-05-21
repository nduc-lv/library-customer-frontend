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
import {Card} from 'antd'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    console.log(id);
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
            toast("Đăng nhập để bình luận về sách", {type: "error"})
        }
        else if (!value){
            toast("Nội dung bình luận rỗng", {type: "error"})
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
                placeholder="Nhập bình luận"
                autoSize={{ minRows: 3, maxRows: 5 }}
            />
            <Button onClick = {postComment}> Post </Button>
            </div>
                Sách chưa có bình luận nào
            </div>
        )
    } 
    return (
        <div style={{backgroundColor: 'white', padding: 20, paddingRight: 100, marginBottom: 20}} className='rounded-lg'>
            {/* post comment */}
            <ToastContainer></ToastContainer>
            <h1 style={{fontWeight: "bold", marginBottom: 20}}>Bình luận về sách</h1>
            <div className='flex flex-cols gap-4' style={{marginBottom: 10}}>
            <TextArea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Nhập bình luận"
                autoSize={{ minRows: 3, maxRows: 5 }}
            />
            <Button onClick = {postComment}> Đăng </Button>
            </div>
            <hr />
            <div style={{marginBottom: 20, padding: 20}}>
            {comments.map((comment) => {
                return (
                    <div key = {comment._id} className='flex flex-col gap-2'>
                        <div style={{fontSize: 12}}>{comment.customer.name}</div>
                        <pre style={{marginTop: 10, marginBottom: 10}} className='text-wrap overflow-y-auto overflow-x-hidden no-scrollbar'>{comment.content}</pre>
                        <div className='flex gap-4'>
                            {comment.customer._id == id ? <Button onClick={() => {setCommentId(curr => comment._id); setChangedContent(curr => comment.content);showModal()}}>Sửa bình luận</Button>: <></>}
                            {comment.customer._id == id ? <Button onClick={() => {setCommentId(curr => comment._id); showDeleteConfirm();}}>Xóa bình luận</Button> : <></>}
                        </div>
                        <hr/>
                        {/* Modal */}
                    </div>
                )
            })}
            </div>
            <Modal
                            open={open}
                            title="Sửa bình luận"
                            onOk={handleOk}
                            onCancel={handleCancel}
                            footer={[
                                <Button key="back" onClick={handleCancel}>
                                  Quay lại
                                </Button>,
                                <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                                  Đăng
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
            <div className='flex justify-center items-center'>
                <Pagination current={page} total={totalPages * 10} onChange={onChangePage}></Pagination>
            </div>
        </div>
    )
}