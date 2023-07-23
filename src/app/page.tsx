import Post from "./components/post";

export default function Home() {
  return (
    <div className="container rounded-[0.5rem] bg-background mt-16">
      <h1 className="mb-2 max-w-5xl mx-auto">
        キーワードを入力してLPのキャプチャを検索！
      </h1>
      <Post />
    </div>
  );
}
