import request from "./request"

export const fetchMarquee = async () => {
  return request({
    url: '/api/home/marquee',
    method: 'GET'
  })
}