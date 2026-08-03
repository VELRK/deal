import PageTitle from "@/components/blogs/blog/PageTitle";
import Blog from "@/components/blogs/blog/Blog";
import PageMeta from "@/components/common/PageMeta";

const BlogPage = () => {
  return (
    <>
      <PageMeta
        title={"Blog | 2Deal - Incense Sticks, Soaps & Food Products Store"}
        description={"2Deal - Incense Sticks, Soaps & Food Products Store"}
      />
      <PageTitle />
      <Blog />
    </>
  );
};

export default BlogPage;
