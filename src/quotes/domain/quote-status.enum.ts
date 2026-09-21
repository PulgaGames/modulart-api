export enum QuoteStatus {
  Pending = 'pending',
  Reviewed = 'reviewed',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export const ALLOWED_TRANSITIONS: Record<QuoteStatus, QuoteStatus[]> = {
  [QuoteStatus.Pending]: [QuoteStatus.Reviewed, QuoteStatus.Rejected],
  [QuoteStatus.Reviewed]: [QuoteStatus.Accepted, QuoteStatus.Rejected],
  [QuoteStatus.Accepted]: [],
  [QuoteStatus.Rejected]: [],
};
