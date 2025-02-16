
import FlatButton from "@/components/button/FlatButton"
import LoadingMore from "@/components/LoadingMore"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import AppContext from "@/store/app"
import { toastSuccess } from "@/components/toast"
import { formatAddress, formatCommentDate } from "@/utils/utils"
import { useContext, useEffect, useMemo, useState } from "react"
import { useAccount } from "wagmi"
import { fetchCommentHistory, fetchCommentSubmit } from "@/api/token-detila"
import { CommentItemResponse } from "../types/response"
import { ERR_CODE } from "@/constants/ERR_CODE"

export default function Comments({tokenAddress}: {tokenAddress: string}) {
  const { state: {isLogin} } = useContext(AppContext)
  const { isConnected} = useAccount()
  const { onConnectWallet } = useContext(AppContext)
  const [comment, setComment] = useState('')
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)

  // comment list
  const [data, setData] = useState<CommentItemResponse[]>([])
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [total, setTotal] = useState<number>()
  const [page, setPage] = useState(1)
  
  const isDisabled = useMemo(() => {
    if (!isConnected) {
      return true
    }

    if (!isLogin) {
      return true
    }

    if (comment.length === 0) {
      return true;
    }

    if (isLoadingSubmit) {
      return true;
    }

    if (comment.trim().length < 1) {
      return true
    }

    return false;
  }, [isConnected, isLogin, comment, isLoadingSubmit])

  const submitComment = () => {
    setIsLoadingSubmit(true)
    
    fetchCommentSubmit(tokenAddress, comment).then(res => {
      if (res.code !== ERR_CODE.SUCCESS) {
        return
      }

      setComment('')
      setData(prev => [res.data,...prev])
      toastSuccess('Comment successful ')
    }).catch(() => {
      // toastError('Comment failed, please try again')
    }).finally(() => {
      setIsLoadingSubmit(false)
    })
  }

  const onLoadMore = () => {
    if (isLoadingList) return
    if (data.length === 0) return
    if (!total) return
    if (data.length >= total) return
    
    setPage(prev => prev + 1)
    getCommentHistory(page + 1)
  }

  const loadMoreRef = useInfiniteScroll({
    onLoadMore,
    loading: isLoadingList
  })

  const getCommentHistory = async (page: number) => {
    setIsLoadingList(true)
    fetchCommentHistory(tokenAddress, page).then(res => {
      setTotal(res.data.total)
      if (page === 1) {
        setData(res.data.list)
      } else {
        setData(prev => [...prev, ...res.data.list])
      }
      setIsLoadingList(false)
    }).finally(() => {
      setIsLoadingList(false)
    })
  }

  useEffect(() => {
    getCommentHistory(page)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full px-[0.91rem] mdup:px-[1.88rem] flex flex-col mt-[2rem]">
      <div className="w-full h-[9.375rem] mdup:h-[7.5rem] bg-white/20 rounded-[0.625rem] px-[1.35rem] py-[0.83rem] flex flex-col">
        <textarea 
          disabled={isLoadingSubmit}
          className=" w-full flex-1 font-medium text-white placeholder:text-white/40 bg-transparent outline-none resize-none" 
          placeholder="Write your comments"
          maxLength={250}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (isDisabled) return
            if (e.key === 'Enter' && !e.shiftKey) {
              submitComment()
            }
          }}
        />
        <div className="text-[0.875rem] text-white">{comment.length}/250</div>
      </div>

      { !isLogin && <FlatButton onClick={onConnectWallet} className="self-end !w-fit h-[2.25rem] mt-[1.16rem] px-[0.68rem]">
        Connect Wallet
      </FlatButton>}
      { isLogin && <FlatButton isDisabled={isDisabled} onClick={submitComment} className="self-end !w-[7.5rem] h-[2.25rem] mt-[1.16rem]">
        { !isLoadingSubmit && <span className={`text-[1rem] mdup:text-[1.125rem] font-medium text-[#636363] ${!isDisabled ? 'text-white' : 'text-black-40'}`}>
          Submit
        </span>}
        { isLoadingSubmit && <LoadingMore isDark={true} className="text-black-40 gap-1" />}
      </FlatButton>}
      
      {total !== undefined && total > 0 && <div className="text-[1rem] mdup:text-[1.125rem] font-medium text-white mt-[1.16rem]">Comment {total ? `(${total})` : ''}</div>}

      <div className="w-full flex flex-col">
        {data.map((item, index) => (
          <CommentItem key={index} data={item} />
        ))}
        <div ref={loadMoreRef} className="w-full"></div>
        { isLoadingList && <LoadingMore />}
      </div>

      
    </div>
  )
}

function CommentItem({data}: {data: CommentItemResponse}) {
  return (
    <div className="w-full flex flex-col border-b border-white/10 py-[1.1rem] mdup:py-[1.65rem] gap-[0.84rem] mdup:gap-[0.57rem]">
      <div className="flex justify-between items-center">
        <div className="relative w-[8.09rem] h-[1.875rem] mdup:w-[10rem] mdup:h-[2.125rem] rounded-[0.375rem] border border-red-10 flex items-center gap-[0.52rem] mdup:gap-[0.78rem] bg-[rgba(236,62,111,0.10)]">
          <div className=" size-[1.875rem] mdup:size-[2.125rem] bg-red-10 rounded-[0.25rem] overflow-hidden p-[0.06rem] pl-0">
            <img src={data.user_avatar} alt="avatar" className="w-full h-full object-cover rounded-[0.35rem]" />
          </div>
          <span className="text-[0.75rem] mdup:text-[0.875rem] font-medium">{formatAddress(data.user_address, 4, 6)}</span>
        </div>

        <div className="text-[0.875rem] mdup:text-[1rem] font-medium text-white flex items-center gap-[0.62rem]">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <g opacity="0.4">
              <path d="M12.8592 3.88867H2.35921C2.03705 3.88867 1.77588 4.14984 1.77588 4.47201V12.0553C1.77588 12.3775 2.03705 12.6387 2.35921 12.6387H12.8592C13.1814 12.6387 13.4425 12.3775 13.4425 12.0553V4.47201C13.4425 4.14984 13.1814 3.88867 12.8592 3.88867Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.69287 2.72205V5.05538" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7.9012 7.68042H4.69287" stroke="#1E2022" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10.5262 10.0137H4.69287" stroke="#1E2022" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10.5259 2.72205V5.05538" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </g>
          </svg>
          <span className=" text-[0.75rem] mdup:text-[0.875rem] font-medium text-white/50">{formatCommentDate(data.create_ts)}</span>
        </div>
      </div>

      <div className="text-[0.875rem] mdup:text-[1rem] break-words">
        {data.comment}
      </div>
    </div>
  )
}
