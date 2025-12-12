import React from "react";

const ReviewRegister = () => {
  const shopOptions = ["水色りぼん", "fantasy", "女帝"];
  return (
    <div className="mx-24 my-12 px-6 py-6 h-[800px] border-t-2">
      <div className="flex flex-col space-y-2">
        <label className="font-sans">店名</label>
        <select className="px-2 py-1 border w-36 rounded">
          {shopOptions.map((shopOption) => {
            return <option key={shopOption}>{shopOption}</option>;
          })}
        </select>
      </div>
      <div className="p-4 space-y-2">
        <p className="font-sample text-xl">font-sample テスト</p>
        <p className="font-sans text-xl">font-sans テスト</p>
        <p className="text-red-500">text-red-500 テスト</p>
      </div>
      <div className="h-[100px]"></div>
      <div>嬢の名前</div>
      <div>推定年齢</div>
      <div>体型</div>
      <div>カップ数</div>
      <div>性格タイプ　明るい～おとなしい</div>
      <div>性格詳細</div>
    </div>
  );
};

export default ReviewRegister;
