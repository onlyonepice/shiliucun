import { request } from '@/utils'

// 下一步
export const nextStep_V2 = ({ biddingLetterBidNextReq, biddingLegalPersonalityNextReq, biddingLegalAuthorizationNextReq, biddingMainProductsNextReq, biddingAuxiliaryProductsNextReq, biddingCompanyQualificationNextReq, biddingSupplementaryNextReq, complete, currentLocation, reportNo }) => {
  return request({
    url: `/eesa-report/bidding/BidBusinessData/front/v1.1/bidBusinessNext`,
    method: 'POST',
    data: {
      biddingLetterBidNextReq, biddingLegalPersonalityNextReq, biddingLegalAuthorizationNextReq, biddingMainProductsNextReq, biddingAuxiliaryProductsNextReq, biddingCompanyQualificationNextReq, biddingSupplementaryNextReq,
      complete, currentLocation, reportNo
    }
  })
}

// 上一步
export const lastStep_V2 = ({ currentLocation }) => {
  return request({
    url: `/eesa-report/bidding/BidBusinessData/front/v1.1/bidBusinessPrevious`,
    method: 'POST',
    data: {
      currentLocation
    }
  })
}

export const completeStep_V2 = (id) => {
  return request({
    url: `/eesa-report/bidding/BidBusinessData/front/v1.1/complete`,
    method: 'POST',
    data: {
      id
    }
  })
}
