'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCreateCommentForm } from '@/hooks/formik/admin-dashboard/useCreateCommentFormik';

import Swal from 'sweetalert2';
import { Loader } from '@mantine/core';

import BaseTextArea from '@/component/modules/inputs/BaseTextArea/BaseTextArea';
import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
import CommentsIcon from '@/component/modules/icons/Comments.icon';
import PenIcon from '@/component/modules/icons/Pen.icon';
import ReplayIcon from '@/component/modules/icons/Replay.icon';
import TrashIcon from '@/component/modules/icons/Trash.icon';

import {
  getAllCommentApi,
  submitCommentApi,
  IComments,
  deleteCommentApi,
} from '@/data/server_request/dashboard/comments';
import { PaginationWithDataType } from '@/data/server_request/dashboard/product';
import getToken from '@/utils/getToken';
import { formatPersianCreatedAt } from '@/utils/dateConvertUtils';
import { showSwal } from '@/utils/swalHelper';

import styles from './Comments.module.css';

const CommentSection = () => {
  const { categoryid, productId } = useParams();
  const textareaRef = useRef<HTMLDivElement | null>(null);
  const [token, setToken] = useState<any>();
  
  useEffect(() => {
    const token = getToken();
    setToken(token);
  }, []);

  const [isOpenComment, setIsOpenComment] = useState(false);
  const [replayInfo, setReplayInfo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [commentData, setCommentData] =
    useState<PaginationWithDataType<IComments>>();

  const submitHandler = async (values: any) => {
    Swal.fire({
      title: 'آیا از ثبت نظر مطمئن هستید؟',
      icon: 'warning',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const payload = {
            ...values,
            parent: values.parent === null ? 0 : values.parent,
          };
          const res = await submitCommentApi(
            Number(categoryid),
            Number(productId),
            payload,
          );
          if (res.status === 201) {
            Swal.fire('نظر با موفقیت ثبت شد', '', 'success');
            callCommentApi();
            setFieldValue('comment_body', '');
            setFieldValue('parent', null);
            setIsOpenComment(false);
            setReplayInfo('');
          }
        } catch (error) {
          Swal.fire('خطایی رخ داد. مجدد تلاش کنید.', '', 'error');
        }
      }
    });
  };

  const { values, errors, handleChange, handleSubmit, setFieldValue } =
    useCreateCommentForm(submitHandler);

  const callCommentApi = async () => {
    try {
      const result = await getAllCommentApi(
        Number(categoryid),
        Number(productId),
      );
      setCommentData(result);
    } catch (error) {
      // console.log('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callCommentApi();
  }, []);

  const handleReplyClick = () => {
    if (textareaRef.current) {
      textareaRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderReplies = (parentPath: string) => {
    return commentData?.results
      .filter(
        (comment) =>
          comment.path.startsWith(parentPath) &&
          comment.path.length === parentPath.length + 4,
      )
      .map((comment) => (
        <div key={comment.id} className={styles.replyContainer}>
          <div className={styles.commentReplayBox}>
            <div className={styles.commentHeader}>
              <div className={styles.commentHeader_right}>
                <Image
                  src="/images/assets/user.png"
                  width={40}
                  height={40}
                  alt={'نظرات کاربران برای gs-tolls.ir'}
                  className={styles.avatar}
                />
                <div className={styles.commentHeader_info}>
                  <div className={styles.commentHeader_info_name}>
                    <span>{comment.user_name}</span>
                    <span>کاربر</span>
                  </div>
                  <span className={styles.date}>
                    {formatPersianCreatedAt(comment.created_at)}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.commentText}>
              <p>{comment.comment_body}</p>
            </div>
          </div>
          {renderReplies(comment.path)}
        </div>
      ));
  };

  const deleteHandler = async (commentId: number) => {
    Swal.fire({
      title: 'آیا از حذف مطمئن هستید؟',
      icon: 'warning',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteCommentApi(
            commentId,
            Number(categoryid),
            Number(productId),
          );
          if (res.status == 204) {
            showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
            callCommentApi();
          }
        } catch (error) {
          showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  return (
    <div className={styles.commentsSection}>
      {token?.token ? (
        <div className={styles.add_comment}>
          <div className={styles.header} ref={textareaRef}>
            <div className={styles.header_title}>
              <CommentsIcon />
              <h3>نظرات</h3>
            </div>
            <PrimaryButton
              leftSection={<PenIcon />}
              onClick={() => setIsOpenComment((prev) => !prev)}
            >
              ایجاد نظر جدید
            </PrimaryButton>
          </div>

          {isOpenComment && (
            <div className={styles.replyForm}>
              <div className={styles.commentHeaderText}>
                <div className={styles.commentHeader_right}>
                  <div className={styles.commentHeader_info}>
                    <div className={styles.commentHeader_info_name}>
                      <span>{replayInfo}</span>
                      <span> ثبت نظر جدید</span>
                    </div>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <BaseTextArea
                  label="نظر خود را بنویسید..."
                  name="comment_body"
                  value={values.comment_body}
                  onChange={handleChange}
                  error={errors.comment_body}
                  styles={{ input: { height: '150px' } }}
                />
                <div className={styles.commentBtns}>
                  <PrimaryButton
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setFieldValue('parent', null);
                      setReplayInfo('');
                      setIsOpenComment(false);
                      setFieldValue('comment_body', '');
                    }}
                  >
                    لغو
                  </PrimaryButton>
                  <PrimaryButton type="submit" variant="primary">
                    ارسال
                  </PrimaryButton>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center bg-slate-200 rounded-lg p-4 ">
          <h2 className="mb-4">برای ایجاد نظر ابتدا وارد سایت شوید!</h2>
          <Link href="/login">
            <PrimaryButton>ورود به سایت</PrimaryButton>
          </Link>
        </div>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {commentData?.results
            .filter((comment) => comment.depth === 1)
            .map((comment) => (
              <div key={comment.id} className={styles.commentContainer}>
                <div className={styles.commentBox}>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentHeader_right}>
                      <Image
                        src="/images/assets/user.png"
                        width={30}
                        height={30}
                        alt={comment.user_name}
                        className={styles.avatar}
                      />
                      <div className={styles.commentHeader_info}>
                        <div className={styles.commentHeader_info_name}>
                          <span>{comment.user_name}</span>
                          <span>
                            {comment.user_is_staff ? 'ادمین' : 'کاربر'}
                          </span>
                        </div>
                        <span className={styles.date}>
                          {formatPersianCreatedAt(comment.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.commentHeader_left}>
                      {token?.is_staff === true && (
                        <button
                          onClick={() => {
                            deleteHandler(comment.id);
                          }}
                          className={styles.replyBtnIcon}
                        >
                          <TrashIcon className="text-red-400" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setFieldValue('parent', comment.id);
                          setReplayInfo(comment.user_name);
                          setIsOpenComment(true);
                          handleReplyClick();
                        }}
                        className={styles.replyBtnIcon}
                      >
                        <ReplayIcon />
                      </button>
                    </div>
                  </div>
                  <div className={styles.commentText}>
                    <p>{comment.comment_body}</p>
                  </div>
                </div>
                {renderReplies(comment.path)}
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default CommentSection;
