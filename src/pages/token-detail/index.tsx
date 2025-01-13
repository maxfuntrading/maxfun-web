import { useParams } from "react-router-dom"

export default function TokenDetail() {
  const { tokenId } = useParams()
  console.log(tokenId)
  
  return (
    <div>TokenDetail</div>
  )
}
