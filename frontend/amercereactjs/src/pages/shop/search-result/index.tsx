import PageTitle from "@/components/shop/search-result/PageTitle";
import Search from "@/components/shop/search-result/Search";
import Recent from "@/components/shop/search-result/Recent";
import { shopRouteMetadata } from "@/lib/metadata/shop";
import { useSearchParams } from "react-router-dom";
import PageMeta from "@/components/common/PageMeta";

const pageMeta = shopRouteMetadata(
  "Search results",
  "Find products and refine your search.",
);

const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") ?? "";
  return (
    <>
      <PageMeta title={pageMeta.title} description={pageMeta.description} />
      <PageTitle />
      <Search initialQuery={query} />
      <Recent query={query} />
    </>
  );
};

export default SearchResultPage;
