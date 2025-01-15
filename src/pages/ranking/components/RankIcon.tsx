import Rank1 from '@/assets/images/ranking/rank1.png'
import Rank2 from '@/assets/images/ranking/rank2.png'
import Rank3 from '@/assets/images/ranking/rank3.png'

const ranks = [Rank1, Rank2, Rank3]

export default function RankIcon({
  index,
  className,
}: {
  index: number
  className?: string
}) {
  return <img src={ranks[index]} alt="rank1" className={className} />
}
