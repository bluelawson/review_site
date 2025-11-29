import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

function TemporaryPageLink({ children }: Props) {
  return (
    <div className="px-3 py-2 flex items-center  bg-slate-300 rounded cursor-pointer hover:bg-slate-400">
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <div className="mx-24 my-12 px-6 py-6 h-[800px] space-x-3 flex items-start bg-slate-100">
        <TemporaryPageLink>
          <Link href={"/review/register"}>レビュー記事登録</Link>
        </TemporaryPageLink>
      </div>
    </>
  );
}
