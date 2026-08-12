import PageTitle from "@/components/blogs/blog/PageTitle";
import Blog from "@/components/blogs/blog/Blog";
import PageMeta from "@/components/common/PageMeta";

const BlogPage = () => {
  return (
    <>
      <PageMeta
        title={"Blog"}
        description={"Shop incense, soaps, and food products online."}
      />
      <PageTitle />
      <Blog />
    </>
  );
};

export default BlogPage;
