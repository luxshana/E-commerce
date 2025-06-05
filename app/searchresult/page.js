import React, { Suspense } from "react";
import SearchResultClient from "./SearchResultClient";

export default function SearchResultPage() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchResultClient />
    </Suspense>
  );
}
