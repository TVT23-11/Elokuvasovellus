import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";

function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();
  searchParams.get("list");
  console.log(searchParams.get('list'));
  return(
    <div>{searchParams.get('list')}</div>
  );
}

export default Movies;