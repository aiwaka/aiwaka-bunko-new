//! 今日から一定日数前の日付をセットする.

// 一定期間の日数
const DURATION = 7;

/// ある日付データを入れると一定期間前倒しした日付がセットされる.
export const setPreviousDate = (date: Date) => {
  date.setDate(date.getDate() - DURATION);
};
