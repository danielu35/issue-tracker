import Image from "next/image";
import Pagination from "./component/Pagination";

interface Props {
  searchParams: searchParams;
}

interface searchParams {
  page: string;
}

// export default function Home({ searchParams }: { searchParams: { page: string } }) {
export default function Home({ searchParams }: Props) {
  return (
    <Pagination
      itemCount={100}
      pageSize={10}
      currentPage={parseInt(searchParams.page)}
    />
  );
}
